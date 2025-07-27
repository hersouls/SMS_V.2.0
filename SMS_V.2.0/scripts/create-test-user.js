import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createTestUser() {
  try {
    console.log('🔐 Creating test user...');

    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          name: 'Test User',
          role: 'user'
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Test user already exists. Signing in...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'testpassword123'
        });

        if (signInError) {
          console.error('❌ Sign in failed:', signInError);
          return;
        }

        console.log('✅ Signed in successfully as test user');
        return signInData.user;
      } else {
        console.error('❌ Error creating user:', error);
        return;
      }
    }

    console.log('✅ Test user created successfully');
    return data.user;
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestUser();