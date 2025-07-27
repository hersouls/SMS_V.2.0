export interface Database {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          service_name: string;
          service_url: string | null;
          service_image_url: string | null;
          category: string[] | null;
          status: 'active' | 'paused' | 'canceled';
          amount: number;
          currency: 'KRW' | 'USD';
          payment_cycle: 'monthly' | 'yearly' | 'once';
          payment_day: number;
          payment_method: string | null;
          start_date: string | null;
          end_date: string | null;
          auto_renewal: boolean;
          alarm_days: number[] | null;
          tier: string | null;
          benefits: string | null;
          tags: string[] | null;
          memo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_name: string;
          service_url?: string | null;
          service_image_url?: string | null;
          category?: string[] | null;
          status?: 'active' | 'paused' | 'canceled';
          amount: number;
          currency?: 'KRW' | 'USD';
          payment_cycle?: 'monthly' | 'yearly' | 'once';
          payment_day: number;
          payment_method?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          auto_renewal?: boolean;
          alarm_days?: number[] | null;
          tier?: string | null;
          benefits?: string | null;
          tags?: string[] | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_name?: string;
          service_url?: string | null;
          service_image_url?: string | null;
          category?: string[] | null;
          status?: 'active' | 'paused' | 'canceled';
          amount?: number;
          currency?: 'KRW' | 'USD';
          payment_cycle?: 'monthly' | 'yearly' | 'once';
          payment_day?: number;
          payment_method?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          auto_renewal?: boolean;
          alarm_days?: number[] | null;
          tier?: string | null;
          benefits?: string | null;
          tags?: string[] | null;
          memo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exchange_rates: {
        Row: {
          user_id: string;
          usd_krw: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          usd_krw?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          usd_krw?: number;
          updated_at?: string;
        };
      };
      subscription_alarms: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string;
          alarm_type: string;
          alarm_day: number | null;
          alarm_time: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id: string;
          alarm_type: string;
          alarm_day?: number | null;
          alarm_time?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string;
          alarm_type?: string;
          alarm_day?: number | null;
          alarm_time?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type ExchangeRate = Database['public']['Tables']['exchange_rates']['Row'];
export type SubscriptionAlarm = Database['public']['Tables']['subscription_alarms']['Row'];

export type InsertSubscription = Database['public']['Tables']['subscriptions']['Insert'];
export type UpdateSubscription = Database['public']['Tables']['subscriptions']['Update'];

export type InsertExchangeRate = Database['public']['Tables']['exchange_rates']['Insert'];
export type UpdateExchangeRate = Database['public']['Tables']['exchange_rates']['Update'];