// Database types for Supabase
export interface Subscription {
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
  error: any;
}

export interface SupabaseSubscriptionResponse extends SupabaseResponse<Subscription[]> {}
export interface SupabaseExchangeRateResponse extends SupabaseResponse<ExchangeRate> {}
export interface SupabaseAlarmResponse extends SupabaseResponse<SubscriptionAlarm[]> {}

// Form types
export interface SubscriptionFormData {
  service_name: string;
  amount: number;
  currency: 'KRW' | 'USD';
  payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  next_payment_date: string;
  service_url?: string;
  logo_url?: string;
  category?: string;
  status?: 'active' | 'paused' | 'canceled';
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