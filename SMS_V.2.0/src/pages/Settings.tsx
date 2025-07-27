import React, { useState } from 'react';
import { ArrowLeftIcon, UserIcon, BellIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ExchangeRateDisplay } from '../components/features/ExchangeRateDisplay';
import { ExchangeRateModal } from '../components/features/ExchangeRateModal';
import { useAuth } from '../contexts/AuthContext';
import { useExchangeRate } from '../hooks/useExchangeRate';

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { rate, getFormattedLastUpdated } = useExchangeRate();
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState({
    paymentReminder: true,
    priceChange: true,
    subscriptionExpiry: true,
    emailNotifications: false,
    pushNotifications: true
  });

  // 알림 설정 토글
  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 계정 삭제 처리
  const handleDeleteAccount = async () => {
    // 실제 구현에서는 사용자 확인 후 계정 삭제 로직 실행
    console.log('계정 삭제 요청');
    setIsDeleteModalOpen(false);
  };

  // 가입일 포맷팅
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-pretendard">뒤로가기</span>
          </button>
          
          <div className="flex items-center gap-3">
            <UserIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold font-pretendard text-gray-900 tracking-ko-tight">
              설정
            </h1>
          </div>
          <p className="text-gray-600 font-pretendard tracking-ko-normal mt-2">
            계정 설정과 알림을 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 설정 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로필 섹션 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold font-pretendard text-gray-900">
                  프로필
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 font-pretendard">이메일</p>
                    <p className="font-medium text-gray-900 font-pretendard">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500 font-pretendard">가입일</p>
                    <p className="font-medium text-gray-900 font-pretendard">
                      {user?.created_at ? formatJoinDate(user.created_at) : '알 수 없음'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-gray-500 font-pretendard">계정 상태</p>
                    <p className="font-medium text-green-600 font-pretendard">
                      활성
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 알림 설정 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold font-pretendard text-gray-900">
                  알림 설정
                </h2>
              </div>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900 font-pretendard">
                        {key === 'paymentReminder' && '결제 예정 알림'}
                        {key === 'priceChange' && '가격 변동 알림'}
                        {key === 'subscriptionExpiry' && '구독 만료 알림'}
                        {key === 'emailNotifications' && '이메일 알림'}
                        {key === 'pushNotifications' && '푸시 알림'}
                      </p>
                      <p className="text-sm text-gray-500 font-pretendard">
                        {key === 'paymentReminder' && '결제일 3일 전 알림'}
                        {key === 'priceChange' && '구독료 변경 시 알림'}
                        {key === 'subscriptionExpiry' && '구독 만료 7일 전 알림'}
                        {key === 'emailNotifications' && '이메일로 알림 받기'}
                        {key === 'pushNotifications' && '브라우저 푸시 알림'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleNotification(key as keyof typeof notificationSettings)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        value ? "bg-blue-600" : "bg-gray-200"
                      )}
                      role="switch"
                      aria-checked={value}
                      aria-label={`${key} 알림 ${value ? '비활성화' : '활성화'}`}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
                          value ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 환율 설정 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  환율 설정
                </h3>
              </div>
              
              <ExchangeRateDisplay
                onEditClick={() => setIsExchangeRateModalOpen(true)}
                showRefreshButton={true}
              />
            </div>

            {/* 계정 관리 */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  계정 관리
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 font-pretendard text-sm"
                >
                  로그아웃
                </button>
                
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 font-pretendard text-sm"
                >
                  계정 삭제
                </button>
              </div>
            </div>

            {/* 빠른 액션 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold font-pretendard mb-3">
                빠른 액션
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/subscriptions')}
                  className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm"
                >
                  구독 관리
                </button>
                <button 
                  onClick={() => navigate('/calendar')}
                  className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm"
                >
                  캘린더 보기
                </button>
                <button className="w-full py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200 font-pretendard text-sm">
                  데이터 내보내기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 모달들 */}
        <ExchangeRateModal
          isOpen={isExchangeRateModalOpen}
          onClose={() => setIsExchangeRateModalOpen(false)}
        />

        {/* 로그아웃 확인 모달 */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold font-pretendard text-gray-900 mb-4">
                로그아웃
              </h3>
              <p className="text-gray-600 font-pretendard mb-6">
                정말 로그아웃하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-pretendard"
                >
                  로그아웃
                </button>
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-pretendard"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 계정 삭제 확인 모달 */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold font-pretendard text-gray-900">
                  계정 삭제
                </h3>
              </div>
              <p className="text-gray-600 font-pretendard mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
              <p className="text-sm text-red-600 font-pretendard mb-6">
                정말 계정을 삭제하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-pretendard"
                >
                  계정 삭제
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-pretendard"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}