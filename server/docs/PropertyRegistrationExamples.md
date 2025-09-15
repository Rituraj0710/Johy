# Property Registration API - Example Requests

## cURL Examples

### 1. Create Property Registration

```bash
curl -X POST http://localhost:4001/api/property-registration \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 2. Get All Property Registrations

```bash
# Basic request
curl -X GET http://localhost:4001/api/property-registration

# With pagination
curl -X GET "http://localhost:4001/api/property-registration?page=1&limit=5"

# With search
curl -X GET "http://localhost:4001/api/property-registration?search=राम"

# With status filter
curl -X GET "http://localhost:4001/api/property-registration?status=pending"
```

### 3. Get Property Registration by ID

```bash
curl -X GET http://localhost:4001/api/property-registration/507f1f77bcf86cd799439011
```

### 4. Update Property Registration

```bash
curl -X PUT http://localhost:4001/api/property-registration/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "seller_name": "अपडेटेड नाम",
    "area_sqm": "1500"
  }'
```

### 5. Delete Property Registration

```bash
curl -X DELETE http://localhost:4001/api/property-registration/507f1f77bcf86cd799439011
```

### 6. Get Statistics

```bash
curl -X GET http://localhost:4001/api/property-registration/stats
```

## JavaScript/Axios Examples

### 1. Create Property Registration

```javascript
import axios from 'axios';

