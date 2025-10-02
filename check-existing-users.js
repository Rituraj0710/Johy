import mongoose from 'mongoose';
import User from './server/models/User.js';

async function checkExistingUsers() {
  try {
    // Connect to database
    const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/document_management';
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to database');

    // Check for all users
    const allUsers = await User.find({});
    console.log('Total users found:', allUsers.length);
    
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Phone: ${user.phone} - Role: ${user.role}`);
    });

    // Check for staff users specifically
    const staffUsers = await User.find({ role: { $in: ['staff1', 'staff2', 'staff3', 'staff4', 'staff5'] } });
    console.log('\nStaff users found:', staffUsers.length);
    
    staffUsers.forEach(staff => {
      console.log(`- ${staff.name} (${staff.email}) - Phone: ${staff.phone} - Role: ${staff.role}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkExistingUsers();
