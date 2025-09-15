# Property Sale Certificate API Examples

## cURL Examples

### 1. Create Property Sale Certificate

```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "bank_select=SBI" \
  -F "bank_other=" \
  -F "bank_reg_off=123 Main Street, Mumbai" \
  -F "bank_head_off=456 Corporate Avenue, Mumbai" \
  -F "bank_pan=ABCDE1234F" \
  -F "bank_post=Manager" \
  -F "bank_rep_title=श्री" \
  -F "bank_rep_name=राम शर्मा" \
  -F "bank_rep_rel=पुत्र" \
  -F "bank_rep_father_name=शिव शर्मा" \
  -F "bank_rep_occ=बैंक मैनेजर" \
  -F "bank_rep_mobile=9876543210" \
  -F "bank_rep_email=ram.sharma@sbi.com" \
  -F "bank_rep_addr=789 Bank Colony, Mumbai" \
  -F "ack_amount=5000000" \
  -F "ack_amount_words=पचास लाख रुपये मात्र" \
  -F "previous_owner=कृष्ण कुमार" \
  -F "acquisition_mode=बैंक द्वारा अधिग्रहण" \
  -F "bank_power=एसएआरएफएईएसआई अधिनियम के तहत" \
  -F "prop_category=Residential" \
  -F "prop_subtype=Flat" \
  -F "construction_type=RCC" \
  -F "prop_state=Uttar Pradesh" \
  -F "prop_tehsil=Ghaziabad" \
  -F "prop_ward=Noida" \
  -F "prop_khasra=123/45" \
  -F "prop_plot=5" \
  -F "prop_flat_floor=2nd Floor" \
  -F "covered_area=120" \
  -F "super_area=150" \
  -F "plot_area_val=200" \
  -F "plot_area_unit=sqyd" \
  -F "plot_area_sqm=167.23" \
  -F "road_size_val=12" \
  -F "road_size_unit=sqm" \
  -F "road_size_m=12" \
  -F "road_double=false" \
  -F "park_facing=true" \
  -F "corner_plot=false" \
  -F "prop_address=प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली" \
  -F "bd_north=राम शर्मा का घर" \
  -F "bd_south=मुख्य सड़क" \
  -F "bd_east=पार्क" \
  -F "bd_west=शर्मा जी का घर" \
  -F "circle_rate=10000" \
  -F "circle_rate_value=1800000" \
  -F "stamp_duty=90000" \
  -F "registration_fee=18000" \
  -F "total_property_cost=1898000" \
  -F "stamp_no=EST123456789" \
  -F "stamp_amount_manual=90000" \
  -F "stamp_date=2024-01-15" \
  -F "legal_rule_select=SARFAESI_Act" \
  -F "legal_clauses=यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।" \
  -F "power_authority=full_ownership" \
  -F "power_authority=right_to_sell" \
  -F "agreement_no=AGR2024001" \
  -F "agreement_date=2024-01-15" \
  -F "payment_terms=कुल कीमत 3 किस्तों में भुगतान की गई" \
  -F "total_amount=5000000" \
  -F "total_words=पचास लाख रुपये मात्र" \
  -F "currency_label=रुपये मात्र" \
  -F "advocate_name=अडवोकेट राजेश कुमार" \
  -F "draft_date=2024-01-15" \
  -F 'purchasers=[{"id":1,"title":"श्री","name":"अर्जुन सिंह","rel":"पुत्र","father_name":"राज सिंह","addr":"321, हिल रोड, पुणे","idtype":"आधार","idno":"111122223333","occ":"सॉफ्टवेयर इंजीनियर","pan":"ABCDE1234F","mobile":"9234567890","email":"arjun.singh@email.com"}]' \
  -F 'witnesses=[{"id":1,"title":"श्री","name":"गोपाल यादव","rel":"पुत्र","father_name":"हरि यादव","addr":"654, टेम्पल रोड, चेन्नई","idtype":"आधार","idno":"444455556666","occ":"व्यापारी","mobile":"9345678901"}]' \
  -F 'payments=[{"id":1,"amount":5000000,"mode":"NEFT","ref":"NEFT123456789","date":"2024-01-15","bank":"SBI"}]' \
  -F 'floors=[]' \
  -F "bank_rep_photo=@/path/to/bank_rep_photo.jpg" \
  -F "prop_photo=@/path/to/prop_photo.jpg"
```

