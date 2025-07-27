import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

interface NotificationPreferences {
  payment_reminders: boolean;
  renewal_alerts: boolean;
  price_changes: boolean;
  monthly_summary: boolean;
  system_updates: boolean;
}

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    payment_reminders: true,
    renewal_alerts: true,
    price_changes: true,
    monthly_summary: true,
    system_updates: false
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const loadNotificationPreferences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('알림 설정을 불러오는 중 오류가 발생했습니다:', error);
        return;
      }

      if (data) {
        setPreferences({
          payment_reminders: data.payment_reminders ?? true,
          renewal_alerts: data.renewal_alerts ?? true,
          price_changes: data.price_changes ?? true,
          monthly_summary: data.monthly_summary ?? true,
          system_updates: data.system_updates ?? false
        });
      }
    } catch (error) {
      console.error('알림 설정을 불러오는 중 오류가 발생했습니다:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();
    }
  }, [user, loadNotificationPreferences]);

  const saveNotificationPreferences = async (newPreferences: NotificationPreferences) => {
    if (!user) return;

    setLoading(true);
    setSaveStatus('saving');

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          payment_reminders: newPreferences.payment_reminders,
          renewal_alerts: newPreferences.renewal_alerts,
          price_changes: newPreferences.price_changes,
          monthly_summary: newPreferences.monthly_summary,
          system_updates: newPreferences.system_updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('알림 설정을 저장하는 중 오류가 발생했습니다:', error);
        setSaveStatus('error');
      } else {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('알림 설정을 저장하는 중 오류가 발생했습니다:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    
    setPreferences(newPreferences);
    await saveNotificationPreferences(newPreferences);
  };

  const notificationTypes = [
    {
      key: 'payment_reminders' as const,
      label: '결제 알림',
      description: '구독료 결제일 3일 전 알림',
      icon: Bell
    },
    {
      key: 'renewal_alerts' as const,
      label: '갱신 알림',
      description: '구독 자동 갱신 알림',
      icon: Bell
    },
    {
      key: 'price_changes' as const,
      label: '가격 변동 알림',
      description: '구독료 가격 변경 알림',
      icon: Bell
    },
    {
      key: 'monthly_summary' as const,
      label: '월간 요약',
      description: '월 구독료 지출 요약 리포트',
      icon: Bell
    },
    {
      key: 'system_updates' as const,
      label: '시스템 업데이트',
      description: '앱 업데이트 및 새로운 기능 알림',
      icon: Bell
    }
  ];

  return (
    <div className="space-y-6">
      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
          saveStatus === 'saved' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          {saveStatus === 'saving' && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
          )}
          {saveStatus === 'saved' && <CheckCircle className="h-5 w-5" />}
          {saveStatus === 'error' && <AlertCircle className="h-5 w-5" />}
          <span className="text-sm font-medium break-keep-ko tracking-ko-normal font-pretendard">
            {saveStatus === 'saving' && '저장 중...'}
            {saveStatus === 'saved' && '설정이 저장되었습니다'}
            {saveStatus === 'error' && '저장 중 오류가 발생했습니다'}
          </span>
        </div>
      )}

      {/* Notification Toggles */}
      <div className="space-y-4">
        {notificationTypes.map(({ key, label, description, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 card-gradient rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={`toggle-${key}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer break-keep-ko tracking-ko-normal font-pretendard"
                >
                  {label}
                </label>
                <p className="text-sm text-gray-600 break-keep-ko tracking-ko-normal font-pretendard">
                  {description}
                </p>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <button
              id={`toggle-${key}`}
              type="button"
              role="switch"
              aria-checked={preferences[key]}
              aria-label={`${label} 알림 ${preferences[key] ? '켜기' : '끄기'}`}
              disabled={loading}
              onClick={() => handleToggle(key)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${preferences[key] 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-200 hover:bg-gray-300'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${preferences[key] ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 break-keep-ko tracking-ko-normal font-pretendard">
        <p>
          알림 설정은 실시간으로 저장되며, 언제든지 변경할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default NotificationSettings;