const createPropertyRegistration = async (formData) => {
  try {
    const response = await axios.post('/api/property-registration', {
      seller_name: formData.seller_name,
      seller_father_name: formData.seller_father_name,
      seller_address: formData.seller_address,
      seller_aadhaar: formData.seller_aadhaar,
      seller_mobile: formData.seller_mobile,
      buyer_name: formData.buyer_name,
      buyer_father_name: formData.buyer_father_name,
      buyer_address: formData.buyer_address,
      buyer_aadhaar: formData.buyer_aadhaar,
      buyer_mobile: formData.buyer_mobile,
      property_address: formData.property_address,
      property_type: formData.property_type,
      area_sqm: formData.area_sqm,
      sale_price: formData.sale_price,
      registration_date: formData.registration_date
    });

    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
const formData = {
  seller_name: "राम प्रसाद शर्मा",
  seller_father_name: "शिव प्रसाद शर्मा",
  seller_address: "गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश",
  seller_aadhaar: "123456789012",
  seller_mobile: "9876543210",
  buyer_name: "सीता देवी",
  buyer_father_name: "राम कुमार",
  buyer_address: "गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश",
  buyer_aadhaar: "123456789013",
  buyer_mobile: "9876543211",
  property_address: "प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश",
  property_type: "आवासीय",
  area_sqm: "1200",
  sale_price: "5000000",
  registration_date: "2024-01-15"
};

createPropertyRegistration(formData);
```

### 2. Get All Property Registrations

```javascript
const getAllPropertyRegistrations = async (params = {}) => {
  try {
    const response = await axios.get('/api/property-registration', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        status: params.status
      }
    });

    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage examples
getAllPropertyRegistrations(); // Get first page
getAllPropertyRegistrations({ page: 2, limit: 20 }); // Get page 2 with 20 items
getAllPropertyRegistrations({ search: 'राम' }); // Search for 'राम'
getAllPropertyRegistrations({ status: 'pending' }); // Filter by status
```

### 3. Get Property Registration by ID

```javascript
const getPropertyRegistrationById = async (id) => {
  try {
    const response = await axios.get(`/api/property-registration/${id}`);
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
getPropertyRegistrationById('507f1f77bcf86cd799439011');
```

### 4. Update Property Registration

```javascript
const updatePropertyRegistration = async (id, updateData) => {
  try {
    const response = await axios.put(`/api/property-registration/${id}`, updateData);
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
updatePropertyRegistration('507f1f77bcf86cd799439011', {
  seller_name: 'अपडेटेड नाम',
  area_sqm: '1500'
});
```

### 5. Delete Property Registration

```javascript
const deletePropertyRegistration = async (id) => {
  try {
    const response = await axios.delete(`/api/property-registration/${id}`);
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
deletePropertyRegistration('507f1f77bcf86cd799439011');
```

### 6. Get Statistics

```javascript
const getPropertyRegistrationStats = async () => {
  try {
    const response = await axios.get('/api/property-registration/stats');
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
getPropertyRegistrationStats();
```

## Fetch API Examples

### 1. Create Property Registration with Fetch

```javascript
const createPropertyRegistrationWithFetch = async (formData) => {
  try {
    const response = await fetch('/api/property-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};

// Usage
const formData = {
  seller_name: "राम प्रसाद शर्मा",
  seller_father_name: "शिव प्रसाद शर्मा",
  seller_address: "गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश",
  seller_aadhaar: "123456789012",
  seller_mobile: "9876543210",
  buyer_name: "सीता देवी",
  buyer_father_name: "राम कुमार",
  buyer_address: "गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश",
  buyer_aadhaar: "123456789013",
  buyer_mobile: "9876543211",
  property_address: "प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश",
  property_type: "आवासीय",
  area_sqm: "1200",
  sale_price: "5000000",
  registration_date: "2024-01-15"
};

createPropertyRegistrationWithFetch(formData);
```

### 2. Error Handling Example

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        console.error('Validation Error:', data.errors);
        // Handle validation errors
        data.errors.forEach(err => {
          console.error(`Field ${err.path}: ${err.msg}`);
        });
        break;
      case 404:
        console.error('Not Found:', data.message);
        break;
      case 409:
        console.error('Conflict:', data.message);
        break;
      case 500:
        console.error('Server Error:', data.message);
        break;
      default:
        console.error('Unknown Error:', data.message);
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error: No response received');
  } else {
    // Something else happened
    console.error('Error:', error.message);
  }
};

// Usage in try-catch
try {
  await createPropertyRegistration(formData);
} catch (error) {
  handleApiError(error);
}
```

## Postman Collection

You can import the following JSON into Postman:

```json
{
  "info": {
    "name": "Property Registration API",
    "description": "API endpoints for property registration management",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Property Registration",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"seller_name\": \"राम प्रसाद शर्मा\",\n  \"seller_father_name\": \"शिव प्रसाद शर्मा\",\n  \"seller_address\": \"गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश\",\n  \"seller_aadhaar\": \"123456789012\",\n  \"seller_mobile\": \"9876543210\",\n  \"buyer_name\": \"सीता देवी\",\n  \"buyer_father_name\": \"राम कुमार\",\n  \"buyer_address\": \"गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश\",\n  \"buyer_aadhaar\": \"123456789013\",\n  \"buyer_mobile\": \"9876543211\",\n  \"property_address\": \"प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश\",\n  \"property_type\": \"आवासीय\",\n  \"area_sqm\": \"1200\",\n  \"sale_price\": \"5000000\",\n  \"registration_date\": \"2024-01-15\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/property-registration",
          "host": ["{{base_url}}"],
          "path": ["api", "property-registration"]
        }
      }
    },
    {
      "name": "Get All Property Registrations",
      "request": {
        "method": "GET",
        "url": {
          "raw": "{{base_url}}/api/property-registration?page=1&limit=10",
          "host": ["{{base_url}}"],
          "path": ["api", "property-registration"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "limit",
              "value": "10"
            }
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:4001"
    }
  ]
}
```

## Testing with Different Tools

### Using HTTPie

```bash
# Install HTTPie: pip install httpie

# Create property registration
http POST localhost:4001/api/property-registration \
  seller_name="राम प्रसाद शर्मा" \
  seller_father_name="शिव प्रसाद शर्मा" \
  seller_address="गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश" \
  seller_aadhaar="123456789012" \
  seller_mobile="9876543210" \
  buyer_name="सीता देवी" \
  buyer_father_name="राम कुमार" \
  buyer_address="गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश" \
  buyer_aadhaar="123456789013" \
  buyer_mobile="9876543211" \
  property_address="प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश" \
  property_type="आवासीय" \
  area_sqm="1200" \
  sale_price="5000000" \
  registration_date="2024-01-15"

# Get all registrations
http GET localhost:4001/api/property-registration

# Get statistics
http GET localhost:4001/api/property-registration/stats
```

### Using Insomnia

1. Create a new request
2. Set method to POST
3. Set URL to `http://localhost:4001/api/property-registration`
4. Set Content-Type header to `application/json`
5. Add the JSON body in the request body section
6. Send the request

This comprehensive set of examples should help you integrate with the Property Registration API using any HTTP client or programming language.
