const axios = require('axios');

async function test() {
  const apiKey = 'YOUR_GEMINI_API_KEY';
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  try {
    const res = await axios.post(url, {
      contents: [{ parts: [{ text: "Hello" }] }]
    });
    console.log("SUCCESS:", res.data.candidates[0].content.parts[0].text);
  } catch(e) {
    console.log("ERROR:", e.response?.data || e.message);
  }
}
test();
