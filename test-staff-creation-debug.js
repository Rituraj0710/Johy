const API_BASE = 'http://localhost:4001';

async function testStaffCreationDebug() {
  try {
    console.log('🧪 Testing Staff Creation API with Debug...\n');

    // First, let's login as admin to get a token
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'id-admin@gmail.com',
        password: 'admin1234'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      console.error('❌ Admin login failed');
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Admin login successful\n');

    // Now test staff creation
    console.log('2. Creating staff member...');
    const staffData = {
      name: 'Test Staff Member',
      email: 'teststaff2@test.com',
      phone: '+1987654321',
      password: 'Test123!@#',
      role: 'staff1',
      department: 'IT Department',
      employeeId: 'EMP002',
      status: 'active'
    };

    console.log('Staff data:', staffData);

    const createResponse = await fetch(`${API_BASE}/api/admin/staff/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staffData)
    });

    console.log('Create response status:', createResponse.status);
    console.log('Create response headers:', Object.fromEntries(createResponse.headers.entries()));
    
    const responseText = await createResponse.text();
    console.log('Create response text:', responseText);
    
    try {
      const createData = JSON.parse(responseText);
      console.log('Parsed create response:', createData);
    } catch (parseError) {
      console.log('JSON parse error:', parseError.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStaffCreationDebug();
