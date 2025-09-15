# Property Registration API Documentation

## Overview
The Property Registration API provides endpoints for managing property registration forms for Uttar Pradesh. This API allows users to create, read, update, and delete property registration records.

## Base URL
```
http://localhost:4001/api/property-registration
```

## Authentication
All endpoints support optional authentication. When authenticated, users can only access their own property registrations.

## Endpoints

### 1. Create Property Registration

**POST** `/api/property-registration`

Creates a new property registration record.

#### Request Body
```json
{
  "seller_name": "राम प्रसाद शर्मा",
  "seller_father_name": "शिव प्रसाद शर्मा",
  "seller_address": "गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश",
  "seller_aadhaar": "123456789012",
  "seller_mobile": "9876543210",
  "buyer_name": "सीता देवी",
  "buyer_father_name": "राम कुमार",
  "buyer_address": "गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश",
  "buyer_aadhaar": "123456789013",
  "buyer_mobile": "9876543211",
  "property_address": "प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश",
  "property_type": "आवासीय",
  "area_sqm": "1200",
  "sale_price": "5000000",
  "registration_date": "2024-01-15"
}
```

#### Field Validation Rules
- **seller_name**: Required, string, max 100 characters
- **seller_father_name**: Required, string, max 100 characters
- **seller_address**: Required, string, max 500 characters
- **seller_aadhaar**: Required, exactly 12 digits
- **seller_mobile**: Required, exactly 10 digits
- **buyer_name**: Required, string, max 100 characters
- **buyer_father_name**: Required, string, max 100 characters
- **buyer_address**: Required, string, max 500 characters
- **buyer_aadhaar**: Required, exactly 12 digits
- **buyer_mobile**: Required, exactly 10 digits
- **property_address**: Required, string, max 500 characters
- **property_type**: Required, enum: "आवासीय", "व्यावसायिक", "कृषि"
- **area_sqm**: Required, string, max 50 characters
- **sale_price**: Required, string, max 50 characters
- **registration_date**: Required, ISO 8601 date format

#### Success Response (201)
```json
{
  "status": "success",
  "message": "Property registration created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "registration_number": "PR439011",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

#### Error Response (400)
```json
{
  "status": "failed",
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "विक्रेता का नाम आवश्यक है।",
      "path": "seller_name",
      "location": "body"
    }
  ]
}
```

### 2. Get All Property Registrations

**GET** `/api/property-registration`

Retrieves a paginated list of property registrations.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for names, addresses, or Aadhaar numbers
- `status` (optional): Filter by status ("pending", "approved", "rejected")

#### Success Response (200)
```json
{
  "status": "success",
  "message": "Property registrations retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "seller_name": "राम प्रसाद शर्मा",
      "seller_father_name": "शिव प्रसाद शर्मा",
      "seller_address": "गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश",
      "seller_aadhaar": "123456789012",
      "seller_mobile": "9876543210",
      "buyer_name": "सीता देवी",
      "buyer_father_name": "राम कुमार",
      "buyer_address": "गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश",
      "buyer_aadhaar": "123456789013",
      "buyer_mobile": "9876543211",
      "property_address": "प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश",
      "property_type": "आवासीय",
      "area_sqm": "1200",
      "sale_price": "5000000",
      "registration_date": "2024-01-15T00:00:00.000Z",
      "status": "pending",
      "createdBy": null,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 3. Get Property Registration by ID

**GET** `/api/property-registration/:id`

Retrieves a specific property registration by its ID.

#### Success Response (200)
```json
{
  "status": "success",
  "message": "Property registration retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "seller_name": "राम प्रसाद शर्मा",
    // ... other fields
  }
}
```

#### Error Response (404)
```json
{
  "status": "failed",
  "message": "Property registration not found"
}
```

### 4. Update Property Registration

**PUT** `/api/property-registration/:id`

Updates an existing property registration.

#### Request Body
Same as create endpoint, all fields are optional for updates.

#### Success Response (200)
```json
{
  "status": "success",
  "message": "Property registration updated successfully",
  "data": {
    // Updated property registration object
  }
}
```

### 5. Delete Property Registration

**DELETE** `/api/property-registration/:id`

Deletes a property registration.

#### Success Response (200)
```json
{
  "status": "success",
  "message": "Property registration deleted successfully"
}
```

### 6. Get Statistics

**GET** `/api/property-registration/stats`

Retrieves statistics about property registrations.

#### Success Response (200)
```json
{
  "status": "success",
  "message": "Property registration statistics retrieved successfully",
  "data": {
    "totalRegistrations": 150,
    "registrationsByStatus": [
      { "_id": "pending", "count": 75 },
      { "_id": "approved", "count": 60 },
      { "_id": "rejected", "count": 15 }
    ],
    "registrationsByMonth": [
      { "_id": "2024-01", "count": 25 },
      { "_id": "2024-02", "count": 30 }
    ],
    "registrationsByPropertyType": [
      { "_id": "आवासीय", "count": 100 },
      { "_id": "व्यावसायिक", "count": 35 },
      { "_id": "कृषि", "count": 15 }
    ]
  }
}
```

## Error Codes

- **400**: Bad Request - Validation failed
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **409**: Conflict - Duplicate registration
- **500**: Internal Server Error - Server error

## Rate Limiting

No rate limiting is currently implemented, but it's recommended for production use.

## CORS

The API supports CORS for the configured frontend origin.
