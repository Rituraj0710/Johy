const API_BASE = 'http://localhost:4001';

async function testLogin() {
  try {
    console.log('🧪 Testing Admin Login...\n');

    const loginResponse = await fetch(`${API_BASE}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'id-admin@gmail.com',
        password: 'admin1234'
      })
    });

    console.log('Response status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const responseText = await loginResponse.text();
    console.log('Response text:', responseText);
    
    try {
      const loginData = JSON.parse(responseText);
      console.log('Parsed JSON:', loginData);
    } catch (parseError) {
      console.log('JSON parse error:', parseError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLogin();
