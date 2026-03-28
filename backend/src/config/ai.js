const axios = require('axios');

const callGeminiBase = async (prompt, maxTokens = null) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;
  const model = process.env.AI_MODEL || 'gemini-2.0-flash';

  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  if (maxTokens) {
    payload.generationConfig = { maxOutputTokens: maxTokens };
  }

  const response = await axios.post(
    GEMINI_API_URL,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (response.data.candidates && response.data.candidates.length > 0) {
    const part = response.data.candidates[0].content?.parts?.[0];
    if (part) {
      return part.text;
    } else if (response.data.candidates[0].finishReason === 'SAFETY') {
      throw new Error('Content was blocked by Gemini safety filters.');
    } else {
      throw new Error('Gemini returned an empty response.');
    }
  } else {
    throw new Error('No candidates returned from Gemini API. It might be blocked or empty.');
  }
};

const callGeminiWithRetry = async (prompt, maxTokens = null, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await callGeminiBase(prompt, maxTokens);
    } catch (error) {
      const isQuotaError = error.response?.status === 429;
      const isFinalRetry = i === retries - 1;

      if (isQuotaError && !isFinalRetry) {
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      if (isQuotaError) {
        throw new Error('Gemini API Quota Exceeded. Please try again in 1 minute or upgrade your plan.');
      }

      const errorData = error.response?.data;
      if (errorData && errorData.error) {
        throw new Error(errorData.error.message || 'Google Gemini API Error');
      }
      throw error;
    }
  }
};

module.exports = { callAnthropic: callGeminiWithRetry };