### 2. Create Property Sale Certificate with Multiple File Uploads

```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "bank_select=SBI" \
  -F "bank_reg_off=123 Main Street, Mumbai" \
  -F "bank_head_off=456 Corporate Avenue, Mumbai" \
  -F "bank_rep_name=राम शर्मा" \
  -F "bank_rep_father_name=शिव शर्मा" \
  -F "bank_rep_addr=789 Bank Colony, Mumbai" \
  -F "bank_rep_mobile=9876543210" \
  -F "ack_amount=5000000" \
  -F "previous_owner=कृष्ण कुमार" \
  -F "acquisition_mode=बैंक द्वारा अधिग्रहण" \
  -F "bank_power=एसएआरएफएईएसआई अधिनियम के तहत" \
  -F "prop_category=Residential" \
  -F "prop_subtype=Flat" \
  -F "prop_address=प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली" \
  -F "prop_state=Uttar Pradesh" \
  -F "prop_tehsil=Ghaziabad" \
  -F "prop_ward=Noida" \
  -F "bd_north=राम शर्मा का घर" \
  -F "bd_south=मुख्य सड़क" \
  -F "bd_east=पार्क" \
  -F "bd_west=शर्मा जी का घर" \
  -F "circle_rate=10000" \
  -F "stamp_duty=90000" \
  -F "stamp_no=EST123456789" \
  -F "stamp_amount_manual=90000" \
  -F "stamp_date=2024-01-15" \
  -F "legal_rule_select=SARFAESI_Act" \
  -F "legal_clauses=यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।" \
  -F "power_authority=full_ownership" \
  -F "power_authority=right_to_sell" \
  -F "agreement_no=AGR2024001" \
  -F "agreement_date=2024-01-15" \
  -F "payment_terms=कुल कीमत 3 किस्तों में भुगतान की गई" \
  -F "advocate_name=अडवोकेट राजेश कुमार" \
  -F "draft_date=2024-01-15" \
  -F 'purchasers=[{"id":1,"title":"श्री","name":"अर्जुन सिंह","rel":"पुत्र","father_name":"राज सिंह","addr":"321, हिल रोड, पुणे","idtype":"आधार","idno":"111122223333","occ":"सॉफ्टवेयर इंजीनियर","pan":"ABCDE1234F","mobile":"9234567890","email":"arjun.singh@email.com"}]' \
  -F 'witnesses=[{"id":1,"title":"श्री","name":"गोपाल यादव","rel":"पुत्र","father_name":"हरि यादव","addr":"654, टेम्पल रोड, चेन्नई","idtype":"आधार","idno":"444455556666","occ":"व्यापारी","mobile":"9345678901"}]' \
  -F 'payments=[{"id":1,"amount":5000000,"mode":"NEFT","ref":"NEFT123456789","date":"2024-01-15","bank":"SBI"}]' \
  -F 'floors=[]' \
  -F "bank_rep_photo=@/path/to/bank_rep_photo.jpg" \
  -F "prop_photo=@/path/to/prop_photo.jpg" \
  -F "purchaser_photo_1=@/path/to/purchaser_photo.jpg" \
  -F "witness_photo_1=@/path/to/witness_photo.jpg"
```

### 3. Get All Property Sale Certificates

```bash
curl -X GET "http://localhost:4001/api/property-sale-certificate?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Property Sale Certificates with Filters

```bash
curl -X GET "http://localhost:4001/api/property-sale-certificate?prop_category=Residential&search=राम&start_date=2024-01-01&end_date=2024-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Property Sale Certificate by ID

