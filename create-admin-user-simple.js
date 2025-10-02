import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/document_management');
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    console.log('🔍 Creating Admin User\n');
    
    // Define admin user data
    const adminData = {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin',
      isActive: true,
      is_verified: true,
      department: 'Administration',
      employeeId: 'ADMIN001'
    };

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
    adminData.password = hashedPassword;

    // Create user schema and save
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      phone: { type: String },
      role: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      is_verified: { type: Boolean, default: false },
      department: { type: String },
      employeeId: { type: String }
    }, { timestamps: true });

    const User = mongoose.model('User', userSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', 'admin123');
    console.log('Role:', adminData.role);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createAdminUser();
  await mongoose.disconnect();
  console.log('\n🎉 Process completed!');
};

main();
