# Sale Deed API Documentation

## Overview
The Sale Deed API provides comprehensive endpoints for managing property sale deed documents. It supports creating, reading, updating, and deleting sale deed records with flexible JSON schema storage.

## Base URL
```
http://localhost:4001/api/sale-deed
```

## Authentication
All endpoints support optional JWT authentication. To enable authentication, uncomment the passport middleware in the routes file.

## Endpoints

### 1. Create Sale Deed
**POST** `/api/sale-deed`

Creates a new sale deed record.

#### Request Body
```json
{
  "documentType": "sale-deed",
  "propertyType": "residential",
  "plotType": "flat",
  "salePrice": 5000000,
  "circleRateAmount": 15000,
  "areaInputType": "total",
  "area": 1200,
  "areaUnit": "sq_feet",
  "state": "Delhi",
  "district": "New Delhi",
  "tehsil": "Central Delhi",
  "village": "Connaught Place",
  "sellers": [
    {
      "name": "John Doe",
      "relation": "Son of Richard Doe",
      "address": "123 Main Street, Delhi",
      "mobile": "9876543210",
      "idType": "aadhaar",
      "idNo": "1234-5678-9012"
    }
  ],
  "buyers": [
    {
      "name": "Jane Smith",
      "relation": "Daughter of Robert Smith",
      "address": "456 Park Avenue, Delhi",
      "mobile": "9876543211",
      "idType": "aadhaar",
      "idNo": "9876-5432-1098"
    }
  ],
  "witnesses": [
    {
      "name": "Witness One",
      "relation": "Son of Father One",
      "address": "789 Witness Street, Delhi",
      "mobile": "9876543212"
    }
  ],
  "calculations": {
    "salePrice": 5000000,
    "totalPlotAreaSqMeters": 111.48,
    "stampDuty": 108654,
    "registrationCharge": 15522,
    "finalPayableAmount": 124176
  }
}
```

#### Response
```json
{
  "status": "success",
  "message": "Sale Deed saved successfully",
  "id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "files": []
}
```

### 2. Get All Sale Deeds
**GET** `/api/sale-deed`

Retrieves all sale deeds with pagination and filtering.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `propertyType` (optional): Filter by property type
- `documentType` (optional): Filter by document type
- `state` (optional): Filter by state (case-insensitive)
- `district` (optional): Filter by district (case-insensitive)

#### Example Request
```
GET /api/sale-deed?page=1&limit=10&propertyType=residential&state=Delhi
```

#### Response
```json
{
  "status": "success",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "documentType": "sale-deed",
      "propertyType": "residential",
      "salePrice": 5000000,
      "state": "Delhi",
      "createdBy": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "created_at": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50
  }
}
```

### 3. Get Sale Deed by ID
**GET** `/api/sale-deed/:id`

Retrieves a specific sale deed by its ID.

#### Response
```json
{
  "status": "success",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "documentType": "sale-deed",
    "propertyType": "residential",
    "salePrice": 5000000,
    "sellers": [...],
    "buyers": [...],
    "witnesses": [...],
    "calculations": {...},
    "createdBy": {...},
    "created_at": "2023-09-06T10:30:00.000Z",
    "updated_at": "2023-09-06T10:30:00.000Z"
  }
}
```

### 4. Update Sale Deed
**PUT** `/api/sale-deed/:id`

Updates an existing sale deed record.

#### Request Body
Same structure as create endpoint, with updated values.

#### Response
```json
{
  "status": "success",
  "message": "Sale deed updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "documentType": "sale-deed",
    "salePrice": 5500000,
    "updated_at": "2023-09-06T11:00:00.000Z"
  }
}
```

### 5. Delete Sale Deed
**DELETE** `/api/sale-deed/:id`

Deletes a sale deed record.

#### Response
```json
{
  "status": "success",
  "message": "Sale deed deleted successfully"
}
```

### 6. Get Statistics
**GET** `/api/sale-deed/stats`

Retrieves statistics for dashboard display.

