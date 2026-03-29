const axios = require('axios');
(async () => {
  try {
    const r = await axios.post('http://localhost:5000/api/auth/register', {
      username: `test-sample-${Date.now()}`,
      email: `sample-${Date.now()}@test.com`,
      password: 'Pass123!'
    });
    console.log('OK', r.data);
  } catch (e) {
    if (e.response) {
      console.error('STATUS', e.response.status);
      console.error('DATA', JSON.stringify(e.response.data, null, 2));
    } else {
      console.error('ERROR', e.message);
    }
  }
})();