```bash
curl -X GET http://localhost:4001/api/property-sale-certificate/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Update Property Sale Certificate

```bash
curl -X PUT http://localhost:4001/api/property-sale-certificate/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "bank_rep_name=राम शर्मा (Updated)" \
  -F "ack_amount=5500000" \
  -F "bank_rep_photo=@/path/to/new-bank_rep_photo.jpg"
```

### 7. Delete Property Sale Certificate

```bash
curl -X DELETE http://localhost:4001/api/property-sale-certificate/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Download File

```bash
curl -X GET "http://localhost:4001/api/property-sale-certificate/507f1f77bcf86cd799439011/download?fileType=bank_rep_photo" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o bank_rep_photo.jpg
```

### 9. Get Statistics

```bash
curl -X GET http://localhost:4001/api/property-sale-certificate/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## JavaScript/Fetch Examples

### 1. Create Property Sale Certificate

```javascript
const formData = new FormData();
formData.append('bank_select', 'SBI');
formData.append('bank_other', '');
formData.append('bank_reg_off', '123 Main Street, Mumbai');
formData.append('bank_head_off', '456 Corporate Avenue, Mumbai');
formData.append('bank_pan', 'ABCDE1234F');
formData.append('bank_post', 'Manager');
formData.append('bank_rep_title', 'श्री');
formData.append('bank_rep_name', 'राम शर्मा');
formData.append('bank_rep_rel', 'पुत्र');
formData.append('bank_rep_father_name', 'शिव शर्मा');
formData.append('bank_rep_occ', 'बैंक मैनेजर');
formData.append('bank_rep_mobile', '9876543210');
formData.append('bank_rep_email', 'ram.sharma@sbi.com');
formData.append('bank_rep_addr', '789 Bank Colony, Mumbai');
formData.append('ack_amount', '5000000');
formData.append('ack_amount_words', 'पचास लाख रुपये मात्र');
formData.append('previous_owner', 'कृष्ण कुमार');
formData.append('acquisition_mode', 'बैंक द्वारा अधिग्रहण');
formData.append('bank_power', 'एसएआरएफएईएसआई अधिनियम के तहत');
formData.append('prop_category', 'Residential');
formData.append('prop_subtype', 'Flat');
formData.append('construction_type', 'RCC');
formData.append('prop_state', 'Uttar Pradesh');
formData.append('prop_tehsil', 'Ghaziabad');
formData.append('prop_ward', 'Noida');
formData.append('prop_khasra', '123/45');
formData.append('prop_plot', '5');
formData.append('prop_flat_floor', '2nd Floor');
formData.append('covered_area', '120');
formData.append('super_area', '150');
formData.append('plot_area_val', '200');
formData.append('plot_area_unit', 'sqyd');
formData.append('plot_area_sqm', '167.23');
formData.append('road_size_val', '12');
formData.append('road_size_unit', 'sqm');
formData.append('road_size_m', '12');
formData.append('road_double', 'false');
formData.append('park_facing', 'true');
formData.append('corner_plot', 'false');
formData.append('prop_address', 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली');
formData.append('bd_north', 'राम शर्मा का घर');
formData.append('bd_south', 'मुख्य सड़क');
formData.append('bd_east', 'पार्क');
formData.append('bd_west', 'शर्मा जी का घर');
formData.append('circle_rate', '10000');
formData.append('circle_rate_value', '1800000');
formData.append('stamp_duty', '90000');
formData.append('registration_fee', '18000');
formData.append('total_property_cost', '1898000');
formData.append('stamp_no', 'EST123456789');
formData.append('stamp_amount_manual', '90000');
formData.append('stamp_date', '2024-01-15');
formData.append('legal_rule_select', 'SARFAESI_Act');
formData.append('legal_clauses', 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।');
formData.append('power_authority', 'full_ownership');
formData.append('power_authority', 'right_to_sell');
formData.append('agreement_no', 'AGR2024001');
formData.append('agreement_date', '2024-01-15');
formData.append('payment_terms', 'कुल कीमत 3 किस्तों में भुगतान की गई');
formData.append('total_amount', '5000000');
formData.append('total_words', 'पचास लाख रुपये मात्र');
formData.append('currency_label', 'रुपये मात्र');
formData.append('advocate_name', 'अडवोकेट राजेश कुमार');
formData.append('draft_date', '2024-01-15');

// Add dynamic arrays
const purchasers = [{
  id: 1,
  title: 'श्री',
  name: 'अर्जुन सिंह',
  rel: 'पुत्र',
  father_name: 'राज सिंह',
  addr: '321, हिल रोड, पुणे',
  idtype: 'आधार',
  idno: '111122223333',
  occ: 'सॉफ्टवेयर इंजीनियर',
  pan: 'ABCDE1234F',
  mobile: '9234567890',
  email: 'arjun.singh@email.com'
}];
formData.append('purchasers', JSON.stringify(purchasers));

const witnesses = [{
  id: 1,
  title: 'श्री',
  name: 'गोपाल यादव',
  rel: 'पुत्र',
  father_name: 'हरि यादव',
  addr: '654, टेम्पल रोड, चेन्नई',
  idtype: 'आधार',
  idno: '444455556666',
  occ: 'व्यापारी',
  mobile: '9345678901'
}];
formData.append('witnesses', JSON.stringify(witnesses));

const payments = [{
  id: 1,
  amount: 5000000,
  mode: 'NEFT',
  ref: 'NEFT123456789',
  date: '2024-01-15',
  bank: 'SBI'
}];
formData.append('payments', JSON.stringify(payments));

formData.append('floors', JSON.stringify([]));

// Add files if selected
const bankRepPhotoInput = document.getElementById('bank_rep_photo');
if (bankRepPhotoInput.files[0]) {
  formData.append('bank_rep_photo', bankRepPhotoInput.files[0]);
}

const propPhotoInput = document.getElementById('prop_photo');
if (propPhotoInput.files[0]) {
  formData.append('prop_photo', propPhotoInput.files[0]);
}

fetch('/api/property-sale-certificate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Certificate created:', data.id);
    alert('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक जमा हो गया!');
  } else {
    console.error('Error:', data.message);
    alert('त्रुटि: ' + data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
  alert('त्रुटि: ' + error.message);
});
```

### 2. Get All Property Sale Certificates

```javascript
fetch('/api/property-sale-certificate?page=1&limit=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Certificates:', data.data);
    console.log('Total:', data.meta.total);
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

### 3. Get Property Sale Certificate by ID

```javascript
const certificateId = '507f1f77bcf86cd799439011';

fetch(`/api/property-sale-certificate/${certificateId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Certificate:', data.data);
  } else {
    console.error('Error:', data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
});
```

### 4. Update Property Sale Certificate

```javascript
const certificateId = '507f1f77bcf86cd799439011';
const formData = new FormData();
formData.append('bank_rep_name', 'राम शर्मा (Updated)');
formData.append('ack_amount', '5500000');

// Add new file if selected
const bankRepPhotoInput = document.getElementById('bank_rep_photo');
if (bankRepPhotoInput.files[0]) {
  formData.append('bank_rep_photo', bankRepPhotoInput.files[0]);
}

fetch(`/api/property-sale-certificate/${certificateId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Certificate updated:', data.data);
    alert('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक अपडेट हो गया!');
  } else {
    console.error('Error:', data.message);
    alert('त्रुटि: ' + data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
  alert('त्रुटि: ' + error.message);
});
```

### 5. Delete Property Sale Certificate

```javascript
const certificateId = '507f1f77bcf86cd799439011';

fetch(`/api/property-sale-certificate/${certificateId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.status === 'success') {
    console.log('Certificate deleted successfully');
    alert('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक डिलीट हो गया!');
  } else {
    console.error('Error:', data.message);
    alert('त्रुटि: ' + data.message);
  }
})
.catch(error => {
  console.error('Error:', error);
  alert('त्रुटि: ' + error.message);
});
```

### 6. Download File

```javascript
const certificateId = '507f1f77bcf86cd799439011';
const fileType = 'bank_rep_photo';

