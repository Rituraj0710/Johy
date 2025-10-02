// Decode JWT token to check payload structure
const jwt = require('jsonwebtoken');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGRkMTI0YjI4YTI0OTQyYmExNWE0OTciLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImlkLWFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTc1OTMxOTg2NCwiZXhwIjoxNzU5NDA2MjY0fQ.8kex2V6Mw7rHk65gVn4BmCNB8n9RJGktIm_nMkOxVSI';

try {
  // Decode without verification to see the payload
  const decoded = jwt.decode(token);
  console.log('JWT Payload:', JSON.stringify(decoded, null, 2));
  
  // Check if userId exists
  console.log('userId in payload:', decoded.userId);
  console.log('id in payload:', decoded.id);
  
} catch (error) {
  console.log('Error decoding JWT:', error.message);
}
