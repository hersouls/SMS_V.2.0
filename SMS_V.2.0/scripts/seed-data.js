import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample subscription data
const sampleSubscriptions = [
  {
    service_name: 'Netflix',
    service_url: 'https://netflix.com',
    service_image_url: 'https://logo.clearbit.com/netflix.com',
    category: 'Streaming',
    status: 'active',
    amount: 17000,
    currency: 'KRW',
    payment_cycle: 'monthly',
    payment_day: 15,
    payment_method: 'Credit Card',
    start_date: '2024-01-15',
    auto_renewal: true,
    alarm_days: [10, 13],
    tier: 'Standard',
    benefits: '4K streaming, 4 screens',
    tags: ['entertainment', 'streaming'],
    memo: '주요 엔터테인먼트 서비스'
  },
  {
    service_name: 'Spotify Premium',
    service_url: 'https://spotify.com',
    service_image_url: 'https://logo.clearbit.com/spotify.com',
    category: 'Music',
    status: 'active',
    amount: 13900,
    currency: 'KRW',
    payment_cycle: 'monthly',
    payment_day: 20,
    payment_method: 'Credit Card',
    start_date: '2024-02-20',
    auto_renewal: true,
    alarm_days: [15, 18],
    tier: 'Premium',
    benefits: 'Ad-free music, offline downloads',
    tags: ['music', 'audio'],
    memo: '음악 스트리밍 서비스'
  },
  {
    service_name: 'Adobe Creative Cloud',
    service_url: 'https://adobe.com',
    service_image_url: 'https://logo.clearbit.com/adobe.com',
    category: 'Software',
    status: 'active',
    amount: 29.99,
    currency: 'USD',
    payment_cycle: 'monthly',
    payment_day: 5,
    payment_method: 'Credit Card',
    start_date: '2024-01-05',
    auto_renewal: true,
    alarm_days: [1, 3],
    tier: 'Creative Cloud',
    benefits: 'Photoshop, Illustrator, Premiere Pro',
    tags: ['design', 'creative'],
    memo: '디자인 작업용 소프트웨어'
  },
  {
    service_name: 'GitHub Pro',
    service_url: 'https://github.com',
    service_image_url: 'https://logo.clearbit.com/github.com',
    category: 'Software',
    status: 'active',
    amount: 4,
    currency: 'USD',
    payment_cycle: 'monthly',
    payment_day: 10,
    payment_method: 'Credit Card',
    start_date: '2024-03-10',
    auto_renewal: true,
    alarm_days: [5, 8],
    tier: 'Pro',
    benefits: 'Private repositories, advanced features',
    tags: ['development', 'coding'],
    memo: '코드 저장소 및 협업 도구'
  },
  {
    service_name: 'YouTube Premium',
    service_url: 'https://youtube.com',
    service_image_url: 'https://logo.clearbit.com/youtube.com',
    category: 'Entertainment',
    status: 'paused',
    amount: 14900,
    currency: 'KRW',
    payment_cycle: 'monthly',
    payment_day: 25,
    payment_method: 'Credit Card',
    start_date: '2024-01-25',
    auto_renewal: false,
    alarm_days: [20, 23],
    tier: 'Premium',
    benefits: 'Ad-free videos, background play',
    tags: ['video', 'entertainment'],
    memo: '일시 중지 - 사용 빈도 감소'
  },
  {
    service_name: 'Notion',
    service_url: 'https://notion.so',
    service_image_url: 'https://logo.clearbit.com/notion.so',
    category: 'Productivity',
    status: 'active',
    amount: 8,
    currency: 'USD',
    payment_cycle: 'monthly',
    payment_day: 12,
    payment_method: 'Credit Card',
    start_date: '2024-02-12',
    auto_renewal: true,
    alarm_days: [8, 10],
    tier: 'Personal Pro',
    benefits: 'Unlimited blocks, advanced features',
    tags: ['productivity', 'notes'],
    memo: '노트 및 프로젝트 관리 도구'
  }
];

async function seedData() {
  try {
    console.log('🌱 Starting data seeding...');

    // Get current user (you need to be authenticated)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ User not authenticated. Please sign in first.');
      return;
    }

    console.log(`✅ Authenticated as: ${user.email}`);

    // Insert sample subscriptions
    for (const subscription of sampleSubscriptions) {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...subscription,
          user_id: user.id
        });

      if (error) {
        console.error(`❌ Error inserting ${subscription.service_name}:`, error);
      } else {
        console.log(`✅ Added: ${subscription.service_name}`);
      }
    }

    // Set exchange rate
    const { error: rateError } = await supabase
      .from('exchange_rates')
      .upsert({
        user_id: user.id,
        usd_krw: 1350
      });

    if (rateError) {
      console.error('❌ Error setting exchange rate:', rateError);
    } else {
      console.log('✅ Exchange rate set to 1350 KRW/USD');
    }

    console.log('🎉 Data seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedData();