# Property Sale Certificate API Documentation

## Overview
This API provides endpoints for managing Property Sale Certificates, including creating, retrieving, updating, and deleting certificates with comprehensive form fields and multiple file upload support.

## Base URL
```
http://localhost:4001/api/property-sale-certificate
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Property Sale Certificate
**POST** `/api/property-sale-certificate`

Creates a new property sale certificate with comprehensive form fields and multiple file uploads.

#### Request Body (FormData)

##### Bank/Secured Creditor Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bank_select | string | Yes | बैंक का नाम |
| bank_other | string | No | अन्य बैंक का नाम (if bank_select is "Other") |
| bank_reg_off | string | Yes | पंजीकृत कार्यालय का पता |
| bank_head_off | string | Yes | प्रधान कार्यालय |
| bank_pan | string | No | बैंक का PAN |
| bank_post | string | No | बैंक का पद |

##### Bank Representative Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bank_rep_title | string | Yes | शीर्षक (श्री, श्रीमती, सुश्री) |
| bank_rep_name | string | Yes | बैंक प्रतिनिधि का नाम |
| bank_rep_rel | string | Yes | संबंध (पुत्र, पत्नी, पुत्री, etc.) |
| bank_rep_father_name | string | Yes | पिता/पति का नाम |
| bank_rep_occ | string | No | पेशा |
| bank_rep_mobile | string | Yes | मोबाइल नंबर (10 digits) |
| bank_rep_email | string | No | ईमेल |
| bank_rep_addr | string | Yes | पता |
| bank_rep_photo | file | No | बैंक प्रतिनिधि का फोटो |

##### Acknowledgement Receipt
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ack_amount | number | Yes | रसीद की राशि (₹ में) |
| ack_amount_words | string | No | राशि शब्दों में |

##### Previous Owner Information
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| previous_owner | string | Yes | पूर्व-स्वामी का नाम |
| acquisition_mode | string | Yes | मोड ऑफ एक्विजिशन |
| bank_power | string | Yes | बैंक को संपत्ति पर अधिकार कैसे मिला |

##### Property Details
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| prop_category | string | Yes | संपत्ति श्रेणी (Residential, Commercial, Industrial, Agriculture) |
| prop_subtype | string | Yes | उपयोग |
| construction_type | string | No | निर्माण प्रकार |
| prop_state | string | Yes | राज्य |
| prop_tehsil | string | Yes | तहसील |
| prop_ward | string | Yes | वार्ड/गांव/कॉलोनी |
| prop_khasra | string | No | खसरा नंबर |
| prop_plot | string | No | प्लॉट नंबर |
| prop_flat_floor | string | No | फ्लैट/फ्लोर |
| covered_area | number | No | कवर्ड एरिया (वर्ग मीटर में) |
| super_area | number | No | सुपर एरिया (वर्ग मीटर में) |
| plot_area_val | number | No | प्लॉट क्षेत्रफल मूल्य |
| plot_area_unit | string | No | प्लॉट क्षेत्रफल इकाई (sqft, sqyd, sqm) |
| plot_area_sqm | number | No | प्लॉट क्षेत्रफल (वर्ग मीटर में) |
| road_size_val | number | No | रोड साइज मूल्य |
| road_size_unit | string | No | रोड साइज इकाई |
| road_size_m | number | No | रोड साइज (मीटर में) |
| road_double | boolean | No | डबल रोड |
| park_facing | boolean | No | पार्क फेसिंग |
| corner_plot | boolean | No | कॉर्नर प्लॉट |
| prop_address | string | Yes | संपत्ति का पूरा पता |
| prop_photo | file | No | संपत्ति का फोटो |

##### Boundary Details
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bd_north | string | Yes | उत्तर दिशा की सीमा |
| bd_south | string | Yes | दक्षिण दिशा की सीमा |
| bd_east | string | Yes | पूर्व दिशा की सीमा |
| bd_west | string | Yes | पश्चिम दिशा की सीमा |

##### Circle Rate and Stamp Duty
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| circle_rate | number | Yes | सर्किल रेट (प्रति वर्ग मीटर में) |
| circle_rate_value | number | No | संपत्ति का मूल्यांकन |
| stamp_duty | number | Yes | स्टाम्प ड्यूटी |
| registration_fee | number | No | पंजीकरण शुल्क |
| total_property_cost | number | No | कुल लागत |
| stamp_no | string | Yes | ई-स्टाम्प नंबर |
| stamp_amount_manual | number | Yes | स्टाम्प राशि (₹) |
| stamp_date | date | Yes | स्टाम्प की तारीख |

##### Legal Details
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| legal_rule_select | string | Yes | लागू नियम और विनियम |
| legal_clauses | string | Yes | कानूनी क्लॉज |
| power_authority | array | Yes | अधिकार और शक्तियां |

##### Agreement Details
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| agreement_no | string | Yes | एग्रीमेंट संख्या |
| agreement_date | date | Yes | एग्रीमेंट की तारीख |
| payment_terms | string | Yes | भुगतान योजना/शर्तें |

##### Payment Totals
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| total_amount | number | No | कुल राशि (₹) |
| total_words | string | No | राशि शब्दों में |
| currency_label | string | No | मुद्रा लेबल |

##### Other Details
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| advocate_name | string | Yes | एडवोकेट का नाम |
| draft_date | date | Yes | ड्राफ्ट प्रिंट होने की तिथि |

##### Dynamic Arrays (JSON strings)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| purchasers | string | No | खरीददार की जानकारी (JSON array) |
| witnesses | string | No | गवाह की जानकारी (JSON array) |
| payments | string | No | भुगतान विवरण (JSON array) |
| floors | string | No | फ्लोर विवरण (JSON array) |

##### Dynamic File Uploads
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| purchaser_photo_{id} | file | No | खरीददार का फोटो |
| witness_photo_{id} | file | No | गवाह का फोटो |

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificate saved successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

### 2. Get All Property Sale Certificates
**GET** `/api/property-sale-certificate`

Retrieves all property sale certificates with pagination and filtering options.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of items per page |
| search | string | - | Search in bank_rep_name, prop_address, agreement_no, stamp_no |
| prop_category | string | - | Filter by property category |
| start_date | date | - | Filter by draft date (start) |
| end_date | date | - | Filter by draft date (end) |

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificates retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "bank_select": "SBI",
      "bank_reg_off": "123 Main Street, Mumbai",
      "bank_head_off": "456 Corporate Avenue, Mumbai",
      "bank_rep_name": "राम शर्मा",
      "bank_rep_father_name": "शिव शर्मा",
      "bank_rep_addr": "789 Bank Colony, Mumbai",
      "bank_rep_mobile": "9876543210",
      "bank_rep_email": "ram.sharma@sbi.com",
      "ack_amount": 5000000,
      "previous_owner": "कृष्ण कुमार",
      "acquisition_mode": "बैंक द्वारा अधिग्रहण",
      "bank_power": "एसएआरएफएईएसआई अधिनियम के तहत",
      "prop_category": "Residential",
      "prop_subtype": "Flat",
      "prop_address": "प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली",
      "prop_state": "Uttar Pradesh",
      "prop_tehsil": "Ghaziabad",
      "prop_ward": "Noida",
      "bd_north": "राम शर्मा का घर",
      "bd_south": "मुख्य सड़क",
      "bd_east": "पार्क",
      "bd_west": "शर्मा जी का घर",
      "circle_rate": 10000,
      "circle_rate_value": 1800000,
      "stamp_duty": 90000,
      "registration_fee": 18000,
      "total_property_cost": 1898000,
      "stamp_no": "EST123456789",
      "stamp_amount_manual": 90000,
      "stamp_date": "2024-01-15T00:00:00.000Z",
      "legal_rule_select": "SARFAESI_Act",
      "legal_clauses": "यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।",
      "power_authority": ["full_ownership", "right_to_sell"],
      "agreement_no": "AGR2024001",
      "agreement_date": "2024-01-15T00:00:00.000Z",
      "payment_terms": "कुल कीमत 3 किस्तों में भुगतान की गई",
      "total_amount": 5000000,
      "total_words": "पचास लाख रुपये मात्र",
      "currency_label": "रुपये मात्र",
      "advocate_name": "अडवोकेट राजेश कुमार",
      "draft_date": "2024-01-15T00:00:00.000Z",
      "purchasers": [
        {
          "id": 1,
          "title": "श्री",
          "name": "अर्जुन सिंह",
          "rel": "पुत्र",
          "father_name": "राज सिंह",
          "addr": "321, हिल रोड, पुणे",
          "idtype": "आधार",
          "idno": "111122223333",
          "occ": "सॉफ्टवेयर इंजीनियर",
          "pan": "ABCDE1234F",
          "mobile": "9234567890",
          "email": "arjun.singh@email.com"
        }
      ],
      "witnesses": [
        {
          "id": 1,
          "title": "श्री",
          "name": "गोपाल यादव",
          "rel": "पुत्र",
          "father_name": "हरि यादव",
          "addr": "654, टेम्पल रोड, चेन्नई",
          "idtype": "आधार",
          "idno": "444455556666",
          "occ": "व्यापारी",
          "mobile": "9345678901"
        }
      ],
      "payments": [
        {
          "id": 1,
          "amount": 5000000,
          "mode": "NEFT",
          "ref": "NEFT123456789",
          "date": "2024-01-15T00:00:00.000Z",
          "bank": "SBI"
        }
      ],
      "floors": [],
      "file_uploads": {
        "bank_rep_photo": "uploads/property-sale-certificates/bank_rep_photo-1234567890.jpg",
        "prop_photo": "uploads/property-sale-certificates/prop_photo-1234567890.jpg",
        "purchaser_photos": ["uploads/property-sale-certificates/purchaser_photo_1-1234567890.jpg"],
        "witness_photos": ["uploads/property-sale-certificates/witness_photo_1-1234567890.jpg"]
      },
      "createdBy": "507f1f77bcf86cd799439012",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
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

### 3. Get Property Sale Certificate by ID
**GET** `/api/property-sale-certificate/:id`

Retrieves a specific property sale certificate by its ID.

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificate retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bank_select": "SBI",
    "bank_reg_off": "123 Main Street, Mumbai",
    "bank_head_off": "456 Corporate Avenue, Mumbai",
    "bank_rep_name": "राम शर्मा",
    "bank_rep_father_name": "शिव शर्मा",
    "bank_rep_addr": "789 Bank Colony, Mumbai",
    "bank_rep_mobile": "9876543210",
    "bank_rep_email": "ram.sharma@sbi.com",
    "ack_amount": 5000000,
    "previous_owner": "कृष्ण कुमार",
    "acquisition_mode": "बैंक द्वारा अधिग्रहण",
    "bank_power": "एसएआरएफएईएसआई अधिनियम के तहत",
    "prop_category": "Residential",
    "prop_subtype": "Flat",
    "prop_address": "प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली",
    "prop_state": "Uttar Pradesh",
    "prop_tehsil": "Ghaziabad",
    "prop_ward": "Noida",
    "bd_north": "राम शर्मा का घर",
    "bd_south": "मुख्य सड़क",
    "bd_east": "पार्क",
    "bd_west": "शर्मा जी का घर",
    "circle_rate": 10000,
    "circle_rate_value": 1800000,
    "stamp_duty": 90000,
    "registration_fee": 18000,
    "total_property_cost": 1898000,
    "stamp_no": "EST123456789",
    "stamp_amount_manual": 90000,
    "stamp_date": "2024-01-15T00:00:00.000Z",
    "legal_rule_select": "SARFAESI_Act",
    "legal_clauses": "यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।",
    "power_authority": ["full_ownership", "right_to_sell"],
    "agreement_no": "AGR2024001",
    "agreement_date": "2024-01-15T00:00:00.000Z",
    "payment_terms": "कुल कीमत 3 किस्तों में भुगतान की गई",
    "total_amount": 5000000,
    "total_words": "पचास लाख रुपये मात्र",
    "currency_label": "रुपये मात्र",
    "advocate_name": "अडवोकेट राजेश कुमार",
    "draft_date": "2024-01-15T00:00:00.000Z",
    "purchasers": [
      {
        "id": 1,
        "title": "श्री",
        "name": "अर्जुन सिंह",
        "rel": "पुत्र",
        "father_name": "राज सिंह",
        "addr": "321, हिल रोड, पुणे",
        "idtype": "आधार",
        "idno": "111122223333",
        "occ": "सॉफ्टवेयर इंजीनियर",
        "pan": "ABCDE1234F",
        "mobile": "9234567890",
        "email": "arjun.singh@email.com"
      }
    ],
    "witnesses": [
      {
        "id": 1,
        "title": "श्री",
        "name": "गोपाल यादव",
        "rel": "पुत्र",
        "father_name": "हरि यादव",
        "addr": "654, टेम्पल रोड, चेन्नई",
        "idtype": "आधार",
        "idno": "444455556666",
        "occ": "व्यापारी",
        "mobile": "9345678901"
      }
    ],
    "payments": [
      {
        "id": 1,
        "amount": 5000000,
        "mode": "NEFT",
        "ref": "NEFT123456789",
        "date": "2024-01-15T00:00:00.000Z",
        "bank": "SBI"
      }
    ],
    "floors": [],
    "file_uploads": {
      "bank_rep_photo": "uploads/property-sale-certificates/bank_rep_photo-1234567890.jpg",
      "prop_photo": "uploads/property-sale-certificates/prop_photo-1234567890.jpg",
      "purchaser_photos": ["uploads/property-sale-certificates/purchaser_photo_1-1234567890.jpg"],
      "witness_photos": ["uploads/property-sale-certificates/witness_photo_1-1234567890.jpg"]
    },
    "createdBy": "507f1f77bcf86cd799439012",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Property Sale Certificate
**PUT** `/api/property-sale-certificate/:id`

Updates an existing property sale certificate.

#### Request Body (FormData)
Same as create endpoint, all fields are optional for updates.

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificate updated successfully",
  "data": {
    // Updated certificate object
  }
}
```

### 5. Delete Property Sale Certificate
**DELETE** `/api/property-sale-certificate/:id`

Deletes a property sale certificate and its associated files.

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificate deleted successfully"
}
```

### 6. Download File
**GET** `/api/property-sale-certificate/:id/download?fileType={type}`

Downloads a specific file for a property sale certificate.

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fileType | string | Yes | Type of file to download (bank_rep_photo, prop_photo) |

#### Response
Returns the file as a download with appropriate headers.

### 7. Get Statistics
**GET** `/api/property-sale-certificate/stats`

Retrieves statistics for property sale certificates.

#### Response
```json
{
  "status": "success",
  "message": "Property Sale Certificate statistics retrieved successfully",
  "data": {
    "totalCertificates": 100,
    "certificatesByCategory": [
      {
        "_id": "Residential",
        "count": 60
      },
      {
        "_id": "Commercial",
        "count": 30
      },
      {
        "_id": "Industrial",
        "count": 10
      }
    ],
    "certificatesByMonth": [
      {
        "_id": "2024-01",
        "count": 15
      },
      {
        "_id": "2024-02",
        "count": 20
      }
    ],
    "totalPropertyCost": {
      "totalValue": 500000000,
      "averageValue": 5000000
    },
    "totalStampDuty": {
      "totalStampDuty": 25000000,
      "totalRegistrationFee": 5000000
    }
  }
}
```

## Error Responses

### Validation Error (400)
```json
{
  "status": "failed",
  "message": "Validation failed",
  "errors": [
    {
      "path": "bank_rep_mobile",
      "msg": "मोबाइल नंबर 10 अंकों का होना चाहिए।"
    }
  ]
}
```

### Not Found (404)
```json
{
  "status": "failed",
  "message": "Property Sale Certificate not found"
}
```

### Unauthorized (403)
```json
{
  "status": "failed",
  "message": "Unauthorized access"
}
```

### Server Error (500)
```json
{
  "status": "failed",
  "message": "Unable to save property sale certificate",
  "error": "Database connection error"
}
```

## File Upload Constraints

- **Maximum file size**: 10MB (configurable via `MAX_FILE_SIZE` environment variable)
- **Maximum files per request**: 20
- **Allowed file types**: PDF, JPG, JPEG, PNG, DOC, DOCX
- **File storage**: Files are stored in `uploads/property-sale-certificates/` directory
- **File naming**: Unique filenames are generated using timestamp and random number

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Create/Update/Delete**: 100 requests per hour per user
- **Read operations**: 1000 requests per hour per user

## CORS

The API supports CORS for the configured frontend origin:
- **Allowed Origin**: `http://localhost:3000` (configurable via `FRONTEND_HOST` environment variable)
- **Credentials**: Supported

## Database Indexes

The following indexes are created for optimal query performance:
- `bank_rep_mobile`
- `prop_address`
- `prop_category`
- `agreement_no`
- `stamp_no`
- `createdBy`
- `created_at`

## Security Features

- JWT-based authentication
- Input validation and sanitization
- File type validation
- File size limits
- User authorization checks
- CORS protection
- Rate limiting

## Dynamic Array Structures

### Purchaser Structure
```json
{
  "id": 1,
  "title": "श्री",
  "name": "अर्जुन सिंह",
  "rel": "पुत्र",
  "father_name": "राज सिंह",
  "addr": "321, हिल रोड, पुणे",
  "idtype": "आधार",
  "idno": "111122223333",
  "occ": "सॉफ्टवेयर इंजीनियर",
  "pan": "ABCDE1234F",
  "mobile": "9234567890",
  "email": "arjun.singh@email.com"
}
```

### Witness Structure
```json
{
  "id": 1,
  "title": "श्री",
  "name": "गोपाल यादव",
  "rel": "पुत्र",
  "father_name": "हरि यादव",
  "addr": "654, टेम्पल रोड, चेन्नई",
  "idtype": "आधार",
  "idno": "444455556666",
  "occ": "व्यापारी",
  "mobile": "9345678901"
}
```

### Payment Structure
```json
{
  "id": 1,
  "amount": 5000000,
  "mode": "NEFT",
  "ref": "NEFT123456789",
  "date": "2024-01-15T00:00:00.000Z",
  "bank": "SBI"
}
```