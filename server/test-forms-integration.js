import mongoose from 'mongoose';
import FormsData from './models/FormsData.js';
import User from './models/User.js';
import AuditLog from './models/AuditLog.js';
import AuditService from './services/auditService.js';
import logger from './config/logger.js';

// Test data
const testData = {
  admin: {
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'Test123!@#',
    role: 'admin',
    isActive: true,
    is_verified: true
  },
  staff1: {
    name: 'Test Staff 1',
    email: 'staff1@test.com',
    password: 'Test123!@#',
    role: 'staff1',
    isActive: true,
    is_verified: true
  },
  staff2: {
    name: 'Test Staff 2',
    email: 'staff2@test.com',
    password: 'Test123!@#',
    role: 'staff2',
    isActive: true,
    is_verified: true
  },
  user: {
    name: 'Test User',
    email: 'user@test.com',
    password: 'Test123!@#',
    role: 'user1',
    isActive: true,
    is_verified: true
  }
};

const testForm = {
  serviceType: 'property_registration',
  formTitle: 'Test Property Registration Form',
  formDescription: 'Test form for property registration',
  formData: {
    propertyAddress: '123 Test Street, Test City',
    ownerName: 'Test Owner',
    propertyType: 'Residential',
    area: '1000 sq ft'
  }
};

class FormsIntegrationTest {
  constructor() {
    this.testResults = [];
    this.testUsers = {};
  }

  async runTests() {
    try {
      console.log('🚀 Starting Forms Integration Tests...\n');

      // Connect to database
      await this.connectToDatabase();

      // Clean up existing test data
      await this.cleanupTestData();

      // Create test users
      await this.createTestUsers();

      // Test 1: Form Creation
      await this.testFormCreation();

      // Test 2: Form Assignment
      await this.testFormAssignment();

      // Test 3: Form Verification
      await this.testFormVerification();

      // Test 4: Form Approval
      await this.testFormApproval();

      // Test 5: Role-Based Access Control
      await this.testRoleBasedAccess();

      // Test 6: Audit Trail
      await this.testAuditTrail();

      // Test 7: Staff Forms Management
      await this.testStaffFormsManagement();

      // Test 8: Admin Forms Management
      await this.testAdminFormsManagement();

      // Print test results
      this.printTestResults();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      // Cleanup
      await this.cleanupTestData();
      await mongoose.disconnect();
      console.log('\n✅ Tests completed and database disconnected');
    }
  }

