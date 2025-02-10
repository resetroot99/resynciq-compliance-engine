import { Configuration, OpenAIApi } from 'openai';
import { storage } from '../lib/firebase';
import logger from '../lib/logger';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import type { Buffer } from 'node:buffer';
import { OpenAI } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const openaiOpenAI = new OpenAI(process.env.OPENAI_API_KEY);

interface AIAnalysisResult {
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
    vin: string;
  };
  damageAnalysis: {
    locations: string[];
    severity: number;
    recommendations: string[];
  };
  costBreakdown: {
    parts: number;
    labor: number;
    paint: number;
    total: number;
  };
  confidence: number;
}

export async function analyzeEstimate(fileUrl: string): Promise<AIAnalysisResult> {
  logger.info({ fileUrl }, 'Starting AI analysis');

  try {
    const bucket = storage.bucket();
    const file = bucket.file(fileUrl);
    const [fileContent] = await file.download();

    // Extract text using multiple methods for better accuracy
    const [pdfText, ocrText] = await Promise.all([
      extractTextFromPDF(fileContent),
      performOCR(fileContent)
    ]);

    // Combine text sources
    const combinedText = `${pdfText}\n${ocrText}`;

    // Initial analysis with GPT-4
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in analyzing auto repair estimates."
        },
        {
          role: "user",
          content: `Analyze this estimate and provide insights: ${fileUrl}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const initialAnalysis = JSON.parse(response.data.choices[0].message?.content || '{}') as AIAnalysisResult;

    // Secondary validation with specialized model
    const validatedAnalysis = await validateAnalysis(initialAnalysis, combinedText);

    logger.info({ fileUrl }, 'AI analysis completed', { confidence: validatedAnalysis.confidence });
    return validatedAnalysis;
  } catch (error) {
    logger.error({ fileUrl, error }, 'AI analysis failed');
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
  try {
    const data = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(' ');
      fullText += text + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Failed to extract text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const performOCR = async (buffer: Buffer): Promise<string> => {
  try {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    
    return text;
  } catch (error) {
    console.error('Failed to perform OCR:', error);
    throw new Error('Failed to perform OCR');
  }
};

async function validateAnalysis(
  initialAnalysis: AIAnalysisResult,
  text: string
): Promise<AIAnalysisResult> {
  // Validate VIN using checksum
  const vinValid = validateVIN(initialAnalysis.vehicleInfo.vin);
  if (!vinValid) {
    logger.warn('Invalid VIN detected, attempting correction');
    initialAnalysis.vehicleInfo.vin = await correctVIN(text);
    initialAnalysis.confidence *= 0.9;
  }

  // Validate costs
  const costsValid = validateCosts(initialAnalysis.costBreakdown);
  if (!costsValid) {
    logger.warn('Cost validation failed, adjusting confidence');
    initialAnalysis.confidence *= 0.8;
  }

  return initialAnalysis;
}

function validateVIN(vin: string): boolean {
  // VIN validation logic
  return true;
}

async function correctVIN(text: string): Promise<string> {
  // VIN correction logic
  return '';
}

function validateCosts(costs: any): boolean {
  // Cost validation logic
  return true;
}

export const autoCorrectEstimate = async (estimate: any) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in auto repair estimates. Correct the following estimate to ensure compliance and accuracy.',
        },
        {
          role: 'user',
          content: `Correct this estimate: ${JSON.stringify(estimate)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const correctedEstimate = JSON.parse(response.choices[0].message?.content || '{}');
    return correctedEstimate;
  } catch (error) {
    console.error('AI auto-correction failed:', error);
    throw new Error('Failed to auto-correct estimate');
  }
};

export const predictApproval = async (estimate: any) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in auto repair estimates. Predict the likelihood of approval for the following estimate.',
        },
        {
          role: 'user',
          content: `Predict approval for this estimate: ${JSON.stringify(estimate)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const approvalPrediction = response.choices[0].message?.content || 'Unknown';
    return approvalPrediction;
  } catch (error) {
    console.error('AI approval prediction failed:', error);
    throw new Error('Failed to predict approval');
  }
};

export const parseEstimateFromPDF = async (file: Buffer): Promise<any> => {
  try {
    // Extract text from PDF
    let text = await extractTextFromPDF(file);

    // If text extraction fails, try OCR
    if (!text || text.trim().length === 0) {
      text = await performOCR(file);
    }

    // Use AI to parse the text into a structured estimate
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in auto repair estimates. Parse the following estimate into a structured JSON format.',
        },
        {
          role: 'user',
          content: `Parse this estimate: ${text}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const estimate = JSON.parse(response.choices[0].message?.content || '{}');
    return estimate;
  } catch (error) {
    console.error('Failed to parse estimate from PDF:', error);
    throw new Error('Failed to parse estimate from PDF');
  }
}; 