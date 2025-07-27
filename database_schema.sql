-- SMS v2.0 Database Schema
-- Supabase PostgreSQL Database

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'super-secret-jwt-token-with-at-least-32-characters-long';

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  service_url TEXT,
  service_image_url TEXT,
  category TEXT[],
  status TEXT CHECK (status IN ('active', 'paused', 'canceled')) DEFAULT 'active',
  amount NUMERIC NOT NULL,
  currency TEXT CHECK (currency IN ('KRW', 'USD')) DEFAULT 'KRW',
  payment_cycle TEXT CHECK (payment_cycle IN ('monthly', 'yearly', 'once')) DEFAULT 'monthly',
  payment_day INTEGER CHECK (payment_day >= 1 AND payment_day <= 31),
  payment_method TEXT,
  start_date DATE,
  end_date DATE,
  auto_renewal BOOLEAN DEFAULT true,
  alarm_days INTEGER[],
  tier TEXT,
  benefits TEXT,
  tags TEXT[],
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exchange_rates table
CREATE TABLE IF NOT EXISTS exchange_rates (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  usd_krw NUMERIC DEFAULT 1300,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_alarms table
CREATE TABLE IF NOT EXISTS subscription_alarms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  alarm_type TEXT NOT NULL,
  alarm_day INTEGER,
  alarm_time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_alarms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exchange_rates
CREATE POLICY "Users can view their own exchange rate" ON exchange_rates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exchange rate" ON exchange_rates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exchange rate" ON exchange_rates
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for subscription_alarms
CREATE POLICY "Users can view their own alarms" ON subscription_alarms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alarms" ON subscription_alarms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alarms" ON subscription_alarms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alarms" ON subscription_alarms
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_payment_day ON subscriptions(payment_day);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_alarms_subscription_id ON subscription_alarms(subscription_id);
CREATE INDEX idx_alarms_user_id ON subscription_alarms(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscriptions table
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for exchange_rates table
CREATE TRIGGER update_exchange_rates_updated_at 
    BEFORE UPDATE ON exchange_rates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for user subscription summary
CREATE VIEW user_subscription_summary AS
SELECT 
  u.id as user_id,
  COUNT(s.id) as total_subscriptions,
  COUNT(CASE WHEN s.status = 'active' THEN 1 END) as active_subscriptions,
  SUM(CASE WHEN s.currency = 'KRW' AND s.status = 'active' THEN s.amount ELSE 0 END) as total_krw_monthly,
  SUM(CASE WHEN s.currency = 'USD' AND s.status = 'active' THEN s.amount ELSE 0 END) as total_usd_monthly,
  AVG(CASE WHEN s.status = 'active' THEN s.amount END) as average_amount
FROM auth.users u
LEFT JOIN subscriptions s ON u.id = s.user_id
GROUP BY u.id;