import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import TrustDeedModel from '../models/TrustDeed.js';

describe('Trust Deed API', () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoURI = process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/trust_deed_test';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    // Clean up and close connection
    await TrustDeedModel.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await TrustDeedModel.deleteMany({});
  });

  describe('POST /api/trust-deed', () => {
    const validTrustDeedData = {
      trustName: 'श्री राम ट्रस्ट',
      trustAddress: 'मुंबई, महाराष्ट्र, भारत',
      startingAmount_number: '1000000',
      startingAmount_words: 'दस लाख रुपये',
      trusteeSalutation_1: 'श्री',
      trusteePosition_1: 'अध्यक्ष',
      trusteeName_1: 'राम कुमार',
      trusteeRelation_1: 'राम प्रसाद',
      trusteeAddress_1: 'दिल्ली, भारत',
      trusteeMobile_1: '9876543210',
      trusteeIdType_1: 'आधार कार्ड',
      trusteeIdNumber_1: '123456789012',
      functionalDomain_1: 'शिक्षा क्षेत्र',
      purpose: ['अनाथ बच्चों को स्कूल की शिक्षा देना'],
      otherPurpose_1: 'वृक्षारोपण',
      terms: ['ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।'],
      otherTerm_1: 'विशेष नियम',
      witnessName_1: 'सुरेश कुमार',
      witnessRelation_1: 'राम प्रसाद',
      witnessAddress_1: 'गाजियाबाद, उत्तर प्रदेश',
      witnessMobile_1: '9876543211',
      witnessIdType_1: 'आधार कार्ड',
      witnessIdNumber_1: '123456789013'
    };

    it('should create a trust deed with valid data', async () => {
      const response = await request(app)
        .post('/api/trust-deed')
        .send(validTrustDeedData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Trust Deed created successfully');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.trustName).toBe('श्री राम ट्रस्ट');
    });

    it('should fail with missing required fields', async () => {
      const incompleteData = {
        trustName: 'श्री राम ट्रस्ट',
        // Missing trustAddress, startingAmount_number, startingAmount_words
        trusteePosition_1: 'अध्यक्ष',
        trusteeName_1: 'राम कुमार'
      };

      const response = await request(app)
        .post('/api/trust-deed')
        .send(incompleteData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should fail with invalid mobile number format', async () => {
      const invalidData = {
        ...validTrustDeedData,
        trusteeMobile_1: '123456789' // Invalid format
      };

      const response = await request(app)
        .post('/api/trust-deed')
        .send(invalidData)
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toContain('Missing required trustee fields');
    });

    it('should handle multiple trustees', async () => {
      const multiTrusteeData = {
        ...validTrustDeedData,
        trusteeSalutation_2: 'श्रीमती',
        trusteePosition_2: 'सचिव',
        trusteeName_2: 'सीता देवी',
        trusteeRelation_2: 'राम प्रसाद',
        trusteeAddress_2: 'दिल्ली, भारत',
        trusteeMobile_2: '9876543212',
        trusteeIdType_2: 'पैन कार्ड',
        trusteeIdNumber_2: 'ABCDE1234F'
      };

      const response = await request(app)
        .post('/api/trust-deed')
        .send(multiTrusteeData)
        .expect(201);

      expect(response.body.status).toBe('success');
      
      // Verify trustees were saved
      const trustDeed = await TrustDeedModel.findById(response.body.data.id);
      expect(trustDeed.trustees).toHaveLength(2);
      expect(trustDeed.trustees[0].name).toBe('राम कुमार');
      expect(trustDeed.trustees[1].name).toBe('सीता देवी');
    });

    it('should handle multiple functional domains', async () => {
      const multiDomainData = {
        ...validTrustDeedData,
        functionalDomain_2: 'स्वास्थ्य क्षेत्र',
        functionalDomain_3: 'पर्यावरण क्षेत्र'
      };

      const response = await request(app)
        .post('/api/trust-deed')
        .send(multiDomainData)
        .expect(201);

      expect(response.body.status).toBe('success');
      
      const trustDeed = await TrustDeedModel.findById(response.body.data.id);
      expect(trustDeed.functionalDomains).toHaveLength(3);
      expect(trustDeed.functionalDomains).toContain('शिक्षा क्षेत्र');
      expect(trustDeed.functionalDomains).toContain('स्वास्थ्य क्षेत्र');
      expect(trustDeed.functionalDomains).toContain('पर्यावरण क्षेत्र');
    });

    it('should handle multiple purposes and terms', async () => {
      const multiPurposeData = {
        ...validTrustDeedData,
        purpose: [
          'अनाथ बच्चों को स्कूल की शिक्षा देना',
          'स्वास्थ्य संबंधी लोगों की मदद करना'
        ],
        otherPurpose_2: 'वृक्षारोपण',
        terms: [
          'ट्रस्ट केवल धर्मार्थ उद्देश्यों के लिए कार्य करेगा।',
          'ट्रस्टी को कोई वेतन या मानदेय नहीं दिया जाएगा।'
        ],
        otherTerm_2: 'अतिरिक्त नियम'
      };

      const response = await request(app)
        .post('/api/trust-deed')
        .send(multiPurposeData)
        .expect(201);

      expect(response.body.status).toBe('success');
      
      const trustDeed = await TrustDeedModel.findById(response.body.data.id);
      expect(trustDeed.purposes).toHaveLength(2);
      expect(trustDeed.otherPurposes).toHaveLength(2);
      expect(trustDeed.terms).toHaveLength(2);
      expect(trustDeed.otherTerms).toHaveLength(2);
    });
  });

  describe('GET /api/trust-deed', () => {
    beforeEach(async () => {
      // Create test trust deeds
      await TrustDeedModel.create([
        {
          trustName: 'ट्रस्ट 1',
          trustAddress: 'पता 1',
          startingAmount: { number: '100000', words: 'एक लाख रुपये' },
          trustees: [{
            salutation: 'श्री',
            position: 'अध्यक्ष',
            name: 'नाम 1',
            relation: 'पिता 1',
            address: 'पता 1',
            mobile: '9876543210',
            idType: 'आधार कार्ड',
            idNumber: '123456789012'
          }],
          functionalDomains: ['क्षेत्र 1'],
          purposes: [],
          otherPurposes: [],
          terms: [],
          otherTerms: [],
          witnesses: []
        },
        {
          trustName: 'ट्रस्ट 2',
          trustAddress: 'पता 2',
          startingAmount: { number: '200000', words: 'दो लाख रुपये' },
          trustees: [{
            salutation: 'श्रीमती',
            position: 'सचिव',
            name: 'नाम 2',
            relation: 'पिता 2',
            address: 'पता 2',
            mobile: '9876543211',
            idType: 'पैन कार्ड',
            idNumber: 'ABCDE1234F'
          }],
          functionalDomains: ['क्षेत्र 2'],
          purposes: [],
          otherPurposes: [],
          terms: [],
          otherTerms: [],
          witnesses: []
        }
      ]);
    });

    it('should get all trust deeds', async () => {
      const response = await request(app)
        .get('/api/trust-deed')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.trustDeeds).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/trust-deed?page=1&limit=1')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.trustDeeds).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /api/trust-deed/:id', () => {
    let trustDeedId;

    beforeEach(async () => {
      const trustDeed = await TrustDeedModel.create({
        trustName: 'टेस्ट ट्रस्ट',
        trustAddress: 'टेस्ट पता',
        startingAmount: { number: '500000', words: 'पांच लाख रुपये' },
        trustees: [{
          salutation: 'श्री',
          position: 'अध्यक्ष',
          name: 'टेस्ट नाम',
          relation: 'टेस्ट पिता',
          address: 'टेस्ट पता',
          mobile: '9876543210',
          idType: 'आधार कार्ड',
          idNumber: '123456789012'
        }],
        functionalDomains: ['टेस्ट क्षेत्र'],
        purposes: ['टेस्ट उद्देश्य'],
        otherPurposes: [],
        terms: ['टेस्ट नियम'],
        otherTerms: [],
        witnesses: []
      });
      trustDeedId = trustDeed._id.toString();
    });

    it('should get a trust deed by ID', async () => {
      const response = await request(app)
        .get(`/api/trust-deed/${trustDeedId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.trustName).toBe('टेस्ट ट्रस्ट');
      expect(response.body.data.trustees).toHaveLength(1);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .get(`/api/trust-deed/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Trust deed not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/trust-deed/invalid-id')
        .expect(400);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Invalid trust deed ID');
    });
  });

  describe('DELETE /api/trust-deed/:id', () => {
    let trustDeedId;

    beforeEach(async () => {
      const trustDeed = await TrustDeedModel.create({
        trustName: 'डिलीट ट्रस्ट',
        trustAddress: 'डिलीट पता',
        startingAmount: { number: '100000', words: 'एक लाख रुपये' },
        trustees: [{
          salutation: 'श्री',
          position: 'अध्यक्ष',
          name: 'डिलीट नाम',
          relation: 'डिलीट पिता',
          address: 'डिलीट पता',
          mobile: '9876543210',
          idType: 'आधार कार्ड',
          idNumber: '123456789012'
        }],
        functionalDomains: ['डिलीट क्षेत्र'],
        purposes: [],
        otherPurposes: [],
        terms: [],
        otherTerms: [],
        witnesses: []
      });
      trustDeedId = trustDeed._id.toString();
    });

    it('should delete a trust deed', async () => {
      const response = await request(app)
        .delete(`/api/trust-deed/${trustDeedId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Trust deed deleted successfully');

      // Verify deletion
      const deletedTrustDeed = await TrustDeedModel.findById(trustDeedId);
      expect(deletedTrustDeed).toBeNull();
    });

    it('should return 404 when deleting non-existent trust deed', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const response = await request(app)
        .delete(`/api/trust-deed/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('failed');
      expect(response.body.message).toBe('Trust deed not found');
    });
  });

  describe('GET /api/trust-deed/stats', () => {
    beforeEach(async () => {
      await TrustDeedModel.create([
        {
          trustName: 'स्टैट्स ट्रस्ट 1',
          trustAddress: 'स्टैट्स पता 1',
          startingAmount: { number: '100000', words: 'एक लाख रुपये' },
          trustees: [
            { salutation: 'श्री', position: 'अध्यक्ष', name: 'नाम 1', relation: 'पिता 1', address: 'पता 1', mobile: '9876543210', idType: 'आधार कार्ड', idNumber: '123456789012' },
            { salutation: 'श्रीमती', position: 'सचिव', name: 'नाम 2', relation: 'पिता 2', address: 'पता 2', mobile: '9876543211', idType: 'पैन कार्ड', idNumber: 'ABCDE1234F' }
          ],
          functionalDomains: ['क्षेत्र 1'],
          purposes: [],
          otherPurposes: [],
          terms: [],
          otherTerms: [],
          witnesses: []
        },
        {
          trustName: 'स्टैट्स ट्रस्ट 2',
          trustAddress: 'स्टैट्स पता 2',
          startingAmount: { number: '200000', words: 'दो लाख रुपये' },
          trustees: [
            { salutation: 'श्री', position: 'अध्यक्ष', name: 'नाम 3', relation: 'पिता 3', address: 'पता 3', mobile: '9876543212', idType: 'आधार कार्ड', idNumber: '123456789013' }
          ],
          functionalDomains: ['क्षेत्र 2'],
          purposes: [],
          otherPurposes: [],
          terms: [],
          otherTerms: [],
          witnesses: []
        }
      ]);
    });

    it('should return statistics', async () => {
      const response = await request(app)
        .get('/api/trust-deed/stats')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.totalTrustDeeds).toBe(2);
      expect(response.body.data.totalTrustees).toBe(3); // 2 + 1
      expect(response.body.data.avgTrusteesPerDeed).toBe(1.5); // 3/2
    });
  });
});
