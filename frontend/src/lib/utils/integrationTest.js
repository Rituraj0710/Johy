/**
 * Integration test utility
 * Tests frontend-backend connectivity and configuration
 */

import { getApiBaseUrl, getEnvironmentInfo } from './env.js';

// Test API connectivity
export const testApiConnectivity = async () => {
  const apiBase = getApiBaseUrl();
  const testEndpoint = `${apiBase}/api/health`; // Assuming you have a health endpoint
  
  try {
    const response = await fetch(testEndpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ API connectivity test passed');
      return { success: true, status: response.status };
    } else {
      console.log('⚠️ API connectivity test failed:', response.status);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error('❌ API connectivity test error:', error.message);
    return { success: false, error: error.message };
  }
};

// Test CORS configuration
export const testCorsConfiguration = async () => {
  const apiBase = getApiBaseUrl();
  const testEndpoint = `${apiBase}/api/user/profile`; // Test with a protected endpoint
  
  try {
    const response = await fetch(testEndpoint, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // CORS is working if we get a response (even if 401/403)
    if (response.status !== 0) {
      console.log('✅ CORS configuration test passed');
      return { success: true, status: response.status };
    } else {
      console.log('❌ CORS configuration test failed - likely CORS issue');
      return { success: false, error: 'CORS configuration issue' };
    }
  } catch (error) {
    console.error('❌ CORS configuration test error:', error.message);
    return { success: false, error: error.message };
  }
};

// Test environment configuration
export const testEnvironmentConfiguration = () => {
  const envInfo = getEnvironmentInfo();
  
  console.log('🔍 Environment Configuration:');
  console.log('  Node Environment:', envInfo.nodeEnv);
  console.log('  API Base URL:', envInfo.apiBase);
  console.log('  Is Development:', envInfo.isDev);
  console.log('  Is Production:', envInfo.isProd);
  
  // Check for common issues
  const issues = [];
  
  if (envInfo.isProd && envInfo.apiBase.includes('localhost')) {
    issues.push('Production environment using localhost URL');
  }
  
  if (!envInfo.apiBase.startsWith('http')) {
    issues.push('API base URL missing protocol (http/https)');
  }
  
  if (issues.length > 0) {
    console.log('⚠️ Environment issues found:', issues);
    return { success: false, issues };
  } else {
    console.log('✅ Environment configuration test passed');
    return { success: true };
  }
};

// Run all integration tests
export const runIntegrationTests = async () => {
  console.log('🚀 Running Frontend-Backend Integration Tests...\n');
  
  const results = {
    environment: testEnvironmentConfiguration(),
    apiConnectivity: await testApiConnectivity(),
    corsConfiguration: await testCorsConfiguration(),
  };
  
  console.log('\n📊 Integration Test Results:');
  console.log('  Environment Config:', results.environment.success ? '✅' : '❌');
  console.log('  API Connectivity:', results.apiConnectivity.success ? '✅' : '❌');
  console.log('  CORS Configuration:', results.corsConfiguration.success ? '✅' : '❌');
  
  const allPassed = Object.values(results).every(result => result.success);
  
  if (allPassed) {
    console.log('\n🎉 All integration tests passed!');
  } else {
    console.log('\n⚠️ Some integration tests failed. Check the logs above.');
  }
  
  return results;
};

// Export for use in development
if (typeof window !== 'undefined') {
  window.runIntegrationTests = runIntegrationTests;
}