#### Response
```json
{
  "status": "success",
  "data": {
    "total": 150,
    "totalSaleValue": 750000000,
    "avgSaleValue": 5000000,
    "propertyTypeBreakdown": [
      {
        "_id": "residential",
        "count": 100
      },
      {
        "_id": "commercial",
        "count": 30
      },
      {
        "_id": "agriculture",
        "count": 20
      }
    ],
    "documentTypeBreakdown": [
      {
        "_id": "sale-deed",
        "count": 120
      },
      {
        "_id": "gift-deed",
        "count": 20
      },
      {
        "_id": "partition-deed",
        "count": 10
      }
    ]
  }
}
```

## Data Schema

### Core Fields
- `documentType`: Type of deed (sale-deed, gift-deed, partition-deed, etc.)
- `propertyType`: Property type (residential, commercial, agriculture, industrial)
- `plotType`: Plot type (vacant, buildup, flat, multistory)
- `salePrice`: Sale consideration price in INR
- `circleRateAmount`: Circle rate amount per unit area in INR

### Property Information
- `areaInputType`: Input type (total, dimensions)
- `area`: Property area value
- `areaUnit`: Area unit (sq_meters, sq_feet, acre, etc.)
- `propertyLength`: Length for dimension input
- `propertyWidth`: Width for dimension input
- `dimUnit`: Dimension unit (meters, feet)

### Location Details
- `state`: State name (required)
- `district`: District name (required)
- `tehsil`: Tehsil name (required)
- `village`: Village/Locality name (required)
- `khasraNo`: Khasra/Survey number
- `plotNo`: Plot number
- `colonyName`: Colony name
- `wardNo`: Ward number
- `streetNo`: Street number
- `roadSize`: Road size
- `roadUnit`: Road unit (meter, foot)
- `doubleSideRoad`: Boolean for double side road

### Property Directions
- `directionNorth`: North direction description
- `directionEast`: East direction description
- `directionSouth`: South direction description
- `directionWest`: West direction description

### Dynamic Arrays
- `sellers`: Array of seller objects
- `buyers`: Array of buyer objects
- `witnesses`: Array of witness objects
- `rooms`: Array of room objects (for flat properties)
- `trees`: Array of tree objects (for agriculture properties)
- `shops`: Array of shop areas (for commercial properties)
- `mallFloors`: Array of mall floor areas
- `facilities`: Array of selected facilities
- `dynamicFacilities`: Array of custom facilities

### Calculations
- `calculations`: Object containing all calculation results
  - `salePrice`: Sale consideration price
  - `totalPlotAreaSqMeters`: Total plot area in square meters
  - `totalBuildupAreaSqMeters`: Total built-up area in square meters
  - `baseCircleRateValue`: Base circle rate value
  - `finalCircleRateValue`: Final circle rate value after additions
  - `stampDuty`: Calculated stamp duty
  - `registrationCharge`: Calculated registration charge
  - `finalPayableAmount`: Total payable amount
  - `deductionAmount`: Any deductions applied

## File Uploads

The API supports file uploads for documents and images. Files are stored in the `uploads/saledeed/` directory.

### Supported File Types
- PDF documents
- Images (JPEG, PNG, GIF)
- Word documents
- Text files

### File Size Limits
- Maximum file size: 10MB
- Maximum files per request: 10

## Error Handling

All endpoints return consistent error responses:

```json
{
  "status": "failed",
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Usage Examples

### Frontend Integration

```javascript
// Create a sale deed
const createSaleDeed = async (formData) => {
  const response = await fetch('/api/sale-deed', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  });
  
  return await response.json();
};

// Get all sale deeds with pagination
const getSaleDeeds = async (page = 1, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    ...filters
  });
  
  const response = await fetch(`/api/sale-deed?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};
```

## Database Collection

The API uses MongoDB with the collection name `sale_deeds`. The schema is flexible and supports JSON fields for dynamic data storage.

## Security Considerations

1. **Authentication**: JWT-based authentication is supported but optional
2. **Authorization**: Users can only access their own records (when authenticated)
3. **File Upload Security**: File type validation and size limits
4. **Input Validation**: Server-side validation for required fields
5. **CORS**: Configured for specific frontend origins

## Performance Considerations

1. **Pagination**: All list endpoints support pagination
2. **Indexing**: Consider adding database indexes for frequently queried fields
3. **File Storage**: Files are stored on disk with organized directory structure
4. **Caching**: Consider implementing caching for statistics and frequently accessed data
