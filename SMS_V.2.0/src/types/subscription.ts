// Subscription types for Moonwave v2.0
export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  url?: string;
  imageUrl?: string;
  price: number;
  currency: 'KRW' | 'USD';
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  billingDay: number;
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  status: 'active' | 'paused' | 'cancelled';
  categories: string[];
  notifications: {
    sevenDaysBefore: boolean;
    threeDaysBefore: boolean;
    onBillingDay: boolean;
  };
  notes?: string;
  paymentMethod?: string;
  tier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  name: string;
  url: string;
  price: number;
  currency: 'KRW' | 'USD';
  billingCycle: 'monthly' | 'yearly' | 'one-time';
  billingDay: number;
  startDate: string;
  autoRenew: boolean;
  status: 'active' | 'paused' | 'cancelled';
  categories: string[];
  notifications: {
    sevenDaysBefore: boolean;
    threeDaysBefore: boolean;
    onBillingDay: boolean;
  };
  notes: string;
  imageUrl: string;
  paymentMethod: string;
  tier: string;
}

// Legacy database types (for backward compatibility)
export interface DatabaseSubscription {
  id: string;
  user_id: string;
  service_name: string;
  service_url?: string;
  service_image_url?: string;
  logo_url?: string;
  category?: string;
  status: 'active' | 'paused' | 'canceled';
  amount: number;
  currency: 'KRW' | 'USD';
  payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  payment_day?: number;
  next_payment_date?: string;
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

export interface DatabaseSubscriptionFormData {
  service_name: string;
  amount: number;
  currency: 'KRW' | 'USD';
  payment_cycle: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  payment_day?: number;
  next_payment_date?: string;
  service_url?: string;
  service_image_url?: string;
  logo_url?: string;
  category?: string;
  status?: 'active' | 'paused' | 'canceled';
  payment_method?: string;
  start_date?: string;
  auto_renewal?: boolean;
  memo?: string;
}

// Utility functions for type conversion
export const convertDatabaseToSubscription = (dbSub: DatabaseSubscription): Subscription => {
  return {
    id: dbSub.id,
    user_id: dbSub.user_id,
    name: dbSub.service_name,
    url: dbSub.service_url,
    imageUrl: dbSub.service_image_url || dbSub.logo_url,
    price: dbSub.amount,
    currency: dbSub.currency,
    billingCycle: dbSub.payment_cycle === 'quarterly' ? 'monthly' : 
                  dbSub.payment_cycle === 'weekly' ? 'monthly' : dbSub.payment_cycle,
    billingDay: dbSub.payment_day || 1,
    startDate: dbSub.start_date || new Date().toISOString().split('T')[0],
    nextBillingDate: dbSub.next_payment_date || new Date().toISOString().split('T')[0],
    autoRenew: dbSub.auto_renewal || true,
    status: dbSub.status === 'canceled' ? 'cancelled' : dbSub.status,
    categories: dbSub.tags || (dbSub.category ? [dbSub.category] : []),
    notifications: {
      sevenDaysBefore: dbSub.alarm_days?.includes(7) || false,
      threeDaysBefore: dbSub.alarm_days?.includes(3) || true,
      onBillingDay: dbSub.alarm_days?.includes(0) || true,
    },
    notes: dbSub.memo,
    paymentMethod: dbSub.payment_method,
    tier: dbSub.tier,
    createdAt: dbSub.created_at,
    updatedAt: dbSub.updated_at,
  };
};

export const convertSubscriptionToDatabase = (sub: Subscription): DatabaseSubscription => {
  const alarmDays: number[] = [];
  if (sub.notifications.sevenDaysBefore) alarmDays.push(7);
  if (sub.notifications.threeDaysBefore) alarmDays.push(3);
  if (sub.notifications.onBillingDay) alarmDays.push(0);

  return {
    id: sub.id,
    user_id: sub.user_id,
    service_name: sub.name,
    service_url: sub.url,
    service_image_url: sub.imageUrl,
    logo_url: sub.imageUrl,
    category: sub.categories[0],
    status: sub.status === 'cancelled' ? 'canceled' : sub.status,
    amount: sub.price,
    currency: sub.currency,
    payment_cycle: sub.billingCycle === 'one-time' ? 'monthly' : sub.billingCycle,
    payment_day: sub.billingDay,
    next_payment_date: sub.nextBillingDate,
    payment_method: sub.paymentMethod,
    start_date: sub.startDate,
    end_date: undefined,
    auto_renewal: sub.autoRenew,
    alarm_days: alarmDays,
    tier: sub.tier,
    benefits: undefined,
    tags: sub.categories,
    memo: sub.notes,
    created_at: sub.createdAt,
    updated_at: sub.updatedAt,
  };
};

export const convertFormDataToDatabase = (formData: SubscriptionFormData): DatabaseSubscriptionFormData => {
  const alarmDays: number[] = [];
  if (formData.notifications.sevenDaysBefore) alarmDays.push(7);
  if (formData.notifications.threeDaysBefore) alarmDays.push(3);
  if (formData.notifications.onBillingDay) alarmDays.push(0);

  return {
    service_name: formData.name,
    amount: formData.price,
    currency: formData.currency,
    payment_cycle: formData.billingCycle,
    payment_day: formData.billingDay,
    next_payment_date: formData.startDate,
    service_url: formData.url,
    service_image_url: formData.imageUrl,
    logo_url: formData.imageUrl,
    category: formData.categories[0],
    status: formData.status,
    payment_method: formData.paymentMethod,
    start_date: formData.startDate,
    auto_renewal: formData.autoRenew,
    memo: formData.notes,
  };
};