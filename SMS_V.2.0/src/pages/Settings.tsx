import React, { useState, useEffect } from 'react';
import { User, Bell, CreditCard, LogOut, Trash2, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { ExchangeRateModal } from '../components/features/ExchangeRateModal';
import NotificationSettings from '../components/features/settings/NotificationSettings';
import AccountDeletionModal from '../components/features/settings/AccountDeletionModal';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);
  const [isAccountDeletionModalOpen, setIsAccountDeletionModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [joinDate, setJoinDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      setJoinDate(date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      setIsLogoutModalOpen(false);
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 3) return email;
    return `${localPart.substring(0, 3)}***@${domain}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 break-keep-ko">
          설정
        </h1>
        <p className="text-gray-600 break-keep-ko">
          계정 정보와 앱 설정을 관리하세요
        </p>
      </div>

      <div className="grid gap-6 @container">
        {/* Profile Section */}
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-blue-600" />
              프로필 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 break-keep-ko">
                  이메일 주소
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900 font-mono">
                    {user?.email ? formatEmail(user.email) : '로딩 중...'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 break-keep-ko">
                  가입일
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-900">
                    {joinDate || '로딩 중...'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rate Settings */}
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CreditCard className="h-5 w-5 text-green-600" />
              환율 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 break-keep-ko">
                구독료 계산에 사용되는 USD/KRW 환율을 설정하세요.
              </p>
              <Button
                onClick={() => setIsExchangeRateModalOpen(true)}
                variant="primary"
                className="w-full sm:w-auto"
              >
                환율 설정하기
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Bell className="h-5 w-5 text-purple-600" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationSettings />
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Shield className="h-5 w-5 text-orange-600" />
              계정 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                onClick={() => setIsLogoutModalOpen(true)}
                variant="secondary"
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
              
              <Button
                onClick={() => setIsAccountDeletionModalOpen(true)}
                variant="destructive"
                className="w-full justify-start"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                계정 삭제
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 break-keep-ko">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={isExchangeRateModalOpen}
        onClose={() => setIsExchangeRateModalOpen(false)}
      />

      {/* Account Deletion Modal */}
      <AccountDeletionModal
        isOpen={isAccountDeletionModalOpen}
        onClose={() => setIsAccountDeletionModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full backdrop-blur-sm border border-white/20">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <LogOut className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 break-keep-ko">
                로그아웃
              </h3>
              <p className="text-gray-600 break-keep-ko">
                정말로 로그아웃하시겠습니까?
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  onClick={handleLogout}
                  loading={loading}
                  className="flex-1"
                >
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;