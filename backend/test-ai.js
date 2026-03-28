require('dotenv').config({ path: 'src/.env' }); // or just hardcode
const { callAnthropic } = require('./src/config/ai');

// manually set process.env for test
// process.env.ANTHROPIC_API_KEY = 'your_key_here';

async function run() {
  try {
    const res = await callAnthropic("Hello, tell me a 5 word joke.", 1500);
    console.log("SUCCESS:", res);
  } catch(e) {
    console.error("FAILED:", e.message);
  }
}
run();
