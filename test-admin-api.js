// Test admin login API directly
const baseUrl = 'http://localhost:4001';

async function testAdminLoginAPI() {
  console.log('🔍 Testing Admin Login API\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Check if server is running
    console.log('1. Checking server health...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Server is running:', healthData.message);
    
    // Test 2: Try admin login
    console.log('\n2. Testing admin login...');
    const loginData = {
      email: 'id-admin@gmail.com',
      password: 'admin1234'
    };
    
    console.log('Login attempt:', loginData);
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    console.log('Response status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    const responseText = await loginResponse.text();
    console.log('Raw response:', responseText);
    
    if (responseText) {
      try {
        const loginResult = JSON.parse(responseText);
        console.log('Parsed response:', loginResult);
        
        if (loginResult.success) {
          console.log('✅ Admin login successful!');
          console.log('User data:', loginResult.data.user);
        } else {
          console.log('❌ Admin login failed:', loginResult.message);
        }
      } catch (parseError) {
        console.log('❌ Failed to parse response as JSON:', parseError.message);
      }
    } else {
      console.log('❌ Empty response received');
    }
    
  } catch (error) {
    console.log('\n❌ Test Failed!');
    console.log('=' .repeat(60));
    console.log('Error Details:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Type: ${error.name}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎉 Admin Login API Test Complete!');
  console.log('=' .repeat(60));
}

testAdminLoginAPI();
