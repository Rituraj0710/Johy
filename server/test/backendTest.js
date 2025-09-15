import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4001';

// Test data for Will Deed
const willDeedTestData = {
  data: JSON.stringify({
    meta: {
      title: "Test Will Deed",
      date: new Date().toISOString()
    },
    testator: {
      name: "John Doe",
      age: 45,
      address: "123 Test Street"
    },
    beneficiaries: [
      {
        name: "Jane Doe",
        relationship: "Daughter",
        share: "50%"
      }
    ]
  })
};

// Test data for Sale Deed
const saleDeedTestData = {
  data: JSON.stringify({
    documentType: "sale-deed",
    propertyType: "residential",
    plotType: "flat",
    salePrice: 5000000,
    circleRateAmount: 4500000,
    state: "Test State",
    district: "Test District",
    tehsil: "Test Tehsil",
    village: "Test Village",
    sellers: [
      {
        name: "Test Seller",
        relation: "Self",
        address: "Test Address"
      }
    ],
    buyers: [
      {
        name: "Test Buyer",
        relation: "Self",
        address: "Test Address"
      }
    ]
  })
};

async function testBackend() {
  console.log('🧪 Testing Backend API Endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    try {
      const response = await fetch(`${BASE_URL}/api/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`   ✅ Server is running (Status: ${response.status})`);
    } catch (error) {
      console.log(`   ❌ Server is not running: ${error.message}`);
      return;
    }

    // Test 2: Test Will Deed API
    console.log('\n2. Testing Will Deed API...');
    try {
      const response = await fetch(`${BASE_URL}/api/will-deed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(willDeedTestData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Will Deed API working (Status: ${response.status})`);
        console.log(`   📄 Created Will Deed ID: ${result.id}`);
      } else {
        console.log(`   ⚠️  Will Deed API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Will Deed API error: ${error.message}`);
    }

    // Test 3: Test Sale Deed API
    console.log('\n3. Testing Sale Deed API...');
    try {
      const response = await fetch(`${BASE_URL}/api/sale-deed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(saleDeedTestData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Sale Deed API working (Status: ${response.status})`);
        console.log(`   📄 Created Sale Deed ID: ${result.id}`);
      } else {
        console.log(`   ⚠️  Sale Deed API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Sale Deed API error: ${error.message}`);
    }

    // Test 4: Test Sale Deed GET endpoint
    console.log('\n4. Testing Sale Deed GET endpoint...');
    try {
      const response = await fetch(`${BASE_URL}/api/sale-deed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Sale Deed GET API working (Status: ${response.status})`);
        console.log(`   📊 Found ${result.data?.length || 0} sale deeds`);
      } else {
        console.log(`   ⚠️  Sale Deed GET API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Sale Deed GET API error: ${error.message}`);
    }

    console.log('\n🎉 Backend testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBackend();
