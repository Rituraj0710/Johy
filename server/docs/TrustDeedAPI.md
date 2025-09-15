# Trust Deed API Documentation

## Overview
The Trust Deed API provides endpoints for creating, retrieving, updating, and deleting trust deed documents. This API supports both JSON and multipart/form-data requests for file uploads.

## Base URL
```
http://localhost:4000/api/trust-deed
```

## Authentication
All endpoints support optional authentication. When authentication is required, include the JWT token in cookies or Authorization header.

## Endpoints

### 1. Create Trust Deed
**POST** `/api/trust-deed`

Creates a new trust deed with the provided information.

#### Request Body (multipart/form-data)
```javascript
{
  // Basic Trust Information
  "trustName": "श्री राम ट्रस्ट",
  "trustAddress": "मुंबई, महाराष्ट्र, भारत",
  "startingAmount_number": "1000000",
  "startingAmount_words": "दस लाख रुपये",
  
  // Trustee Information (dynamic - can have multiple)
  "trusteeSalutation_1": "श्री", // "श्री" or "श्रीमती"
  "trusteePosition_1": "अध्यक्ष", // "अध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"
  "trusteeName_1": "राम कुमार",
  "trusteeRelation_1": "राम प्रसाद", // Father/Husband name
  "trusteeAddress_1": "दिल्ली, भारत",
  "trusteeMobile_1": "9876543210",
  "trusteeIdType_1": "आधार कार्ड", // "आधार कार्ड" or "पैन कार्ड"
  "trusteeIdNumber_1": "123456789012",
  "trusteeIdCard_1": [File], // Optional file upload
  "trusteePhoto_1": [File], // Optional file upload
  
  // Multiple trustees (trusteeSalutation_2, trusteePosition_2, etc.)
  
  // Functional Domains (dynamic)
  "functionalDomain_1": "शिक्षा क्षेत्र",
  "functionalDomain_2": "स्वास्थ्य क्षेत्र",
  
  // Purposes (predefined checkboxes)
  "purpose": ["अनाथ बच्चों को स्कूल की शिक्षा देना", "स्वास्थ्य संबंधी लोगों की मदद करना"],
  
  // Other Purposes (dynamic)
  "otherPurpose_1": "वृक्षारोपण",
  "otherPurpose_2": "पर्यावरण संरक्षण",
  
  // Terms (predefined checkboxes)
  "terms": ["ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।"],
  
  // Other Terms (dynamic)
  "otherTerm_1": "विशेष नियम",
  
  // Witnesses (optional)
  "witnessName_1": "सुरेश कुमार",
  "witnessRelation_1": "राम प्रसाद",
  "witnessAddress_1": "गाजियाबाद, उत्तर प्रदेश",
  "witnessMobile_1": "9876543211",
  "witnessIdType_1": "आधार कार्ड",
  "witnessIdNumber_1": "123456789013",
  "witnessIdCard_1": [File], // Optional
  "witnessPhoto_1": [File], // Optional
  
  // Witness 2 (optional)
  "witnessName_2": "महेश कुमार",
  "witnessRelation_2": "राम प्रसाद",
  "witnessAddress_2": "गाजियाबाद, उत्तर प्रदेश",
  "witnessMobile_2": "9876543212",
  "witnessIdType_2": "पैन कार्ड",
  "witnessIdNumber_2": "ABCDE1234F"
}
```

#### Response
**201 Created**
```json
{
  "status": "success",
  "message": "Trust Deed created successfully",
  "data": {
    "id": "64f8b2c3e4a5b6c7d8e9f0a1",
    "trustName": "श्री राम ट्रस्ट",
    "created_at": "2024-01-15T10:30:00.000Z",
    "files": [
      {
        "field": "trusteeIdCard_1",
        "path": "uploads/trustdeed/1705315800000_document.pdf",
        "originalName": "aadhar_card.pdf",
        "mimeType": "application/pdf",
        "size": 1024000
      }
    ]
  }
}
```

**400 Bad Request**
```json
{
  "status": "failed",
  "message": "Missing required fields: trustName, trustAddress, startingAmount_number, startingAmount_words"
}
```

### 2. Get All Trust Deeds
**GET** `/api/trust-deed`

Retrieves all trust deeds with pagination support.

#### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Response
**200 OK**
```json
{
  "status": "success",
  "data": {
    "trustDeeds": [
      {
        "_id": "64f8b2c3e4a5b6c7d8e9f0a1",
        "trustName": "श्री राम ट्रस्ट",
        "trustAddress": "मुंबई, महाराष्ट्र, भारत",
        "startingAmount": {
          "number": "1000000",
          "words": "दस लाख रुपये"
        },
        "created_at": "2024-01-15T10:30:00.000Z",
        "trustees": [
          {
            "name": "राम कुमार",
            "position": "अध्यक्ष"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 3. Get Trust Deed by ID
**GET** `/api/trust-deed/:id`

Retrieves a specific trust deed by its ID.

#### Response
**200 OK**
```json
{
  "status": "success",
  "data": {
    "_id": "64f8b2c3e4a5b6c7d8e9f0a1",
    "trustName": "श्री राम ट्रस्ट",
    "trustAddress": "मुंबई, महाराष्ट्र, भारत",
    "startingAmount": {
      "number": "1000000",
      "words": "दस लाख रुपये"
    },
    "trustees": [
      {
        "salutation": "श्री",
        "position": "अध्यक्ष",
        "name": "राम कुमार",
        "relation": "राम प्रसाद",
        "address": "दिल्ली, भारत",
        "mobile": "9876543210",
        "idType": "आधार कार्ड",
        "idNumber": "123456789012",
        "idCardFile": "uploads/trustdeed/1705315800000_document.pdf",
        "photoFile": null
      }
    ],
    "functionalDomains": ["शिक्षा क्षेत्र", "स्वास्थ्य क्षेत्र"],
    "purposes": ["अनाथ बच्चों को स्कूल की शिक्षा देना"],
    "otherPurposes": ["वृक्षारोपण"],
    "terms": ["ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।"],
    "otherTerms": ["विशेष नियम"],
    "witnesses": [
      {
        "name": "सुरेश कुमार",
        "relation": "राम प्रसाद",
        "address": "गाजियाबाद, उत्तर प्रदेश",
        "mobile": "9876543211",
        "idType": "आधार कार्ड",
        "idNumber": "123456789013",
        "idCardFile": null,
        "photoFile": null
      }
    ],
    "files": [],
    "createdBy": null,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**404 Not Found**
```json
{
  "status": "failed",
  "message": "Trust deed not found"
}
```

### 4. Update Trust Deed
**PUT** `/api/trust-deed/:id`

Updates an existing trust deed (implementation pending).

#### Response
**501 Not Implemented**
```json
{
  "status": "failed",
  "message": "Update functionality not yet implemented"
}
```

### 5. Delete Trust Deed
**DELETE** `/api/trust-deed/:id`

Deletes a trust deed by its ID.

#### Response
**200 OK**
```json
{
  "status": "success",
  "message": "Trust deed deleted successfully"
}
```

### 6. Get Statistics
**GET** `/api/trust-deed/stats`

Retrieves statistics about trust deeds.

#### Response
**200 OK**
```json
{
  "status": "success",
  "data": {
    "totalTrustDeeds": 25,
    "totalTrustees": 75,
    "avgTrusteesPerDeed": 3.0
  }
}
```

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "status": "failed",
  "message": "Invalid request data"
}
```

**401 Unauthorized**
```json
{
  "status": "failed",
  "message": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "status": "failed",
  "message": "Access denied"
}
```

**404 Not Found**
```json
{
  "status": "failed",
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "status": "failed",
  "message": "Internal server error",
  "error": "Detailed error message (development only)"
}
```

## File Upload Constraints

- **Maximum file size**: 10MB
- **Maximum files**: 20 files per request
- **Allowed file types**: PDF, JPEG, JPG, PNG, GIF, DOC, DOCX, TXT
- **Upload directory**: `uploads/trustdeed/`

## Validation Rules

### Required Fields
- `trustName`: String, max 100 characters
- `trustAddress`: String, max 500 characters
- `startingAmount_number`: Numeric string
- `startingAmount_words`: String, max 200 characters
- At least one trustee with all required fields

### Trustee Required Fields
- `trusteePosition_X`: Must be one of: "अध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"
- `trusteeName_X`: String, max 100 characters
- `trusteeRelation_X`: String, max 100 characters
- `trusteeAddress_X`: String, max 500 characters
- `trusteeMobile_X`: Must match Indian mobile pattern: `/^[6-9]\d{9}$/`
- `trusteeIdNumber_X`: String, max 20 characters

### Optional Fields
- File uploads for trustees and witnesses
- Functional domains (unlimited)
- Purposes and terms (unlimited)
- Witnesses (0-2 witnesses)

## Rate Limiting
- No rate limiting implemented currently
- Consider implementing `express-rate-limit` for production

## CORS Configuration
- Origin: Configurable via `FRONTEND_HOST` environment variable
- Credentials: Enabled for cookie-based authentication
