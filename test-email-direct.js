import nodemailer from 'nodemailer';

// Direct configuration with the App Password
const SMTP_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'riturajgupta499@gmail.com',
    pass: 'aifq esmz rybi hvtd' // App Password with spaces
  }
};

async function testEmailDirect() {
  console.log('🧪 Testing Email Configuration Directly\n');
  console.log('=' .repeat(60));
  
  console.log('📧 SMTP Configuration:');
  console.log(`   Host: ${SMTP_CONFIG.host}`);
  console.log(`   Port: ${SMTP_CONFIG.port}`);
  console.log(`   User: ${SMTP_CONFIG.auth.user}`);
  console.log(`   Pass: ${SMTP_CONFIG.auth.pass ? '***' + SMTP_CONFIG.auth.pass.slice(-4) : 'NOT SET'}`);
  console.log(`   Secure: ${SMTP_CONFIG.secure}`);
  
  try {
    // Test 1: Create transporter
    console.log('\n1. Creating Nodemailer transporter...');
    const transporter = nodemailer.createTransport(SMTP_CONFIG);
    console.log('✅ Transporter created successfully');
    
    // Test 2: Verify connection
    console.log('\n2. Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
    
    // Test 3: Send test email
    console.log('\n3. Sending test email...');
    const testEmail = {
      from: 'riturajgupta499@gmail.com',
      to: 'riturajgupta499@gmail.com', // Send to self for testing
      subject: 'Email Configuration Test - riturajgupta499@gmail.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Configuration Test Successful! 🎉</h2>
          <p>This is a test email to verify that the new email configuration is working correctly.</p>
          <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3>Configuration Details:</h3>
            <ul>
              <li><strong>Host:</strong> ${SMTP_CONFIG.host}</li>
              <li><strong>Port:</strong> ${SMTP_CONFIG.port}</li>
              <li><strong>User:</strong> ${SMTP_CONFIG.auth.user}</li>
              <li><strong>Secure:</strong> ${SMTP_CONFIG.secure}</li>
            </ul>
          </div>
          <p>If you received this email, your new email configuration is working perfectly!</p>
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
      from: 'riturajgupta499@gmail.com',
      to: 'riturajgupta499@gmail.com',
      subject: 'OTP Verification - Test (riturajgupta499@gmail.com)',
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
    console.log('🎉 Email Configuration Test Complete!');
    console.log('=' .repeat(60));
    
    console.log('\n📋 SUMMARY:');
    console.log('✅ SMTP Configuration: Valid');
    console.log('✅ Connection: Working');
    console.log('✅ Email Sending: Working');
    console.log('✅ OTP Format: Working');
    
    console.log('\n💡 CHECK YOUR EMAIL:');
    console.log('📧 Check riturajgupta499@gmail.com inbox for test emails');
    console.log('📧 If emails are not received, check spam folder');
    console.log('📧 OTP emails will now be sent from riturajgupta499@gmail.com');
    
  } catch (error) {
    console.log('\n❌ Email Test Failed!');
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
      console.log('   - Ensure 2-Factor Authentication is enabled on riturajgupta499@gmail.com');
      console.log('   - Verify the App Password was generated correctly');
      console.log('   - Try removing spaces from App Password: aifqesmzrybihvtd');
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
  }
}

testEmailDirect();
