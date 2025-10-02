// Using built-in fetch

const API_BASE = 'http://localhost:4001';

async function testStaffCreation() {
  try {
    console.log('🧪 Testing Staff Creation API...\n');

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

    const token = loginData.token;
    console.log('✅ Admin login successful\n');

    // Now test staff creation
    console.log('2. Creating staff member...');
    const staffData = {
      name: 'Test Staff Member',
      email: 'teststaff@test.com',
      phone: '1234567890',
      password: 'Test123!@#',
      role: 'staff1',
      department: 'IT Department',
      employeeId: 'EMP001',
      status: 'active'
    };

    const createResponse = await fetch(`${API_BASE}/api/admin/staff/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(staffData)
    });

    const createData = await createResponse.json();
    console.log('Create staff response status:', createResponse.status);
    console.log('Create staff response:', createData);

    if (createData.status === 'success') {
      console.log('✅ Staff creation successful');
    } else {
      console.error('❌ Staff creation failed:', createData.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStaffCreation();
