# Trust Deed API Examples

## cURL Examples

### 1. Create Trust Deed (Basic)
```bash
curl -X POST http://localhost:4000/api/trust-deed \
  -F "trustName=श्री राम ट्रस्ट" \
  -F "trustAddress=मुंबई, महाराष्ट्र, भारत" \
  -F "startingAmount_number=1000000" \
  -F "startingAmount_words=दस लाख रुपये" \
  -F "trusteeSalutation_1=श्री" \
  -F "trusteePosition_1=अध्यक्ष" \
  -F "trusteeName_1=राम कुमार" \
  -F "trusteeRelation_1=राम प्रसाद" \
  -F "trusteeAddress_1=दिल्ली, भारत" \
  -F "trusteeMobile_1=9876543210" \
  -F "trusteeIdType_1=आधार कार्ड" \
  -F "trusteeIdNumber_1=123456789012" \
  -F "functionalDomain_1=शिक्षा क्षेत्र" \
  -F "purpose=अनाथ बच्चों को स्कूल की शिक्षा देना" \
  -F "terms=ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।"
```

### 2. Create Trust Deed with Multiple Trustees
```bash
curl -X POST http://localhost:4000/api/trust-deed \
  -F "trustName=श्री सीता ट्रस्ट" \
  -F "trustAddress=दिल्ली, भारत" \
  -F "startingAmount_number=2000000" \
  -F "startingAmount_words=दो लाख रुपये" \
  -F "trusteeSalutation_1=श्री" \
  -F "trusteePosition_1=अध्यक्ष" \
  -F "trusteeName_1=राम कुमार" \
  -F "trusteeRelation_1=राम प्रसाद" \
  -F "trusteeAddress_1=दिल्ली, भारत" \
  -F "trusteeMobile_1=9876543210" \
  -F "trusteeIdType_1=आधार कार्ड" \
  -F "trusteeIdNumber_1=123456789012" \
  -F "trusteeSalutation_2=श्रीमती" \
  -F "trusteePosition_2=सचिव" \
  -F "trusteeName_2=सीता देवी" \
  -F "trusteeRelation_2=राम प्रसाद" \
  -F "trusteeAddress_2=दिल्ली, भारत" \
  -F "trusteeMobile_2=9876543211" \
  -F "trusteeIdType_2=पैन कार्ड" \
  -F "trusteeIdNumber_2=ABCDE1234F" \
  -F "functionalDomain_1=शिक्षा क्षेत्र" \
  -F "functionalDomain_2=स्वास्थ्य क्षेत्र" \
  -F "purpose=अनाथ बच्चों को स्कूल की शिक्षा देना" \
  -F "purpose=स्वास्थ्य संबंधी लोगों की मदद करना" \
  -F "otherPurpose_1=वृक्षारोपण" \
  -F "terms=ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।" \
  -F "terms=ट्रस्टी को कोई वेतन या मानदेय नहीं दिया जाएगा।" \
  -F "witnessName_1=सुरेश कुमार" \
  -F "witnessRelation_1=राम प्रसाद" \
  -F "witnessAddress_1=गाजियाबाद, उत्तर प्रदेश" \
  -F "witnessMobile_1=9876543212" \
  -F "witnessIdType_1=आधार कार्ड" \
  -F "witnessIdNumber_1=123456789013"
```

