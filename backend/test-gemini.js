const axios = require('axios');
const apiKey = 'YOUR_GEMINI_API_KEY';

async function listModels() {
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    console.log(res.data.models.map(m => m.name).join('\n'));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
listModels();
