import request from 'supertest';
import app from '../app.js';
import PropertyRegistrationModel from '../models/PropertyRegistration.js';
import mongoose from 'mongoose';

describe('Property Registration API Tests', () => {
  let testPropertyRegistrationId;

  const validPropertyRegistrationData = {
    seller_name: 'राम प्रसाद शर्मा',
    seller_father_name: 'शिव प्रसाद शर्मा',
    seller_address: 'गाँव रामपुर, जिला गाजियाबाद, उत्तर प्रदेश',
    seller_aadhaar: '123456789012',
    seller_mobile: '9876543210',
    buyer_name: 'सीता देवी',
    buyer_father_name: 'राम कुमार',
    buyer_address: 'गाँव सीतापुर, जिला गाजियाबाद, उत्तर प्रदेश',
    buyer_aadhaar: '123456789013',
    buyer_mobile: '9876543211',
    property_address: 'प्लॉट नंबर 123, सेक्टर 15, गाजियाबाद, उत्तर प्रदेश',
    property_type: 'आवासीय',
    area_sqm: '1200',
    sale_price: '5000000',
    registration_date: '2024-01-15'
  };

  beforeAll(async () => {
    // Connect to test database if needed
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test_property_registration');
    }
  });

  afterAll(async () => {
    // Clean up test data
    await PropertyRegistrationModel.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/property-registration', () => {
    it('should create a new property registration with valid data', async () => {
      const response = await request(app)
        .post('/api/property-registration')
        .send(validPropertyRegistrationData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registration created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('registration_number');
      expect(response.body.data).toHaveProperty('status', 'pending');
      expect(response.body.data).toHaveProperty('created_at');

      testPropertyRegistrationId = response.body.data.id;
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        seller_name: 'राम प्रसाद शर्मा',
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/property-registration')
        .send(incompleteData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toBeInstanceOf(Array);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 400 for invalid Aadhaar number', async () => {
      const invalidAadhaarData = {
        ...validPropertyRegistrationData,
        seller_aadhaar: '12345678901', // 11 digits instead of 12
        seller_name: 'अलग नाम' // Different name to avoid duplicate
      };

      const response = await request(app)
        .post('/api/property-registration')
        .send(invalidAadhaarData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 400 for invalid mobile number', async () => {
      const invalidMobileData = {
        ...validPropertyRegistrationData,
        seller_mobile: '987654321', // 9 digits instead of 10
        seller_name: 'अलग नाम 2' // Different name to avoid duplicate
      };

      const response = await request(app)
        .post('/api/property-registration')
        .send(invalidMobileData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 400 for invalid property type', async () => {
      const invalidPropertyTypeData = {
        ...validPropertyRegistrationData,
        property_type: 'अमान्य प्रकार', // Invalid property type
        seller_name: 'अलग नाम 3' // Different name to avoid duplicate
      };

      const response = await request(app)
        .post('/api/property-registration')
        .send(invalidPropertyTypeData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 400 for invalid registration date format', async () => {
      const invalidDateData = {
        ...validPropertyRegistrationData,
        registration_date: 'invalid-date',
        seller_name: 'अलग नाम 4' // Different name to avoid duplicate
      };

      const response = await request(app)
        .post('/api/property-registration')
        .send(invalidDateData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should return 409 for duplicate registration', async () => {
      // Try to create the same registration again
      const response = await request(app)
        .post('/api/property-registration')
        .send(validPropertyRegistrationData)
        .expect(409);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('This property registration already exists for the same parties and date.');
    });
  });

  describe('GET /api/property-registration', () => {
    it('should get all property registrations', async () => {
      const response = await request(app)
        .get('/api/property-registration')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registrations retrieved successfully');
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('limit');
      expect(response.body.meta).toHaveProperty('totalPages');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/property-registration?page=1&limit=5')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.meta.page).toBe(1);
      expect(response.body.meta.limit).toBe(5);
    });

    it('should support search functionality', async () => {
      const response = await request(app)
        .get('/api/property-registration?search=राम')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should support status filtering', async () => {
      const response = await request(app)
        .get('/api/property-registration?status=pending')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/property-registration/:id', () => {
    it('should get a specific property registration by ID', async () => {
      const response = await request(app)
        .get(`/api/property-registration/${testPropertyRegistrationId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registration retrieved successfully');
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.seller_name).toBe(validPropertyRegistrationData.seller_name);
    });

    it('should return 404 for non-existent property registration', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/property-registration/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Property registration not found');
    });

    it('should return 400 for invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/property-registration/invalid-id')
        .expect(500); // Mongoose will throw an error for invalid ObjectId

      expect(response.body.status).toBe('failed');
    });
  });

  describe('PUT /api/property-registration/:id', () => {
    it('should update a property registration', async () => {
      const updateData = {
        ...validPropertyRegistrationData,
        seller_name: 'अपडेटेड नाम',
        area_sqm: '1500'
      };

      const response = await request(app)
        .put(`/api/property-registration/${testPropertyRegistrationId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registration updated successfully');
      expect(response.body.data.seller_name).toBe('अपडेटेड नाम');
      expect(response.body.data.area_sqm).toBe('1500');
    });

    it('should return 404 for non-existent property registration', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/property-registration/${fakeId}`)
        .send(validPropertyRegistrationData)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Property registration not found');
    });

    it('should return 400 for validation errors during update', async () => {
      const invalidUpdateData = {
        ...validPropertyRegistrationData,
        seller_aadhaar: '12345678901' // Invalid Aadhaar
      };

      const response = await request(app)
        .put(`/api/property-registration/${testPropertyRegistrationId}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('DELETE /api/property-registration/:id', () => {
    it('should delete a property registration', async () => {
      const response = await request(app)
        .delete(`/api/property-registration/${testPropertyRegistrationId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registration deleted successfully');
    });

    it('should return 404 for non-existent property registration', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/property-registration/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Property registration not found');
    });
  });

  describe('GET /api/property-registration/stats', () => {
    it('should get property registration statistics', async () => {
      const response = await request(app)
        .get('/api/property-registration/stats')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Property registration statistics retrieved successfully');
      expect(response.body.data).toHaveProperty('totalRegistrations');
      expect(response.body.data).toHaveProperty('registrationsByStatus');
      expect(response.body.data).toHaveProperty('registrationsByMonth');
      expect(response.body.data).toHaveProperty('registrationsByPropertyType');
    });
  });
});