### 3. Create Trust Deed with File Uploads
```bash
curl -X POST http://localhost:4000/api/trust-deed \
  -F "trustName=श्री कृष्ण ट्रस्ट" \
  -F "trustAddress=मथुरा, उत्तर प्रदेश, भारत" \
  -F "startingAmount_number=5000000" \
  -F "startingAmount_words=पांच लाख रुपये" \
  -F "trusteeSalutation_1=श्री" \
  -F "trusteePosition_1=अध्यक्ष" \
  -F "trusteeName_1=कृष्ण कुमार" \
  -F "trusteeRelation_1=वासुदेव" \
  -F "trusteeAddress_1=मथुरा, उत्तर प्रदेश" \
  -F "trusteeMobile_1=9876543213" \
  -F "trusteeIdType_1=आधार कार्ड" \
  -F "trusteeIdNumber_1=123456789014" \
  -F "trusteeIdCard_1=@/path/to/aadhar_card.pdf" \
  -F "trusteePhoto_1=@/path/to/photo.jpg" \
  -F "functionalDomain_1=धर्मार्थ कार्य" \
  -F "purpose=अनाथ बच्चों को स्कूल की शिक्षा देना" \
  -F "terms=ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।" \
  -F "witnessName_1=अर्जुन कुमार" \
  -F "witnessRelation_1=पांडु" \
  -F "witnessAddress_1=हस्तिनापुर, उत्तर प्रदेश" \
  -F "witnessMobile_1=9876543214" \
  -F "witnessIdType_1=पैन कार्ड" \
  -F "witnessIdNumber_1=ABCDE1235G" \
  -F "witnessIdCard_1=@/path/to/witness_aadhar.pdf" \
  -F "witnessPhoto_1=@/path/to/witness_photo.jpg"
```

### 4. Get All Trust Deeds
```bash
curl -X GET "http://localhost:4000/api/trust-deed?page=1&limit=10"
```

### 5. Get Trust Deed by ID
```bash
curl -X GET http://localhost:4000/api/trust-deed/64f8b2c3e4a5b6c7d8e9f0a1
```

### 6. Get Statistics
```bash
curl -X GET http://localhost:4000/api/trust-deed/stats
```

### 7. Delete Trust Deed
```bash
curl -X DELETE http://localhost:4000/api/trust-deed/64f8b2c3e4a5b6c7d8e9f0a1
```

## JavaScript/Fetch Examples

### 1. Create Trust Deed with FormData
```javascript
const formData = new FormData();

// Basic trust information
formData.append('trustName', 'श्री राम ट्रस्ट');
formData.append('trustAddress', 'मुंबई, महाराष्ट्र, भारत');
formData.append('startingAmount_number', '1000000');
formData.append('startingAmount_words', 'दस लाख रुपये');

// Trustee information
formData.append('trusteeSalutation_1', 'श्री');
formData.append('trusteePosition_1', 'अध्यक्ष');
formData.append('trusteeName_1', 'राम कुमार');
formData.append('trusteeRelation_1', 'राम प्रसाद');
formData.append('trusteeAddress_1', 'दिल्ली, भारत');
formData.append('trusteeMobile_1', '9876543210');
formData.append('trusteeIdType_1', 'आधार कार्ड');
formData.append('trusteeIdNumber_1', '123456789012');

// File uploads
const idCardFile = document.getElementById('idCardFile').files[0];
const photoFile = document.getElementById('photoFile').files[0];
if (idCardFile) formData.append('trusteeIdCard_1', idCardFile);
if (photoFile) formData.append('trusteePhoto_1', photoFile);

// Functional domains
formData.append('functionalDomain_1', 'शिक्षा क्षेत्र');

// Purposes
formData.append('purpose', 'अनाथ बच्चों को स्कूल की शिक्षा देना');
formData.append('purpose', 'स्वास्थ्य संबंधी लोगों की मदद करना');

// Terms
formData.append('terms', 'ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।');

// Submit request
fetch('http://localhost:4000/api/trust-deed', {
  method: 'POST',
  body: formData,
  credentials: 'include' // For authentication cookies
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Trust deed created:', data.data);
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => {
  console.error('Network error:', error);
});
```

### 2. Get All Trust Deeds with Fetch
```javascript
fetch('http://localhost:4000/api/trust-deed?page=1&limit=10', {
  method: 'GET',
  credentials: 'include'
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Trust deeds:', data.data.trustDeeds);
    console.log('Pagination:', data.data.pagination);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

## Axios Examples

### 1. Create Trust Deed with Axios
```javascript
import axios from 'axios';

