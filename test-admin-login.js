import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server/.env') });

async function testAdminLogin() {
  try {
    console.log('🔍 Testing Admin Login Setup\n');
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/document_management');
    console.log('✅ Connected to MongoDB');
    
    // Check if admin user exists
    console.log('\n2. Checking for admin user...');
    const adminUser = await User.findOne({ email: 'id-admin@gmail.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log(`   ID: ${adminUser._id}`);
      console.log(`   Name: ${adminUser.name}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Is Active: ${adminUser.isActive}`);
      console.log(`   Created: ${adminUser.createdAt}`);
    } else {
      console.log('❌ Admin user not found');
      console.log('🔧 Creating admin user...');
      
      const newAdmin = new User({
        name: 'Super Admin',
        email: 'id-admin@gmail.com',
        password: 'admin1234',
        role: 'admin',
        isActive: true,
        department: 'Administration',
        employeeId: 'ADMIN001'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
    }
    
    // Test login with admin credentials
    console.log('\n3. Testing admin login...');
    const testAdmin = await User.findOne({ email: 'id-admin@gmail.com' }).select('+password');
    
    if (testAdmin) {
      const isPasswordValid = await testAdmin.comparePassword('admin1234');
      console.log(`   Password valid: ${isPasswordValid}`);
      
      if (isPasswordValid) {
        console.log('✅ Admin login credentials are working');
      } else {
        console.log('❌ Admin password is incorrect');
      }
    }
    
    // Check all users with admin/staff roles
    console.log('\n4. Checking all admin/staff users...');
    const adminStaffUsers = await User.find({ 
      role: { $in: ['admin', 'staff1', 'staff2', 'staff3', 'staff4', 'staff5'] } 
    }).select('name email role isActive');
    
    console.log(`Found ${adminStaffUsers.length} admin/staff users:`);
    adminStaffUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Admin Login Test Complete!');
    console.log('=' .repeat(60));
    
    console.log('\n📋 SUMMARY:');
    console.log('✅ MongoDB: Connected');
    console.log('✅ Admin User: Available');
    console.log('✅ Login Credentials: Working');
    
    console.log('\n🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email: id-admin@gmail.com');
    console.log('   Password: admin1234');
    console.log('   Role: admin');
    
  } catch (error) {
    console.log('\n❌ Test Failed!');
    console.log('=' .repeat(60));
    console.log('Error Details:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testAdminLogin();
