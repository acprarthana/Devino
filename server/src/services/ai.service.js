const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function buildPrompt({ codeSnippet, stage, projectContext, requirements = [], expectedOutput = '' }) {
  const requirementBullet = requirements.map((req, i) => `${i + 1}. ${req}`).join('\n');
  const prompt = `You are a secure code validation assistant for an educational full-stack project.

Stage: ${stage}
Project Context: ${JSON.stringify(projectContext)}

Requirements:
${requirementBullet || '- No special requirements provided -'}

Expected Output:
${expectedOutput || '- No expected output provided -'}

Code:

${codeSnippet}

Return ONLY valid JSON (no markdown), with this exact shape:
{
  "approved": true | false,
  "score": 0-100,
  "feedback": "Actionable feedback summary",
  "errors": [{"rule": "..", "message": ".."}],
  "warnings": [{"rule": "..", "message": ".."}],
  "suggestions": [".."],
  "model": "gemini-1.5-flash",
  "promptHash": "<sha256>"
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
    throw new Error('AI service unavailable');
  }
}

function safeJSONParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizeResult(parsed, raw) {
  if (!parsed || typeof parsed !== 'object') {
    return {
      approved: false,
      score: 0,
      feedback: 'AI response could not be parsed to JSON. Please retry.',
      errors: [{ rule: 'parse_error', message: 'Could not parse AI response' }],
      warnings: [],
      suggestions: ['Resubmit code or contact support.'],
      model: 'gemini-1.5-flash',
      promptHash: null,
      rawResponse: raw,
    };
  }

  const approved = Boolean(parsed.approved);
  const score = Number(parsed.score || 0);

  return {
    approved,
    score: Math.max(0, Math.min(100, isNaN(score) ? 0 : score)),
    feedback: parsed.feedback || (approved ? 'Looks good.' : 'Not approved yet.'),
    errors: Array.isArray(parsed.errors) ? parsed.errors : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    model: parsed.model || 'gemini-1.5-flash',
    promptHash: parsed.promptHash || null,
    rawResponse: parsed,
  };
}

function computePromptHash(data) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

async function analyzeCode(payload) {
  const prompt = buildPrompt(payload);
  try {
    const rawResponse = await callGemini(prompt);
    const parsed = safeJSONParse(rawResponse);

    const normalized = normalizeResult(parsed, rawResponse);
    normalized.promptHash = normalized.promptHash || computePromptHash(payload);
    normalized.rawResponse = normalized.rawResponse || rawResponse;
    return normalized;
  } catch (error) {
    console.error('analyzeCode exception:', error);
    return {
      approved: false,
      score: 0,
      feedback: 'AI validation failed; retry later.',
      errors: [{ rule: 'ai_failure', message: error.message }],
      warnings: [],
      suggestions: ['Retry code submission.'],
      model: 'gemini-unavailable',
      promptHash: computePromptHash(payload),
      rawResponse: {},
    };
  }
}

module.exports = { analyzeCode };
