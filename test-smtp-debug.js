import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

const SMTP_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'corpjack.rituraj@gmail.com',
    pass: process.env.EMAIL_PASS || 'itkg jioj rssz kkdw'
  }
};

async function testSMTPConnection() {
  console.log('🧪 Testing SMTP Configuration\n');
  console.log('=' .repeat(60));
  
  // Display configuration
  console.log('📧 SMTP Configuration:');
  console.log(`   Host: ${SMTP_CONFIG.host}`);
  console.log(`   Port: ${SMTP_CONFIG.port}`);
  console.log(`   User: ${SMTP_CONFIG.auth.user}`);
  console.log(`   Pass: ${SMTP_CONFIG.auth.pass ? '***' + SMTP_CONFIG.auth.pass.slice(-4) : 'NOT SET'}`);
  console.log(`   Secure: ${SMTP_CONFIG.secure}`);
  
  console.log('\n🔍 Environment Variables Check:');
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'NOT SET'}`);
  console.log(`   EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}`);
  
  try {
    // Test 1: Create transporter
    console.log('\n1. Creating Nodemailer transporter...');
    const transporter = nodemailer.createTransporter(SMTP_CONFIG);
    console.log('✅ Transporter created successfully');
    
    // Test 2: Verify connection
    console.log('\n2. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    
    // Test 3: Send test email
    console.log('\n3. Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_FROM || SMTP_CONFIG.auth.user,
      to: SMTP_CONFIG.auth.user, // Send to self for testing
      subject: 'SMTP Test Email - Document Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">SMTP Test Successful! 🎉</h2>
          <p>This is a test email to verify that SMTP configuration is working correctly.</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>Host:</strong> ${SMTP_CONFIG.host}</li>
              <li><strong>Port:</strong> ${SMTP_CONFIG.port}</li>
              <li><strong>User:</strong> ${SMTP_CONFIG.auth.user}</li>
              <li><strong>Secure:</strong> ${SMTP_CONFIG.secure}</li>
            </ul>
          </div>
          <p>If you received this email, your SMTP configuration is working perfectly!</p>
          <p>Best regards,<br>Document Management System</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Response: ${result.response}`);
    
    // Test 4: Test OTP email format
    console.log('\n4. Testing OTP email format...');
    const otpEmail = {
      from: process.env.EMAIL_FROM || SMTP_CONFIG.auth.user,
      to: SMTP_CONFIG.auth.user,
      subject: 'OTP Verification - Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome Test User!</h2>
          <p>Thank you for registering with us. To complete your registration, please verify your email address using the OTP below:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">123456</h1>
          </div>
          <p>This OTP is valid for 15 minutes. If you didn't request this OTP, please ignore this email.</p>
          <p>Best regards,<br>Document Management Team</p>
        </div>
      `
    };
    
    const otpResult = await transporter.sendMail(otpEmail);
    console.log('✅ OTP email format test successful!');
    console.log(`   Message ID: ${otpResult.messageId}`);
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 SMTP Configuration Test Complete!');
    console.log('=' .repeat(60));
    
    console.log('\n📋 SUMMARY:');
    console.log('✅ SMTP Configuration: Valid');
    console.log('✅ Connection: Working');
    console.log('✅ Email Sending: Working');
    console.log('✅ OTP Format: Working');
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Check your email inbox for the test emails');
    console.log('2. If emails are not received, check spam folder');
    console.log('3. Verify Gmail App Password is correct');
    console.log('4. Restart your server to load new environment variables');
    
  } catch (error) {
    console.log('\n❌ SMTP Test Failed!');
    console.log('=' .repeat(60));
    console.log('Error Details:');
    console.log(`   Code: ${error.code}`);
    console.log(`   Message: ${error.message}`);
    console.log(`   Command: ${error.command}`);
    console.log(`   Response: ${error.response}`);
    
    console.log('\n🔧 TROUBLESHOOTING:');
    
    if (error.code === 'EAUTH') {
      console.log('❌ Authentication failed:');
      console.log('   - Check if Gmail App Password is correct');
      console.log('   - Ensure 2-Factor Authentication is enabled on Gmail');
      console.log('   - Verify the App Password was generated correctly');
    } else if (error.code === 'ECONNECTION') {
      console.log('❌ Connection failed:');
      console.log('   - Check internet connection');
      console.log('   - Verify SMTP host and port settings');
      console.log('   - Check firewall settings');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('❌ Connection timeout:');
      console.log('   - Check network connectivity');
      console.log('   - Try different port (465 with secure: true)');
    } else {
      console.log('❌ Unknown error:');
      console.log('   - Check all configuration values');
      console.log('   - Verify .env file is in correct location');
      console.log('   - Restart server after .env changes');
    }
    
    console.log('\n📝 Gmail Setup Checklist:');
    console.log('1. Enable 2-Factor Authentication on Gmail');
    console.log('2. Generate App Password:');
    console.log('   - Go to Google Account Settings');
    console.log('   - Security → 2-Step Verification');
    console.log('   - App passwords → Generate');
    console.log('   - Use the generated password (not your regular password)');
    console.log('3. Update .env file with App Password');
    console.log('4. Restart server');
  }
}

testSMTPConnection();