fetch(`/api/property-sale-certificate/${certificateId}/download?fileType=${fileType}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(response => {
  if (response.ok) {
    return response.blob();
  } else {
    throw new Error('File download failed');
  }
})
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bank_rep_photo.jpg';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
})
.catch(error => {
  console.error('Error:', error);
  alert('त्रुटि: ' + error.message);
});
```

## Axios Examples

### 1. Create Property Sale Certificate

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('bank_select', 'SBI');
formData.append('bank_reg_off', '123 Main Street, Mumbai');
formData.append('bank_head_off', '456 Corporate Avenue, Mumbai');
formData.append('bank_rep_name', 'राम शर्मा');
formData.append('bank_rep_father_name', 'शिव शर्मा');
formData.append('bank_rep_addr', '789 Bank Colony, Mumbai');
formData.append('bank_rep_mobile', '9876543210');
formData.append('ack_amount', '5000000');
formData.append('previous_owner', 'कृष्ण कुमार');
formData.append('acquisition_mode', 'बैंक द्वारा अधिग्रहण');
formData.append('bank_power', 'एसएआरएफएईएसआई अधिनियम के तहत');
formData.append('prop_category', 'Residential');
formData.append('prop_subtype', 'Flat');
formData.append('prop_address', 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली');
formData.append('prop_state', 'Uttar Pradesh');
formData.append('prop_tehsil', 'Ghaziabad');
formData.append('prop_ward', 'Noida');
formData.append('bd_north', 'राम शर्मा का घर');
formData.append('bd_south', 'मुख्य सड़क');
formData.append('bd_east', 'पार्क');
formData.append('bd_west', 'शर्मा जी का घर');
formData.append('circle_rate', '10000');
formData.append('stamp_duty', '90000');
formData.append('stamp_no', 'EST123456789');
formData.append('stamp_amount_manual', '90000');
formData.append('stamp_date', '2024-01-15');
formData.append('legal_rule_select', 'SARFAESI_Act');
formData.append('legal_clauses', 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।');
formData.append('power_authority', 'full_ownership');
formData.append('power_authority', 'right_to_sell');
formData.append('agreement_no', 'AGR2024001');
formData.append('agreement_date', '2024-01-15');
formData.append('payment_terms', 'कुल कीमत 3 किस्तों में भुगतान की गई');
formData.append('advocate_name', 'अडवोकेट राजेश कुमार');
formData.append('draft_date', '2024-01-15');

// Add dynamic arrays
const purchasers = [{
  id: 1,
  title: 'श्री',
  name: 'अर्जुन सिंह',
  rel: 'पुत्र',
  father_name: 'राज सिंह',
  addr: '321, हिल रोड, पुणे',
  idtype: 'आधार',
  idno: '111122223333',
  occ: 'सॉफ्टवेयर इंजीनियर',
  pan: 'ABCDE1234F',
  mobile: '9234567890',
  email: 'arjun.singh@email.com'
}];
formData.append('purchasers', JSON.stringify(purchasers));

const witnesses = [{
  id: 1,
  title: 'श्री',
  name: 'गोपाल यादव',
  rel: 'पुत्र',
  father_name: 'हरि यादव',
  addr: '654, टेम्पल रोड, चेन्नई',
  idtype: 'आधार',
  idno: '444455556666',
  occ: 'व्यापारी',
  mobile: '9345678901'
}];
formData.append('witnesses', JSON.stringify(witnesses));

const payments = [{
  id: 1,
  amount: 5000000,
  mode: 'NEFT',
  ref: 'NEFT123456789',
  date: '2024-01-15',
  bank: 'SBI'
}];
formData.append('payments', JSON.stringify(payments));

formData.append('floors', JSON.stringify([]));

// Add files if selected
const bankRepPhotoInput = document.getElementById('bank_rep_photo');
if (bankRepPhotoInput.files[0]) {
  formData.append('bank_rep_photo', bankRepPhotoInput.files[0]);
}

const propPhotoInput = document.getElementById('prop_photo');
if (propPhotoInput.files[0]) {
  formData.append('prop_photo', propPhotoInput.files[0]);
}

axios.post('/api/property-sale-certificate', formData, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  if (response.data.status === 'success') {
    console.log('Certificate created:', response.data.id);
    alert('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक जमा हो गया!');
  } else {
    console.error('Error:', response.data.message);
    alert('त्रुटि: ' + response.data.message);
  }
})
.catch(error => {
  console.error('Error:', error.response?.data?.message || error.message);
  alert('त्रुटि: ' + (error.response?.data?.message || error.message));
});
```

### 2. Get All Property Sale Certificates

```javascript
import axios from 'axios';

axios.get('/api/property-sale-certificate', {
  params: {
    page: 1,
    limit: 10,
    prop_category: 'Residential',
    search: 'राम'
  },
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  if (response.data.status === 'success') {
    console.log('Certificates:', response.data.data);
    console.log('Total:', response.data.meta.total);
  } else {
    console.error('Error:', response.data.message);
  }
})
.catch(error => {
  console.error('Error:', error.response?.data?.message || error.message);
});
```

### 3. Update Property Sale Certificate

```javascript
import axios from 'axios';

const certificateId = '507f1f77bcf86cd799439011';
const formData = new FormData();
formData.append('bank_rep_name', 'राम शर्मा (Updated)');
formData.append('ack_amount', '5500000');

// Add new file if selected
const bankRepPhotoInput = document.getElementById('bank_rep_photo');
if (bankRepPhotoInput.files[0]) {
  formData.append('bank_rep_photo', bankRepPhotoInput.files[0]);
}

axios.put(`/api/property-sale-certificate/${certificateId}`, formData, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => {
  if (response.data.status === 'success') {
    console.log('Certificate updated:', response.data.data);
    alert('संपत्ति बिक्री प्रमाण पत्र सफलतापूर्वक अपडेट हो गया!');
  } else {
    console.error('Error:', response.data.message);
    alert('त्रुटि: ' + response.data.message);
  }
})
.catch(error => {
  console.error('Error:', error.response?.data?.message || error.message);
  alert('त्रुटि: ' + (error.response?.data?.message || error.message));
});
```

## Postman Collection

### Environment Variables
Create a Postman environment with the following variables:
- `base_url`: `http://localhost:4001`
- `token`: Your JWT token

### Collection Structure

1. **Create Property Sale Certificate**
   - Method: POST
   - URL: `{{base_url}}/api/property-sale-certificate`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data with all required fields

2. **Get All Property Sale Certificates**
   - Method: GET
   - URL: `{{base_url}}/api/property-sale-certificate`
   - Headers: `Authorization: Bearer {{token}}`

3. **Get Property Sale Certificate by ID**
   - Method: GET
   - URL: `{{base_url}}/api/property-sale-certificate/:id`
   - Headers: `Authorization: Bearer {{token}}`

4. **Update Property Sale Certificate**
   - Method: PUT
   - URL: `{{base_url}}/api/property-sale-certificate/:id`
   - Headers: `Authorization: Bearer {{token}}`
   - Body: form-data with fields to update

5. **Delete Property Sale Certificate**
   - Method: DELETE
   - URL: `{{base_url}}/api/property-sale-certificate/:id`
   - Headers: `Authorization: Bearer {{token}}`

6. **Download File**
   - Method: GET
   - URL: `{{base_url}}/api/property-sale-certificate/:id/download?fileType={type}`
   - Headers: `Authorization: Bearer {{token}}`

7. **Get Statistics**
   - Method: GET
   - URL: `{{base_url}}/api/property-sale-certificate/stats`
   - Headers: `Authorization: Bearer {{token}}`

## Error Handling Examples

### Validation Error Response
```json
{
  "status": "failed",
  "message": "Validation failed",
  "errors": [
    {
      "path": "bank_rep_mobile",
      "msg": "मोबाइल नंबर 10 अंकों का होना चाहिए।"
    },
    {
      "path": "prop_category",
      "msg": "अमान्य संपत्ति श्रेणी।"
    }
  ]
}
```

### Error Handling in JavaScript
```javascript
fetch('/api/property-sale-certificate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  body: formData
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  if (data.status === 'success') {
    console.log('Success:', data.message);
  } else {
    console.error('Validation errors:', data.errors);
    // Display validation errors to user
    data.errors.forEach(error => {
      console.error(`${error.path}: ${error.msg}`);
    });
  }
})
.catch(error => {
  console.error('Network error:', error);
  alert('नेटवर्क त्रुटि: ' + error.message);
});
```

## Testing with Different Property Categories

### Residential Property
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "prop_category=Residential" \
  -F "prop_subtype=Flat" \
  # ... other fields
```

### Commercial Property
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "prop_category=Commercial" \
  -F "prop_subtype=Office" \
  # ... other fields
```

### Industrial Property
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "prop_category=Industrial" \
  -F "prop_subtype=Factory" \
  # ... other fields
```

### Agricultural Property
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "prop_category=Agriculture" \
  -F "prop_subtype=Open Plot" \
  # ... other fields
```

## Testing with Different Legal Rules

### SARFAESI Act
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "legal_rule_select=SARFAESI_Act" \
  # ... other fields
```

### UP Land Revenue Code
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "legal_rule_select=UP_Land_Revenue" \
  # ... other fields
```

### Indian Stamp Act
```bash
curl -X POST http://localhost:4001/api/property-sale-certificate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "legal_rule_select=Indian_Stamp_Act" \
  # ... other fields
```

## Testing with Multiple Purchasers

```javascript
const purchasers = [
  {
    id: 1,
    title: 'श्री',
    name: 'अर्जुन सिंह',
    rel: 'पुत्र',
    father_name: 'राज सिंह',
    addr: '321, हिल रोड, पुणे',
    idtype: 'आधार',
    idno: '111122223333',
    occ: 'सॉफ्टवेयर इंजीनियर',
    pan: 'ABCDE1234F',
    mobile: '9234567890',
    email: 'arjun.singh@email.com'
  },
  {
    id: 2,
    title: 'श्रीमती',
    name: 'सीता देवी',
    rel: 'पत्नी',
    father_name: 'हरि देवी',
    addr: '456, पार्क स्ट्रीट, मुंबई',
    idtype: 'आधार',
    idno: '987654321098',
    occ: 'शिक्षिका',
    pan: 'FGHIJ5678K',
    mobile: '9123456789',
    email: 'sita.devi@email.com'
  }
];

formData.append('purchasers', JSON.stringify(purchasers));
```

## Testing with Multiple Witnesses

```javascript
const witnesses = [
  {
    id: 1,
    title: 'श्री',
    name: 'गोपाल यादव',
    rel: 'पुत्र',
    father_name: 'हरि यादव',
    addr: '654, टेम्पल रोड, चेन्नई',
    idtype: 'आधार',
    idno: '444455556666',
    occ: 'व्यापारी',
    mobile: '9345678901'
  },
  {
    id: 2,
    title: 'श्री',
    name: 'राम प्रसाद',
    rel: 'पुत्र',
    father_name: 'श्याम प्रसाद',
    addr: '789, गांधी मार्ग, जयपुर',
    idtype: 'आधार',
    idno: '777788889999',
    occ: 'अधिवक्ता',
    mobile: '9456789012'
  }
];

formData.append('witnesses', JSON.stringify(witnesses));
```

## Testing with Multiple Payments

```javascript
const payments = [
  {
    id: 1,
    amount: 2000000,
    mode: 'NEFT',
    ref: 'NEFT123456789',
    date: '2024-01-15',
    bank: 'SBI'
  },
  {
    id: 2,
    amount: 1500000,
    mode: 'RTGS',
    ref: 'RTGS987654321',
    date: '2024-01-20',
    bank: 'HDFC Bank'
  },
  {
    id: 3,
    amount: 1500000,
    mode: 'चेक',
    ref: 'CHK456789123',
    date: '2024-01-25',
    bank: 'ICICI Bank'
  }
];

formData.append('payments', JSON.stringify(payments));
```