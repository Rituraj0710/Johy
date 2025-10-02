import mongoose from 'mongoose';
import User from './server/models/User.js';

async function checkAdminUser() {
  try {
    // Connect to database
    const DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/document_management';
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Connected to database');

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('Admin users found:', adminUsers.length);
    
    if (adminUsers.length > 0) {
      adminUsers.forEach(admin => {
        console.log(`- ${admin.name} (${admin.email}) - Active: ${admin.isActive}`);
      });
    } else {
      console.log('❌ No admin users found');
    }

    // Check for staff roles
    const staffRoles = await User.find({ role: { $in: ['staff1', 'staff2', 'staff3', 'staff4', 'staff5'] } });
    console.log('Staff users found:', staffRoles.length);

    // Check for roles in Role collection
    const Role = (await import('./server/models/Role.js')).default;
    const roles = await Role.find({});
    console.log('Roles in database:', roles.length);
    roles.forEach(role => {
      console.log(`- ${role.name} (${role.displayName}) - Active: ${role.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdminUser();
