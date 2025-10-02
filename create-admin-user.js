import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Simple connection without database name first
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017');
    console.log("✅ Connected to MongoDB");
    
    // Create database
    const db = mongoose.connection.db;
    await db.createCollection('users');
    console.log("✅ Database and collection ready");
    
    return db;
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    console.log('🔍 Creating Admin User\n');
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    await connectDB();
    
    // Define user schema
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, enum: ['user1', 'user2', 'admin', 'staff1', 'staff2', 'staff3', 'staff4', 'staff5'], default: 'user1' },
      isActive: { type: Boolean, default: true },
      department: String,
      employeeId: String,
      createdAt: { type: Date, default: Date.now },
      lastLogin: Date
    });
    
    // Add password comparison method
    userSchema.methods.comparePassword = async function(candidatePassword) {
      return await bcrypt.compare(candidatePassword, this.password);
    };
    
    const User = mongoose.model('User', userSchema);
    
    // Check if admin user exists
    console.log('1. Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: 'id-admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Active: ${existingAdmin.isActive}`);
    } else {
      console.log('2. Creating new admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('admin1234', 12);
      
      const adminUser = new User({
        name: 'Super Admin',
        email: 'id-admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        department: 'Administration',
        employeeId: 'ADMIN001'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }
    
    // Test login
    console.log('\n3. Testing admin login...');
    const testUser = await User.findOne({ email: 'id-admin@gmail.com' });
    const isPasswordValid = await testUser.comparePassword('admin1234');
    
    if (isPasswordValid) {
      console.log('✅ Admin login credentials are working');
    } else {
      console.log('❌ Admin password verification failed');
    }
    
    // List all users
    console.log('\n4. All users in database:');
    const allUsers = await User.find({}).select('name email role isActive');
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
    });
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 Admin User Setup Complete!');
    console.log('=' .repeat(60));
    
    console.log('\n🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email: id-admin@gmail.com');
    console.log('   Password: admin1234');
    console.log('   Role: admin');
    
  } catch (error) {
    console.log('\n❌ Setup Failed!');
    console.log('=' .repeat(60));
    console.log('Error Details:');
    console.log(`   Message: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

createAdminUser();
