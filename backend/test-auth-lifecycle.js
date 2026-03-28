const axios = require('axios');

async function run() {
  try {
    const email = 'realtest@example.com';
    const pwd = 'password123';
    
    console.log("Registering...");
    await axios.post('http://localhost:5000/api/auth/register', {
      username: 'realtest' + Date.now(),
      email: email,
      password: pwd,
      firstName: 'Real',
      lastName: 'Test'
    });
    
    console.log("Logging in...");
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: pwd
    });
    
    console.log("SUCCESS LOGIN:", res.data);
  } catch(e) {
    if (e.response && e.response.data && e.response.data.message === 'Email already exists') {
      // Email is already used, just try to login
      console.log("Already registered, Logging in...");
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'realtest@example.com',
        password: 'password123'
      });
      console.log("SUCCESS LOGIN:", res.data);
    } else {
      console.error("FAILED:", e.response ? e.response.data : e.message);
    }
  }
}
run();