  async connectToDatabase() {
    try {
      const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/document_management';
      await mongoose.connect(DATABASE_URL);
      console.log('✅ Connected to database');
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async cleanupTestData() {
    try {
      await FormsData.deleteMany({ formTitle: { $regex: /Test/ } });
      await User.deleteMany({ email: { $regex: /@test\.com/ } });
      await AuditLog.deleteMany({ 'details.formTitle': { $regex: /Test/ } });
      console.log('✅ Cleaned up existing test data');
    } catch (error) {
      console.warn('⚠️  Cleanup warning:', error.message);
    }
  }

  async createTestUsers() {
    try {
      console.log('\n📝 Creating test users...');
      
      for (const [role, userData] of Object.entries(testData)) {
        const user = new User(userData);
        await user.save();
        this.testUsers[role] = user;
        console.log(`✅ Created ${role}: ${user.email}`);
      }
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }

  async testFormCreation() {
    try {
      console.log('\n🧪 Test 1: Form Creation');
      
      const formData = new FormsData({
        ...testForm,
        userId: this.testUsers.user._id,
        status: 'draft',
        lastActivityBy: this.testUsers.user._id
      });

      await formData.save();
      this.testUsers.testForm = formData;

      // Test audit logging
      await AuditService.logFormCreate(
        this.testUsers.user._id,
        this.testUsers.user.role,
        formData,
        '127.0.0.1',
        'Test User Agent'
      );

      this.addTestResult('Form Creation', true, 'Form created and audit logged successfully');
    } catch (error) {
      this.addTestResult('Form Creation', false, error.message);
    }
  }

  async testFormAssignment() {
    try {
      console.log('\n🧪 Test 2: Form Assignment');
      
      const formData = this.testUsers.testForm;
      const staff = this.testUsers.staff1;

      // Assign form to staff
      await formData.assignToStaff(staff._id, this.testUsers.admin._id);

      // Test audit logging
      await AuditService.logFormAssign(
        this.testUsers.admin._id,
        this.testUsers.admin.role,
        formData._id,
        staff,
        formData,
        '127.0.0.1',
        'Test User Agent'
      );

      // Verify assignment
      const updatedForm = await FormsData.findById(formData._id);
      if (updatedForm.assignedTo.toString() === staff._id.toString()) {
        this.addTestResult('Form Assignment', true, 'Form assigned to staff successfully');
      } else {
        this.addTestResult('Form Assignment', false, 'Form assignment verification failed');
      }
    } catch (error) {
      this.addTestResult('Form Assignment', false, error.message);
    }
  }

  async testFormVerification() {
    try {
      console.log('\n🧪 Test 3: Form Verification');
      
      const formData = this.testUsers.testForm;
      const staff = this.testUsers.staff1;

      // Verify form
      await formData.verifyByStaff(staff._id, 'Test verification notes');

      // Test audit logging
      await AuditService.logFormVerify(
        staff._id,
        staff.role,
        formData._id,
        formData,
        'Test verification notes',
        '127.0.0.1',
        'Test User Agent'
      );

      // Verify status change
      const updatedForm = await FormsData.findById(formData._id);
      if (updatedForm.status === 'verified' && updatedForm.verifiedBy.toString() === staff._id.toString()) {
        this.addTestResult('Form Verification', true, 'Form verified successfully');
      } else {
        this.addTestResult('Form Verification', false, 'Form verification verification failed');
      }
    } catch (error) {
      this.addTestResult('Form Verification', false, error.message);
    }
  }

  async testFormApproval() {
    try {
      console.log('\n🧪 Test 4: Form Approval');
      
      const formData = this.testUsers.testForm;
      const admin = this.testUsers.admin;

      // Approve form
      await formData.approveByAdmin(admin._id, true, 'Test approval notes');

      // Test audit logging
      await AuditService.logFormApprove(
        admin._id,
        admin.role,
        formData._id,
        formData,
        true,
        'Test approval notes',
        '127.0.0.1',
        'Test User Agent'
      );

      // Verify approval
      const updatedForm = await FormsData.findById(formData._id);
      if (updatedForm.status === 'completed' && updatedForm.approvedBy.toString() === admin._id.toString()) {
        this.addTestResult('Form Approval', true, 'Form approved successfully');
      } else {
        this.addTestResult('Form Approval', false, 'Form approval verification failed');
      }
    } catch (error) {
      this.addTestResult('Form Approval', false, error.message);
    }
  }

  async testRoleBasedAccess() {
    try {
      console.log('\n🧪 Test 5: Role-Based Access Control');
      
      // Test admin access
      const adminForms = await FormsData.getAdminForms({ roleFilters: {} });
      const adminCanViewAll = adminForms.length > 0;

      // Test staff access
      const staffForms = await FormsData.getStaffForms(this.testUsers.staff1._id, { roleFilters: {} });
      const staffCanViewAssigned = staffForms.length > 0;

      if (adminCanViewAll && staffCanViewAssigned) {
        this.addTestResult('Role-Based Access Control', true, 'Access control working correctly');
      } else {
        this.addTestResult('Role-Based Access Control', false, 'Access control verification failed');
      }
    } catch (error) {
      this.addTestResult('Role-Based Access Control', false, error.message);
    }
  }

  async testAuditTrail() {
    try {
      console.log('\n🧪 Test 6: Audit Trail');
      
      // Get form audit trail
      const auditTrail = await AuditService.getFormAuditTrail(this.testUsers.testForm._id);
      
      // Get staff activity
      const staffActivity = await AuditService.getStaffFormActivity(this.testUsers.staff1._id);

      if (auditTrail.length > 0 && staffActivity.length > 0) {
        this.addTestResult('Audit Trail', true, `Found ${auditTrail.length} audit entries and ${staffActivity.length} staff activities`);
      } else {
        this.addTestResult('Audit Trail', false, 'Audit trail verification failed');
      }
    } catch (error) {
      this.addTestResult('Audit Trail', false, error.message);
    }
  }

  async testStaffFormsManagement() {
    try {
      console.log('\n🧪 Test 7: Staff Forms Management');
      
      // Test staff can view assigned forms
      const staffForms = await FormsData.getStaffForms(this.testUsers.staff1._id, {});
      
      if (staffForms.length > 0) {
        this.addTestResult('Staff Forms Management', true, 'Staff can view assigned forms');
      } else {
        this.addTestResult('Staff Forms Management', false, 'Staff forms management verification failed');
      }
    } catch (error) {
      this.addTestResult('Staff Forms Management', false, error.message);
    }
  }

  async testAdminFormsManagement() {
    try {
      console.log('\n🧪 Test 8: Admin Forms Management');
      
      // Test admin can view all forms
      const adminForms = await FormsData.getAdminForms({});
      
      if (adminForms.length > 0) {
        this.addTestResult('Admin Forms Management', true, 'Admin can view all forms');
      } else {
        this.addTestResult('Admin Forms Management', false, 'Admin forms management verification failed');
      }
    } catch (error) {
      this.addTestResult('Admin Forms Management', false, error.message);
    }
  }

  addTestResult(testName, passed, message) {
    this.testResults.push({ testName, passed, message });
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${testName}: ${message}`);
  }

  printTestResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const total = this.testResults.length;
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.testName}: ${result.message}`);
    });
    
    console.log('\n📈 Overall Results:');
    console.log(`Passed: ${passed}/${total} (${Math.round((passed/total) * 100)}%)`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Forms integration is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the implementation.');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new FormsIntegrationTest();
  testSuite.runTests();
}

export { FormsIntegrationTest };
export default FormsIntegrationTest;
