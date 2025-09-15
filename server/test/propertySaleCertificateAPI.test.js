const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const PropertySaleCertificateModel = require('../models/PropertySaleCertificate');

describe('Property Sale Certificate API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test_property_sale_certificate');
  });

  afterAll(async () => {
    // Clean up and close connection
    await PropertySaleCertificateModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await PropertySaleCertificateModel.deleteMany({});
  });

  describe('POST /api/property-sale-certificate', () => {
    const validCertificateData = {
      // Bank/Secured Creditor Information
      bank_select: 'SBI',
      bank_other: '',
      bank_reg_off: '123 Main Street, Mumbai',
      bank_head_off: '456 Corporate Avenue, Mumbai',
      bank_pan: 'ABCDE1234F',
      bank_post: 'Manager',

      // Bank Representative Information
      bank_rep_title: 'श्री',
      bank_rep_name: 'राम शर्मा',
      bank_rep_rel: 'पुत्र',
      bank_rep_father_name: 'शिव शर्मा',
      bank_rep_occ: 'बैंक मैनेजर',
      bank_rep_mobile: '9876543210',
      bank_rep_email: 'ram.sharma@sbi.com',
      bank_rep_addr: '789 Bank Colony, Mumbai',

      // Acknowledgement Receipt
      ack_amount: 5000000,
      ack_amount_words: 'पचास लाख रुपये मात्र',

      // Previous Owner Information
      previous_owner: 'कृष्ण कुमार',
      acquisition_mode: 'बैंक द्वारा अधिग्रहण',
      bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',

      // Property Details
      prop_category: 'Residential',
      prop_subtype: 'Flat',
      construction_type: 'RCC',
      prop_state: 'Uttar Pradesh',
      prop_tehsil: 'Ghaziabad',
      prop_ward: 'Noida',
      prop_khasra: '123/45',
      prop_plot: '5',
      prop_flat_floor: '2nd Floor',
      covered_area: 120,
      super_area: 150,
      plot_area_val: 200,
      plot_area_unit: 'sqyd',
      plot_area_sqm: 167.23,
      road_size_val: 12,
      road_size_unit: 'sqm',
      road_size_m: 12,
      road_double: false,
      park_facing: true,
      corner_plot: false,
      prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',

      // Boundary Details
      bd_north: 'राम शर्मा का घर',
      bd_south: 'मुख्य सड़क',
      bd_east: 'पार्क',
      bd_west: 'शर्मा जी का घर',

      // Circle Rate and Stamp Duty
      circle_rate: 10000,
      circle_rate_value: 1800000,
      stamp_duty: 90000,
      registration_fee: 18000,
      total_property_cost: 1898000,
      stamp_no: 'EST123456789',
      stamp_amount_manual: 90000,
      stamp_date: '2024-01-15',

      // Legal Details
      legal_rule_select: 'SARFAESI_Act',
      legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
      power_authority: ['full_ownership', 'right_to_sell'],

      // Agreement Details
      agreement_no: 'AGR2024001',
      agreement_date: '2024-01-15',
      payment_terms: 'कुल कीमत 3 किस्तों में भुगतान की गई',

      // Payment totals
      total_amount: 5000000,
      total_words: 'पचास लाख रुपये मात्र',
      currency_label: 'रुपये मात्र',

      // Other Details
      advocate_name: 'अडवोकेट राजेश कुमार',
      draft_date: '2024-01-15',

      // Dynamic arrays
      purchasers: JSON.stringify([{
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
      }]),
      witnesses: JSON.stringify([{
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
      }]),
      payments: JSON.stringify([{
        id: 1,
        amount: 5000000,
        mode: 'NEFT',
        ref: 'NEFT123456789',
        date: '2024-01-15',
        bank: 'SBI'
      }]),
      floors: JSON.stringify([])
    };

    test('should create a new property sale certificate successfully', async () => {
      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(validCertificateData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property Sale Certificate saved successfully');
      expect(response.body.id).toBeDefined();

      // Verify the certificate was saved in the database
      const savedCertificate = await PropertySaleCertificateModel.findById(response.body.id);
      expect(savedCertificate).toBeTruthy();
      expect(savedCertificate.bank_rep_name).toBe(validCertificateData.bank_rep_name);
      expect(savedCertificate.prop_category).toBe(validCertificateData.prop_category);
      expect(savedCertificate.purchasers).toHaveLength(1);
      expect(savedCertificate.witnesses).toHaveLength(1);
      expect(savedCertificate.payments).toHaveLength(1);
    });

    test('should return validation error for missing required fields', async () => {
      const incompleteData = {
        bank_rep_name: 'राम शर्मा',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(incompleteData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test('should return validation error for invalid mobile number', async () => {
      const invalidData = {
        ...validCertificateData,
        bank_rep_mobile: '123456789' // Invalid mobile (too short)
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(error => error.path === 'bank_rep_mobile')).toBe(true);
    });

    test('should return validation error for invalid property category', async () => {
      const invalidData = {
        ...validCertificateData,
        prop_category: 'अमान्य' // Invalid property category
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(error => error.path === 'prop_category')).toBe(true);
    });

    test('should return validation error for negative circle rate', async () => {
      const invalidData = {
        ...validCertificateData,
        circle_rate: -1000 // Negative circle rate
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(error => error.path === 'circle_rate')).toBe(true);
    });

    test('should return validation error for invalid email', async () => {
      const invalidData = {
        ...validCertificateData,
        bank_rep_email: 'invalid-email' // Invalid email format
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(error => error.path === 'bank_rep_email')).toBe(true);
    });

    test('should return validation error for empty power authority array', async () => {
      const invalidData = {
        ...validCertificateData,
        power_authority: [] // Empty power authority array
      };

      const response = await request(app)
        .post('/api/property-sale-certificate')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.some(error => error.path === 'power_authority')).toBe(true);
    });
  });

  describe('GET /api/property-sale-certificate', () => {
    beforeEach(async () => {
      // Create test certificates
      const testCertificates = [
        {
          bank_select: 'SBI',
          bank_reg_off: '123 Main Street, Mumbai',
          bank_head_off: '456 Corporate Avenue, Mumbai',
          bank_rep_name: 'राम शर्मा',
          bank_rep_father_name: 'शिव शर्मा',
          bank_rep_addr: '789 Bank Colony, Mumbai',
          bank_rep_mobile: '9876543210',
          bank_rep_email: 'ram.sharma@sbi.com',
          ack_amount: 5000000,
          previous_owner: 'कृष्ण कुमार',
          acquisition_mode: 'बैंक द्वारा अधिग्रहण',
          bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
          prop_category: 'Residential',
          prop_subtype: 'Flat',
          prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',
          prop_state: 'Uttar Pradesh',
          prop_tehsil: 'Ghaziabad',
          prop_ward: 'Noida',
          bd_north: 'राम शर्मा का घर',
          bd_south: 'मुख्य सड़क',
          bd_east: 'पार्क',
          bd_west: 'शर्मा जी का घर',
          circle_rate: 10000,
          stamp_duty: 90000,
          stamp_no: 'EST123456789',
          stamp_amount_manual: 90000,
          stamp_date: new Date('2024-01-15'),
          legal_rule_select: 'SARFAESI_Act',
          legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
          power_authority: ['full_ownership', 'right_to_sell'],
          agreement_no: 'AGR2024001',
          agreement_date: new Date('2024-01-15'),
          payment_terms: 'कुल कीमत 3 किस्तों में भुगतान की गई',
          advocate_name: 'अडवोकेट राजेश कुमार',
          draft_date: new Date('2024-01-15'),
          purchasers: [],
          witnesses: [],
          payments: [],
          floors: []
        },
        {
          bank_select: 'HDFC Bank',
          bank_reg_off: '456 Business District, Delhi',
          bank_head_off: '789 Corporate Plaza, Delhi',
          bank_rep_name: 'सीता देवी',
          bank_rep_father_name: 'हरि देवी',
          bank_rep_addr: '321 Financial Hub, Delhi',
          bank_rep_mobile: '9123456789',
          bank_rep_email: 'sita.devi@hdfcbank.com',
          ack_amount: 7500000,
          previous_owner: 'विजय कुमार',
          acquisition_mode: 'बैंक द्वारा अधिग्रहण',
          bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
          prop_category: 'Commercial',
          prop_subtype: 'Office',
          prop_address: 'राजेंद्र प्लेस, कमला नगर, पुरानी दिल्ली',
          prop_state: 'Uttar Pradesh',
          prop_tehsil: 'Ghaziabad',
          prop_ward: 'Noida',
          bd_north: 'शॉप नं 12',
          bd_south: 'मुख्य सड़क',
          bd_east: 'बैंक',
          bd_west: 'शॉप नं 14',
          circle_rate: 25000,
          stamp_duty: 187500,
          stamp_no: 'EST987654321',
          stamp_amount_manual: 187500,
          stamp_date: new Date('2024-02-20'),
          legal_rule_select: 'SARFAESI_Act',
          legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
          power_authority: ['full_ownership', 'right_to_sell', 'right_to_mortgage'],
          agreement_no: 'AGR2024002',
          agreement_date: new Date('2024-02-20'),
          payment_terms: 'कुल कीमत 5 किस्तों में भुगतान की गई',
          advocate_name: 'अडवोकेट रमेश जैन',
          draft_date: new Date('2024-02-20'),
          purchasers: [],
          witnesses: [],
          payments: [],
          floors: []
        }
      ];

      await PropertySaleCertificateModel.insertMany(testCertificates);
    });

    test('should get all property sale certificates with pagination', async () => {
      const response = await request(app)
        .get('/api/property-sale-certificate')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property Sale Certificates retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.total).toBe(2);
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(10);
    });

    test('should get certificates filtered by property category', async () => {
      const response = await request(app)
        .get('/api/property-sale-certificate')
        .query({ prop_category: 'Residential' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].prop_category).toBe('Residential');
    });

    test('should get certificates with search functionality', async () => {
      const response = await request(app)
        .get('/api/property-sale-certificate')
        .query({ search: 'राम' })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].bank_rep_name).toBe('राम शर्मा');
    });

    test('should get certificates with date range filter', async () => {
      const response = await request(app)
        .get('/api/property-sale-certificate')
        .query({ 
          start_date: '2024-01-01',
          end_date: '2024-01-31'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.length).toBe(1);
    });
  });

  describe('GET /api/property-sale-certificate/stats', () => {
    beforeEach(async () => {
      // Create test certificates for stats
      const testCertificates = [
        {
          bank_select: 'SBI',
          bank_reg_off: '123 Main Street, Mumbai',
          bank_head_off: '456 Corporate Avenue, Mumbai',
          bank_rep_name: 'राम शर्मा',
          bank_rep_father_name: 'शिव शर्मा',
          bank_rep_addr: '789 Bank Colony, Mumbai',
          bank_rep_mobile: '9876543210',
          bank_rep_email: 'ram.sharma@sbi.com',
          ack_amount: 5000000,
          previous_owner: 'कृष्ण कुमार',
          acquisition_mode: 'बैंक द्वारा अधिग्रहण',
          bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
          prop_category: 'Residential',
          prop_subtype: 'Flat',
          prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',
          prop_state: 'Uttar Pradesh',
          prop_tehsil: 'Ghaziabad',
          prop_ward: 'Noida',
          bd_north: 'राम शर्मा का घर',
          bd_south: 'मुख्य सड़क',
          bd_east: 'पार्क',
          bd_west: 'शर्मा जी का घर',
          circle_rate: 10000,
          circle_rate_value: 1800000,
          stamp_duty: 90000,
          registration_fee: 18000,
          total_property_cost: 1898000,
          stamp_no: 'EST123456789',
          stamp_amount_manual: 90000,
          stamp_date: new Date('2024-01-15'),
          legal_rule_select: 'SARFAESI_Act',
          legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
          power_authority: ['full_ownership', 'right_to_sell'],
          agreement_no: 'AGR2024001',
          agreement_date: new Date('2024-01-15'),
          payment_terms: 'कुल कीमत 3 किस्तों में भुगतान की गई',
          advocate_name: 'अडवोकेट राजेश कुमार',
          draft_date: new Date('2024-01-15'),
          purchasers: [],
          witnesses: [],
          payments: [],
          floors: []
        },
        {
          bank_select: 'HDFC Bank',
          bank_reg_off: '456 Business District, Delhi',
          bank_head_off: '789 Corporate Plaza, Delhi',
          bank_rep_name: 'सीता देवी',
          bank_rep_father_name: 'हरि देवी',
          bank_rep_addr: '321 Financial Hub, Delhi',
          bank_rep_mobile: '9123456789',
          bank_rep_email: 'sita.devi@hdfcbank.com',
          ack_amount: 7500000,
          previous_owner: 'विजय कुमार',
          acquisition_mode: 'बैंक द्वारा अधिग्रहण',
          bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
          prop_category: 'Commercial',
          prop_subtype: 'Office',
          prop_address: 'राजेंद्र प्लेस, कमला नगर, पुरानी दिल्ली',
          prop_state: 'Uttar Pradesh',
          prop_tehsil: 'Ghaziabad',
          prop_ward: 'Noida',
          bd_north: 'शॉप नं 12',
          bd_south: 'मुख्य सड़क',
          bd_east: 'बैंक',
          bd_west: 'शॉप नं 14',
          circle_rate: 25000,
          circle_rate_value: 1875000,
          stamp_duty: 187500,
          registration_fee: 18750,
          total_property_cost: 2081250,
          stamp_no: 'EST987654321',
          stamp_amount_manual: 187500,
          stamp_date: new Date('2024-02-20'),
          legal_rule_select: 'SARFAESI_Act',
          legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
          power_authority: ['full_ownership', 'right_to_sell', 'right_to_mortgage'],
          agreement_no: 'AGR2024002',
          agreement_date: new Date('2024-02-20'),
          payment_terms: 'कुल कीमत 5 किस्तों में भुगतान की गई',
          advocate_name: 'अडवोकेट रमेश जैन',
          draft_date: new Date('2024-02-20'),
          purchasers: [],
          witnesses: [],
          payments: [],
          floors: []
        }
      ];

      await PropertySaleCertificateModel.insertMany(testCertificates);
    });

    test('should get property sale certificate statistics', async () => {
      const response = await request(app)
        .get('/api/property-sale-certificate/stats')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property Sale Certificate statistics retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalCertificates).toBe(2);
      expect(response.body.data.certificatesByCategory).toBeDefined();
      expect(response.body.data.certificatesByMonth).toBeDefined();
      expect(response.body.data.totalPropertyCost).toBeDefined();
      expect(response.body.data.totalStampDuty).toBeDefined();
    });
  });

  describe('GET /api/property-sale-certificate/:id', () => {
    let testCertificate;

    beforeEach(async () => {
      testCertificate = await PropertySaleCertificateModel.create({
        bank_select: 'SBI',
        bank_reg_off: '123 Main Street, Mumbai',
        bank_head_off: '456 Corporate Avenue, Mumbai',
        bank_rep_name: 'राम शर्मा',
        bank_rep_father_name: 'शिव शर्मा',
        bank_rep_addr: '789 Bank Colony, Mumbai',
        bank_rep_mobile: '9876543210',
        bank_rep_email: 'ram.sharma@sbi.com',
        ack_amount: 5000000,
        previous_owner: 'कृष्ण कुमार',
        acquisition_mode: 'बैंक द्वारा अधिग्रहण',
        bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
        prop_category: 'Residential',
        prop_subtype: 'Flat',
        prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',
        prop_state: 'Uttar Pradesh',
        prop_tehsil: 'Ghaziabad',
        prop_ward: 'Noida',
        bd_north: 'राम शर्मा का घर',
        bd_south: 'मुख्य सड़क',
        bd_east: 'पार्क',
        bd_west: 'शर्मा जी का घर',
        circle_rate: 10000,
        stamp_duty: 90000,
        stamp_no: 'EST123456789',
        stamp_amount_manual: 90000,
        stamp_date: new Date('2024-01-15'),
        legal_rule_select: 'SARFAESI_Act',
        legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
        power_authority: ['full_ownership', 'right_to_sell'],
        agreement_no: 'AGR2024001',
        agreement_date: new Date('2024-01-15'),
        payment_terms: 'कुल कीमत 3 किस्तों में भुगतान की गई',
        advocate_name: 'अडवोकेट राजेश कुमार',
        draft_date: new Date('2024-01-15'),
        purchasers: [],
        witnesses: [],
        payments: [],
        floors: []
      });
    });

    test('should get a specific property sale certificate by ID', async () => {
      const response = await request(app)
        .get(`/api/property-sale-certificate/${testCertificate._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property Sale Certificate retrieved successfully');
      expect(response.body.data).toBeDefined();
      expect(response.body.data._id).toBe(testCertificate._id.toString());
      expect(response.body.data.bank_rep_name).toBe('राम शर्मा');
    });

    test('should return 404 for non-existent certificate ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/property-sale-certificate/${nonExistentId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Property Sale Certificate not found');
    });
  });

  describe('DELETE /api/property-sale-certificate/:id', () => {
    let testCertificate;

    beforeEach(async () => {
      testCertificate = await PropertySaleCertificateModel.create({
        bank_select: 'SBI',
        bank_reg_off: '123 Main Street, Mumbai',
        bank_head_off: '456 Corporate Avenue, Mumbai',
        bank_rep_name: 'राम शर्मा',
        bank_rep_father_name: 'शिव शर्मा',
        bank_rep_addr: '789 Bank Colony, Mumbai',
        bank_rep_mobile: '9876543210',
        bank_rep_email: 'ram.sharma@sbi.com',
        ack_amount: 5000000,
        previous_owner: 'कृष्ण कुमार',
        acquisition_mode: 'बैंक द्वारा अधिग्रहण',
        bank_power: 'एसएआरएफएईएसआई अधिनियम के तहत',
        prop_category: 'Residential',
        prop_subtype: 'Flat',
        prop_address: 'प्लॉट नंबर 5, रामनगर कॉलोनी, नई दिल्ली',
        prop_state: 'Uttar Pradesh',
        prop_tehsil: 'Ghaziabad',
        prop_ward: 'Noida',
        bd_north: 'राम शर्मा का घर',
        bd_south: 'मुख्य सड़क',
        bd_east: 'पार्क',
        bd_west: 'शर्मा जी का घर',
        circle_rate: 10000,
        stamp_duty: 90000,
        stamp_no: 'EST123456789',
        stamp_amount_manual: 90000,
        stamp_date: new Date('2024-01-15'),
        legal_rule_select: 'SARFAESI_Act',
        legal_clauses: 'यह बिक्री प्रमाणपत्र सिक्योरिटाइजेशन एंड रिकंस्ट्रक्शन ऑफ फाइनेंशियल एसेट्स एंड एनफोर्समेंट ऑफ SECURITY इंटरेस्ट एक्ट, 2002 की धारा 13(4) और नियम 8(6) के तहत निष्पादित किया गया है।',
        power_authority: ['full_ownership', 'right_to_sell'],
        agreement_no: 'AGR2024001',
        agreement_date: new Date('2024-01-15'),
        payment_terms: 'कुल कीमत 3 किस्तों में भुगतान की गई',
        advocate_name: 'अडवोकेट राजेश कुमार',
        draft_date: new Date('2024-01-15'),
        purchasers: [],
        witnesses: [],
        payments: [],
        floors: []
      });
    });

    test('should delete a property sale certificate successfully', async () => {
      const response = await request(app)
        .delete(`/api/property-sale-certificate/${testCertificate._id}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property Sale Certificate deleted successfully');

      // Verify the certificate was deleted from the database
      const deletedCertificate = await PropertySaleCertificateModel.findById(testCertificate._id);
      expect(deletedCertificate).toBeNull();
    });

    test('should return 404 when trying to delete non-existent certificate', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/property-sale-certificate/${nonExistentId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Property Sale Certificate not found');
    });
  });
});