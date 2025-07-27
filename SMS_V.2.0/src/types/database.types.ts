// Database types for Supabase
export interface Subscription {
  id: string;
  user_id: string;
  service_name: string;
  service_url?: string;
  service_image_url?: string;
  category?: string;
  status: 'active' | 'paused' | 'canceled';
  amount: number;
  currency: 'KRW' | 'USD';
  payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  payment_day?: number;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  auto_renewal?: boolean;
  alarm_days?: number[];
  tier?: string;
  benefits?: string;
  tags?: string[];
  memo?: string;
  created_at: string;
  updated_at: string;
}

export interface ExchangeRate {
  id: string;
  user_id: string;
  usd_krw: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionAlarm {
  id: string;
  user_id: string;
  subscription_id: string;
  alarm_type: 'payment' | 'renewal' | 'price_change';
  alarm_date: string;
  is_active: boolean;
  created_at: string;
}

// Supabase response types
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export type SupabaseSubscriptionResponse = SupabaseResponse<Subscription[]>;
export type SupabaseExchangeRateResponse = SupabaseResponse<ExchangeRate>;
export type SupabaseAlarmResponse = SupabaseResponse<SubscriptionAlarm[]>;

// Form types
export interface SubscriptionFormData {
  service_name: string;
  amount: number;
  currency: 'KRW' | 'USD';
  payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  payment_day?: number;
  service_url?: string;
  service_image_url?: string;
  category?: string;
  status?: 'active' | 'paused' | 'canceled';
  payment_method?: string;
  start_date?: string;
  auto_renewal?: boolean;
  memo?: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalSubscriptions: number;
  monthlyCost: number;
  averageCost: number;
  activeCount: number;
  totalCostKRW: number;
  totalCostUSD: number;
}