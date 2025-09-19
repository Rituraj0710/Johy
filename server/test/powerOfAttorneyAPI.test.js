import request from 'supertest';
import app from '../app.js';
import PowerOfAttorney from '../models/PowerOfAttorney.js';
import connectDB from '../config/connectdb.js';
import mongoose from 'mongoose';

// Mock authentication middleware
jest.mock('../middlewares/accessTokenAutoRefresh.js', () => (req, res, next) => next());
jest.mock('../middlewares/setAuthHeader.js', () => (req, res, next) => next());

describe('Power of Attorney API', () => {
  beforeAll(async () => {
    // Connect to test database
    await connectDB(process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/test_power_of_attorney');
  });

  afterAll(async () => {
    // Clean up test database
    await PowerOfAttorney.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear database before each test
    await PowerOfAttorney.deleteMany({});
  });

  describe('POST /api/power-of-attorney', () => {
    it('should create a new power of attorney', async () => {
      const mockUser = { id: '507f1f77bcf86cd799439011', role: 'user' };
      
      const powerOfAttorneyData = {
        executionDate: '2024-01-15',
        state: 'Uttar Pradesh',
        district: 'Ghaziabad',
        tehsil: 'Loni',
        subRegistrarOffice: 'Office of Sub-Registrar, Loni',
        kartaParties: JSON.stringify([{
          prefix: 'Shri',
          name: 'John Doe',
          fatherName: 'Robert Doe',
          age: 35,
          occupation: 'Service',
          idType: 'Aadhaar',
          idNo: '123456789012',
          address: '123 Main Street, City'
        }]),
        agentParties: JSON.stringify([{
          prefix: 'Shri',
          name: 'Jane Smith',
          fatherName: 'Michael Smith',
          occupation: 'Business',
          idType: 'Aadhaar',
          idNo: '987654321098',
          address: '456 Oak Avenue, Town'
        }]),
        witnessParties: JSON.stringify([{
          prefix: 'Shri',
          name: 'Bob Johnson',
          fatherName: 'David Johnson',
          occupation: 'Farmer',
          idType: 'Voter ID',
          idNo: 'VOTER123456',
          address: '789 Pine Road, Village'
        }]),
        powers: JSON.stringify(['संपत्ति बेचना', 'बैंक खाते का संचालन']),
        otherPowersText: '',
        generalPowerCheckbox: 'true',
        properties: JSON.stringify([{
          mainPropertyType: 'Immovable',
          propertyAddress: 'Property Address Here',
          propertyType: 'Residential',
          totalPlotArea: '1000',
          totalPlotUnit: 'sqft'
        }])
      };

      const response = await request(app)
        .post('/api/power-of-attorney')
        .send(powerOfAttorneyData)
        .set('Authorization', 'Bearer mock-token')
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Power of Attorney created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe('draft');
      expect(response.body.data.amount).toBe(1200);
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        executionDate: '2024-01-15',
        state: 'Uttar Pradesh'
        // Missing district, tehsil, subRegistrarOffice, parties, etc.
      };

      const response = await request(app)
        .post('/api/power-of-attorney')
        .send(incompleteData)
        .set('Authorization', 'Bearer mock-token')
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should return 400 for no principals provided', async () => {
      const dataWithoutPrincipals = {
        executionDate: '2024-01-15',
        state: 'Uttar Pradesh',
        district: 'Ghaziabad',
        tehsil: 'Loni',
        subRegistrarOffice: 'Office of Sub-Registrar, Loni',
        kartaParties: JSON.stringify([]), // Empty principals
        agentParties: JSON.stringify([{
          prefix: 'Shri',
          name: 'Jane Smith',
          fatherName: 'Michael Smith',
          occupation: 'Business',
          idType: 'Aadhaar',
          idNo: '987654321098',
          address: '456 Oak Avenue, Town'
        }]),
        witnessParties: JSON.stringify([{
          prefix: 'Shri',
          name: 'Bob Johnson',
          fatherName: 'David Johnson',
          occupation: 'Farmer',
          idType: 'Voter ID',
          idNo: 'VOTER123456',
          address: '789 Pine Road, Village'
        }]),
        powers: JSON.stringify(['संपत्ति बेचना']),
        properties: JSON.stringify([])
      };

      const response = await request(app)
        .post('/api/power-of-attorney')
        .send(dataWithoutPrincipals)
        .set('Authorization', 'Bearer mock-token')
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toContain('At least one principal (karta) is required');
    });
  });

  describe('GET /api/power-of-attorney', () => {
    it('should get all power of attorneys', async () => {
      // Create a test power of attorney first
      const testPOA = new PowerOfAttorney({
        executionDate: new Date('2024-01-15'),
        state: 'Uttar Pradesh',
        district: 'Ghaziabad',
        tehsil: 'Loni',
        subRegistrarOffice: 'Office of Sub-Registrar, Loni',
        kartaParties: [{
          prefix: 'Shri',
          name: 'John Doe',
          fatherName: 'Robert Doe',
          age: 35,
          occupation: 'Service',
          idType: 'Aadhaar',
          idNo: '123456789012',
          address: '123 Main Street, City'
        }],
        agentParties: [{
          prefix: 'Shri',
          name: 'Jane Smith',
          fatherName: 'Michael Smith',
          occupation: 'Business',
          idType: 'Aadhaar',
          idNo: '987654321098',
          address: '456 Oak Avenue, Town'
        }],
        witnessParties: [{
          prefix: 'Shri',
          name: 'Bob Johnson',
          fatherName: 'David Johnson',
          occupation: 'Farmer',
          idType: 'Voter ID',
          idNo: 'VOTER123456',
          address: '789 Pine Road, Village'
        }],
        powers: ['संपत्ति बेचना', 'बैंक खाते का संचालन'],
        properties: [{
          mainPropertyType: 'Immovable',
          propertyAddress: 'Property Address Here',
          propertyType: 'Residential',
          totalPlotArea: 1000,
          totalPlotUnit: 'sqft'
        }],
        createdBy: '507f1f77bcf86cd799439011'
      });

      await testPOA.save();

      const response = await request(app)
        .get('/api/power-of-attorney')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.powerOfAttorneys).toHaveLength(1);
      expect(response.body.data.powerOfAttorneys[0].state).toBe('Uttar Pradesh');
    });
  });

  describe('GET /api/power-of-attorney/stats', () => {
    it('should get power of attorney statistics', async () => {
      const response = await request(app)
        .get('/api/power-of-attorney/stats')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.stats).toHaveProperty('total');
      expect(response.body.data.stats).toHaveProperty('draft');
      expect(response.body.data.stats).toHaveProperty('submitted');
      expect(response.body.data.stats).toHaveProperty('approved');
      expect(response.body.data.stats).toHaveProperty('rejected');
    });
  });
});
