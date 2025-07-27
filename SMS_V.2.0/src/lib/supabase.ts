import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          service_name: string;
          amount: number;
          currency: 'KRW' | 'USD';
          payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          next_payment_date: string;
          service_url?: string;
          logo_url?: string;
          category?: string;
          status: 'active' | 'paused' | 'canceled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_name: string;
          amount: number;
          currency: 'KRW' | 'USD';
          payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          next_payment_date: string;
          service_url?: string;
          logo_url?: string;
          category?: string;
          status?: 'active' | 'paused' | 'canceled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_name?: string;
          amount?: number;
          currency?: 'KRW' | 'USD';
          payment_cycle?: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
          next_payment_date?: string;
          service_url?: string;
          logo_url?: string;
          category?: string;
          status?: 'active' | 'paused' | 'canceled';
          created_at?: string;
          updated_at?: string;
        };
      };
      exchange_rates: {
        Row: {
          id: string;
          user_id: string;
          usd_krw: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          usd_krw: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          usd_krw?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscription_alarms: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string;
          alarm_type: 'payment' | 'renewal' | 'price_change';
          alarm_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id: string;
          alarm_type: 'payment' | 'renewal' | 'price_change';
          alarm_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string;
          alarm_type?: 'payment' | 'renewal' | 'price_change';
          alarm_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}