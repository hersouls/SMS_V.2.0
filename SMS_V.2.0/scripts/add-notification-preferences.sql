-- Add user_notification_preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_reminders BOOLEAN DEFAULT true,
  renewal_alerts BOOLEAN DEFAULT true,
  price_changes BOOLEAN DEFAULT true,
  monthly_summary BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_notification_preferences
CREATE POLICY "Users can view their own notification preferences" ON user_notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" ON user_notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" ON user_notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences" ON user_notification_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_notification_preferences_user_id ON user_notification_preferences(user_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_notification_preferences_updated_at 
  BEFORE UPDATE ON user_notification_preferences 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();