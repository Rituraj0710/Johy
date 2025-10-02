const API_BASE = 'http://localhost:4001';

async function testFrontendStaffCreation() {
  try {
    console.log('🧪 Testing Frontend Staff Creation API Call...\n');

    // First, login as admin
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
    if (!loginData.success) {
      console.error('❌ Admin login failed');
      return;
    }

    const token = loginData.data.token;
    console.log('✅ Admin login successful\n');

    // Test staff creation with frontend-like data
    console.log('2. Creating staff member (frontend simulation)...');
    const staffData = {
      name: 'Frontend Test Staff',
      email: 'frontendtest@test.com',
      phone: '+1555123456', // Using a different phone number
      password: 'Test123!@#',
      role: 'staff1',
      department: 'Frontend Testing',
      employeeId: 'FE001',
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
    const createData = await createResponse.json();
    console.log('Create response:', createData);

    if (createData.status === 'success') {
      console.log('✅ Staff creation successful!');
      console.log('Staff ID:', createData.staff.id);
      console.log('Staff Name:', createData.staff.name);
      console.log('Staff Email:', createData.staff.email);
      console.log('Staff Role:', createData.staff.role);
    } else {
      console.error('❌ Staff creation failed:', createData.message);
    }

    // Test getting all staff
    console.log('\n3. Fetching all staff...');
    const getStaffResponse = await fetch(`${API_BASE}/api/admin/staff`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const getStaffData = await getStaffResponse.json();
    console.log('Get staff response status:', getStaffResponse.status);
    console.log('Staff count:', getStaffData.staff?.length || 0);

    if (getStaffData.staff) {
      console.log('Staff members:');
      getStaffData.staff.forEach((staff, index) => {
        console.log(`${index + 1}. ${staff.name} (${staff.email}) - Role: ${staff.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFrontendStaffCreation();