const createTrustDeed = async (trustData) => {
  try {
    const response = await axios.post(
      'http://localhost:4000/api/trust-deed',
      trustData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating trust deed:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
const trustData = new FormData();
trustData.append('trustName', 'श्री राम ट्रस्ट');
trustData.append('trustAddress', 'मुंबई, महाराष्ट्र, भारत');
trustData.append('startingAmount_number', '1000000');
trustData.append('startingAmount_words', 'दस लाख रुपये');
// ... add other fields

createTrustDeed(trustData)
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

### 2. Get Trust Deeds with Axios
```javascript
import axios from 'axios';

const getTrustDeeds = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/trust-deed?page=${page}&limit=${limit}`,
      {
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching trust deeds:', error.response?.data || error.message);
    throw error;
  }
};

// Usage
getTrustDeeds(1, 10)
  .then(data => {
    console.log('Trust deeds:', data.data.trustDeeds);
    console.log('Total:', data.data.pagination.total);
  })
  .catch(error => console.error('Error:', error));
```

## Postman Collection

### Environment Variables
```
baseUrl: http://localhost:4000
apiPath: /api/trust-deed
```

### Request Examples

#### 1. Create Trust Deed (POST)
- **URL**: `{{baseUrl}}{{apiPath}}`
- **Method**: POST
- **Body**: form-data
- **Headers**: None (multipart/form-data is set automatically)

**Form Data Fields:**
```
trustName: श्री राम ट्रस्ट
trustAddress: मुंबई, महाराष्ट्र, भारत
startingAmount_number: 1000000
startingAmount_words: दस लाख रुपये
trusteeSalutation_1: श्री
trusteePosition_1: अध्यक्ष
trusteeName_1: राम कुमार
trusteeRelation_1: राम प्रसाद
trusteeAddress_1: दिल्ली, भारत
trusteeMobile_1: 9876543210
trusteeIdType_1: आधार कार्ड
trusteeIdNumber_1: 123456789012
functionalDomain_1: शिक्षा क्षेत्र
purpose: अनाथ बच्चों को स्कूल की शिक्षा देना
terms: ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।
```

#### 2. Get All Trust Deeds (GET)
- **URL**: `{{baseUrl}}{{apiPath}}?page=1&limit=10`
- **Method**: GET
- **Headers**: None

#### 3. Get Trust Deed by ID (GET)
- **URL**: `{{baseUrl}}{{apiPath}}/64f8b2c3e4a5b6c7d8e9f0a1`
- **Method**: GET
- **Headers**: None

#### 4. Delete Trust Deed (DELETE)
- **URL**: `{{baseUrl}}{{apiPath}}/64f8b2c3e4a5b6c7d8e9f0a1`
- **Method**: DELETE
- **Headers**: None

## Error Handling Examples

### JavaScript Error Handling
```javascript
const handleTrustDeedCreation = async (formData) => {
  try {
    const response = await fetch('http://localhost:4000/api/trust-deed', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      switch (response.status) {
        case 400:
          console.error('Validation Error:', data.message);
          // Handle validation errors
          break;
        case 401:
          console.error('Authentication required');
          // Redirect to login
          break;
        case 403:
          console.error('Access denied');
          // Show access denied message
          break;
        case 500:
          console.error('Server error:', data.message);
          // Show generic error message
          break;
        default:
          console.error('Unexpected error:', data.message);
      }
      return;
    }

    // Success
    console.log('Trust deed created successfully:', data.data);
    
  } catch (error) {
    console.error('Network error:', error);
    // Handle network errors
  }
};
```

## File Upload Best Practices

### 1. Client-Side Validation
```javascript
const validateFileUpload = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif'
  ];

  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed. Only PDF and images are allowed.');
  }

  return true;
};
```

### 2. Progress Tracking
```javascript
const uploadWithProgress = (formData, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.responseText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error'));
    });

    xhr.open('POST', 'http://localhost:4000/api/trust-deed');
    xhr.withCredentials = true;
    xhr.send(formData);
  });
};
```
