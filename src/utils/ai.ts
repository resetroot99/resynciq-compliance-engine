import { Configuration, OpenAIApi } from 'openai';
import { extractTextFromPdf } from './pdf';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function analyzeEstimate(fileUrl: string) {
  try {
    // Extract text from PDF/image
    const text = await extractTextFromPdf(fileUrl);

    // Analyze with GPT-4
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in auto repair estimates. Analyze the following estimate for compliance issues and provide detailed feedback."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    });

    // Process the response
    const analysis = completion.data.choices[0].message?.content;
    
    return {
      raw: analysis,
      structured: processAnalysis(analysis || ''),
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
}

function processAnalysis(analysis: string) {
  // Convert the raw analysis into structured data
  // This is a placeholder implementation
  return {
    complianceScore: 0.95,
    issues: [],
    recommendations: [],
  };
} 