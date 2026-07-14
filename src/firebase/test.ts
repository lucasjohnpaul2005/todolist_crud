import { auth } from './config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Test Firebase connection
export const testFirebase = async () => {
  console.log('🔥 Testing Firebase connection...');
  console.log('📧 Auth object:', auth ? '✅ Auth initialized' : '❌ Auth failed');
  
  try {
    // Test by trying to create a temporary account
    console.log('📝 Testing auth with a test account...');
    // Use a unique test email
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'Test123456';
    
    try {
      const userCred = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ Firebase is working! User created:', userCred.user.email);
      // Clean up - delete the test user (optional)
      return true;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('✅ Firebase is working! (Test email already exists)');
        return true;
      }
      console.error('❌ Firebase auth test failed:', error.code, error.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};