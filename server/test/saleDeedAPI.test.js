// Test file for Sale Deed API endpoints
// This file demonstrates how to use the Sale Deed API

const testSaleDeedData = {
  documentType: "sale-deed",
  propertyType: "residential",
  plotType: "flat",
  salePrice: 5000000,
  circleRateAmount: 15000,
  areaInputType: "total",
  area: 1200,
  areaUnit: "sq_feet",
  state: "Delhi",
  district: "New Delhi",
  tehsil: "Central Delhi",
  village: "Connaught Place",
  khasraNo: "123/45",
  plotNo: "A-123",
  colonyName: "CP",
  wardNo: "1",
  streetNo: "15",
  roadSize: 30,
  roadUnit: "meter",
  doubleSideRoad: true,
  directionNorth: "Main Road",
  directionEast: "Park",
  directionSouth: "Residential Area",
  directionWest: "Commercial Complex",
  coveredParkingCount: 2,
  openParkingCount: 1,
  deductionType: "female",
  sellers: [
    {
      name: "John Doe",
      relation: "Son of Richard Doe",
      address: "123 Main Street, Delhi",
      mobile: "9876543210",
      idType: "aadhaar",
      idNo: "1234-5678-9012"
    }
  ],
  buyers: [
    {
      name: "Jane Smith",
      relation: "Daughter of Robert Smith",
      address: "456 Park Avenue, Delhi",
      mobile: "9876543211",
      idType: "aadhaar",
      idNo: "9876-5432-1098"
    }
  ],
  witnesses: [
    {
      name: "Witness One",
      relation: "Son of Father One",
      address: "789 Witness Street, Delhi",
      mobile: "9876543212"
    },
    {
      name: "Witness Two",
      relation: "Daughter of Mother Two",
      address: "321 Another Street, Delhi",
      mobile: "9876543213"
    }
  ],
  rooms: [
    {
      type: "bedroom",
      length: 12,
      width: 10
    },
    {
      type: "kitchen",
      length: 8,
      width: 6
    }
  ],
  calculations: {
    salePrice: 5000000,
    totalPlotAreaSqMeters: 111.48,
    totalBuildupAreaSqMeters: 111.48,
    baseCircleRateValue: 155220,
    finalCircleRateValue: 155220,
    stampDuty: 108654,
    registrationCharge: 15522,
    finalPayableAmount: 124176,
    deductionAmount: 0,
    propertyType: "residential",
    plotType: "flat"
  }
};

// Example API calls (these would be made from your frontend or testing tool)

// 1. Create a new sale deed
const createSaleDeed = async () => {
  const response = await fetch('http://localhost:4001/api/sale-deed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    },
    body: JSON.stringify(testSaleDeedData)
  });
  
  const result = await response.json();
  console.log('Create Sale Deed:', result);
  return result.id;
};

// 2. Get all sale deeds
const getAllSaleDeeds = async () => {
  const response = await fetch('http://localhost:4001/api/sale-deed?page=1&limit=10', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    }
  });
  
  const result = await response.json();
  console.log('Get All Sale Deeds:', result);
  return result;
};

// 3. Get a specific sale deed by ID
const getSaleDeedById = async (id) => {
  const response = await fetch(`http://localhost:4001/api/sale-deed/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    }
  });
  
  const result = await response.json();
  console.log('Get Sale Deed by ID:', result);
  return result;
};

// 4. Update a sale deed
const updateSaleDeed = async (id) => {
  const updateData = {
    ...testSaleDeedData,
    salePrice: 5500000, // Updated price
    calculations: {
      ...testSaleDeedData.calculations,
      salePrice: 5500000
    }
  };
  
  const response = await fetch(`http://localhost:4001/api/sale-deed/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    },
    body: JSON.stringify(updateData)
  });
  
  const result = await response.json();
  console.log('Update Sale Deed:', result);
  return result;
};

// 5. Get statistics
const getStats = async () => {
  const response = await fetch('http://localhost:4001/api/sale-deed/stats', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    }
  });
  
  const result = await response.json();
  console.log('Get Stats:', result);
  return result;
};

// 6. Delete a sale deed
const deleteSaleDeed = async (id) => {
  const response = await fetch(`http://localhost:4001/api/sale-deed/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Add authorization header if authentication is enabled
      // 'Authorization': 'Bearer your-jwt-token'
    }
  });
  
  const result = await response.json();
  console.log('Delete Sale Deed:', result);
  return result;
};

// Example usage (uncomment to test)
/*
const testAPI = async () => {
  try {
    // Create a sale deed
    const id = await createSaleDeed();
    
    // Get all sale deeds
    await getAllSaleDeeds();
    
    // Get specific sale deed
    await getSaleDeedById(id);
    
    // Update sale deed
    await updateSaleDeed(id);
    
    // Get statistics
    await getStats();
    
    // Delete sale deed
    await deleteSaleDeed(id);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAPI();
*/

export {
  testSaleDeedData,
  createSaleDeed,
  getAllSaleDeeds,
  getSaleDeedById,
  updateSaleDeed,
  getStats,
  deleteSaleDeed
};
