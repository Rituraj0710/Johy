import mongoose from 'mongoose';
import TrustDeed from './models/TrustDeed.js';

async function testAtlasConnection() {
  try {
    // This will use the DATABASE_URL from .env file
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/document_app';
    console.log('Connecting to:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    const count = await TrustDeed.countDocuments();
    console.log('Total trust deeds in Atlas database:', count);
    
    if (count > 0) {
      const recentTrustDeeds = await TrustDeed.find().sort({ 'meta.createdAt': -1 }).limit(3);
      console.log('\nRecent trust deeds in Atlas:');
      recentTrustDeeds.forEach((deed, index) => {
        console.log(`${index + 1}. ID: ${deed._id}`);
        console.log(`   Name: ${deed.trustName}`);
        console.log(`   Status: ${deed.meta.status}`);
        console.log(`   Created: ${deed.meta.createdAt}`);
        console.log('---');
      });
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. You have created a .env file with your Atlas connection string');
    console.log('2. Your Atlas cluster is running');
    console.log('3. Your IP address is whitelisted in Atlas');
    console.log('4. Your username and password are correct');
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testAtlasConnection();
