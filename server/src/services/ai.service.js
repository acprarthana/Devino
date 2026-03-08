const { GoogleGenerativeAI } = require('@google/generative-ai'); 
const axios = require('axios'); 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 

function buildPrompt(codeSnippet, stage, projectContext) {
  const prompt = `
    Analyze the following code snippet for a project in stage: ${stage}.
    Project context: ${projectContext}.
    Code:
    ${codeSnippet}
    
    Provide feedback in the following JSON structure:
    {
      "review": "Overall code review summary",
      "stageValidation": "Is the stage complete? (yes/no) with reasoning",
      "errors": ["List of errors with explanations"],
      "suggestions": ["List of improvement suggestions"]
    }
  `;
  return prompt;
}

async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get AI response');
  }
}


function parseResponse(rawResponse) {
  try {
    const parsed = JSON.parse(rawResponse);
    if (!parsed.review || !parsed.stageValidation || !Array.isArray(parsed.errors) || !Array.isArray(parsed.suggestions)) {
      throw new Error('Invalid response structure');
    }
    return parsed;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      review: 'Unable to parse review',
      stageValidation: 'Unable to determine',
      errors: ['Parsing error'],
      suggestions: ['Check response format']
    };
  }
}

async function analyzeCode(codeSnippet, stage, projectContext) {
  const prompt = buildPrompt(codeSnippet, stage, projectContext);
  const rawResponse = await callGemini(prompt);
  const structuredResponse = parseResponse(rawResponse);
  return structuredResponse;
}
module.exports = { analyzeCode };