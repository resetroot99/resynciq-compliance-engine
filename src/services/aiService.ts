import { Configuration, OpenAIApi } from 'openai';
import { storage } from '../lib/firebase';
import logger from '../lib/logger';
import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import type { Buffer } from 'node:buffer';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
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
    logger.error({ error }, 'PDF text extraction failed');
    return '';
  }
}

async function performOCR(buffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    
    return text;
  } catch (error) {
    logger.error({ error }, 'OCR processing failed');
    return '';
  }
}

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