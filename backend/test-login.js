const axios = require('axios');

async function run() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log("SUCCESS:", res.data);
  } catch(e) {
    console.error("FAILED:", e.response ? e.response.data : e.message);
  }
}
run();
