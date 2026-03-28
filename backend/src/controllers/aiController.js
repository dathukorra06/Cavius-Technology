const { callAnthropic } = require('../config/ai');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/ai/health
exports.healthCheck = (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const configured = (geminiKey && geminiKey !== 'your-api-key-here') || 
                     (anthropicKey && anthropicKey !== 'your-api-key-here');
  
  sendSuccess(res, configured ? 'AI service is ready' : 'AI service not configured', {
    configured,
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
  });
};

// POST /api/ai/generate-content  [Protected]
exports.generateContent = async (req, res, next) => {
  try {
    const { topic, tone = 'professional' } = req.body;
    if (!topic) return sendError(res, 'Topic is required', 400);

    const prompt = `Act as an expert blog writer. Write a comprehensive, engaging blog post about "${topic}". 
Tone: ${tone}. 
Structure: intro, 3-5 sections with headers, and conclusion. 
Format: Return markdown. Length: ~600-900 words.`;

    const content = await callAnthropic(prompt, 1800);
    sendSuccess(res, 'Content generated', { content });
  } catch (err) {
    if (err.message.includes('not configured')) return sendError(res, err.message, 503);
    if (err.message.includes('Quota Exceeded')) return sendError(res, err.message, 429);
    next(err);
  }
};

// POST /api/ai/summarize  [Protected]
exports.summarize = async (req, res, next) => {
  try {
    const { text, length = 'medium' } = req.body;
    if (!text) return sendError(res, 'Text is required', 400);

    const words = { short: '50-75', medium: '100-150', long: '200-250' };
    const prompt = `Summarize the following text in ${words[length] || '100-150'} words. Maintain a clear and concise tone:\n\n${text}`;

    const summary = await callAnthropic(prompt, 500);
    sendSuccess(res, 'Text summarized', { summary });
  } catch (err) {
    if (err.message.includes('not configured')) return sendError(res, err.message, 503);
    if (err.message.includes('Quota Exceeded')) return sendError(res, err.message, 429);
    next(err);
  }
};

// POST /api/ai/suggest-title  [Protected]
exports.suggestTitle = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return sendError(res, 'Content is required', 400);

    const prompt = `Suggest 5 compelling, SEO-friendly titles for the following content. 
Return ONLY a valid JSON array of 5 strings and NO other text.
Content:\n${content.substring(0, 1500)}`;

    const raw = await callAnthropic(prompt, 400);
    let titles;
    try {
      // Improved regex to strip markdown code blocks if present
      const jsonMatch = raw.match(/\[.*\]/s);
      titles = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      titles = raw.split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(l => l.length > 5).slice(0, 5);
    }
    sendSuccess(res, 'Titles suggested', { titles });
  } catch (err) {
    if (err.message.includes('not configured')) return sendError(res, err.message, 503);
    if (err.message.includes('Quota Exceeded')) return sendError(res, err.message, 429);
    next(err);
  }
};

// POST /api/ai/improve-content  [Protected]
exports.improveContent = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return sendError(res, 'Content is required', 400);

    const prompt = `Act as an expert editor. Improve the following blog content. 
Make it more engaging, fix grammar, and enhance flow. 
Return ONLY the improved content:\n\n${content}`;

    const improved = await callAnthropic(prompt, 2000);
    sendSuccess(res, 'Content improved', { improved });
  } catch (err) {
    if (err.message.includes('not configured')) return sendError(res, err.message, 503);
    if (err.message.includes('Quota Exceeded')) return sendError(res, err.message, 429);
    next(err);
  }
};
