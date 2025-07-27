import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Calendar,
  CreditCard,
  Bell,
  Tag,
  FileText,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSubscriptions } from '../hooks/useSubscriptions';
import Typography from '../components/ui/Typography';

import DeleteConfirmationModal from '../components/features/subscription/DeleteConfirmationModal';

const SubscriptionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscriptions, deleteSubscription, loading } = useSubscriptions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const subscription = subscriptions.find(sub => sub.id === id);

  useEffect(() => {
    if (!loading && !subscription) {
      navigate('/subscriptions');
    }
  }, [subscription, loading, navigate]);

  const handleDelete = async () => {
    if (subscription) {
      await deleteSubscription(subscription.id);
      navigate('/subscriptions');
    }
  };

  const handleEdit = () => {
    navigate(`/subscriptions/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/subscriptions');
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `₩${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
      case 'cancelled':
        return 'bg-red-100 text-red-800 ring-red-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-gray-600/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'paused':
        return '일시정지';
      case 'cancelled':
        return '해지';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Typography.H2 className="text-gray-900 mb-4">구독을 찾을 수 없습니다</Typography.H2>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              뒤로가기
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className={cn(
                  "font-pretendard font-semibold rounded-lg px-4 py-2",
                  "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "tracking-ko-normal break-keep-ko antialiased",
                  "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
                  "flex items-center"
                )}
              >
                <Edit className="w-4 h-4 mr-2" />
                수정
              </button>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                className={cn(
                  "font-pretendard font-semibold rounded-lg px-4 py-2",
                  "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  "tracking-ko-normal break-keep-ko antialiased",
                  "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
                  "flex items-center"
                )}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Service Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                {(subscription.service_image_url || subscription.logo_url) && (
                  <img
                    src={subscription.service_image_url || subscription.logo_url}
                    alt={subscription.service_name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div>
                  <Typography.H1 className="text-gray-900">
                    {subscription.service_name}
                  </Typography.H1>
                  {subscription.service_url && (
                    <div className="flex items-center mt-2">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      <a
                        href={subscription.service_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                      >
                        {subscription.service_url}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <span className={cn(
                "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                getStatusColor(subscription.status)
              )}>
                {getStatusText(subscription.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  결제 정보
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">금액:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">주기:</span>
                  <span className="font-semibold text-gray-900">
                    {subscription.payment_cycle === 'monthly' ? '월간' : 
                     subscription.payment_cycle === 'yearly' ? '연간' : '일회성'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">결제일:</span>
                  <span className="font-semibold text-gray-900">
                    매월 {subscription.payment_day || 1}일
                  </span>
                </div>
                
                {subscription.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">결제수단:</span>
                    <span className="font-semibold text-gray-900">
                      {subscription.payment_method}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-green-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  구독 정보
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">시작일:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(subscription.start_date || new Date().toISOString().split('T')[0])}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">다음 결제:</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(subscription.next_payment_date || new Date().toISOString().split('T')[0])}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">자동갱신:</span>
                  <span className="font-semibold text-gray-900">
                    {subscription.auto_renewal ? 'ON' : 'OFF'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">상태:</span>
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    getStatusColor(subscription.status)
                  )}>
                    {getStatusText(subscription.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {(subscription.category || (subscription.tags && subscription.tags.length > 0)) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center mb-4">
                <Tag className="w-5 h-5 text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  카테고리
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {subscription.category && (
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    {subscription.category}
                  </span>
                )}
                {subscription.tags && subscription.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-sm font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notification Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                알림 설정
              </h2>
            </div>
            
                            <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">
                      결제 7일 전 알림
                    </span>
                    <span className="font-semibold text-gray-900">
                      {subscription.alarm_days?.includes(7) ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">
                      결제 3일 전 알림
                    </span>
                    <span className="font-semibold text-gray-900">
                      {subscription.alarm_days?.includes(3) ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-pretendard tracking-ko-normal break-keep-ko">
                      결제 당일 알림
                    </span>
                    <span className="font-semibold text-gray-900">
                      {subscription.alarm_days?.includes(0) ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
          </div>

          {/* Notes */}
          {subscription.memo && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  메모
                </h2>
              </div>
              
              <p className="text-gray-700 font-pretendard tracking-ko-normal break-keep-ko leading-relaxed">
                {subscription.memo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        subscriptionName={subscription.service_name}
      />
    </div>
  );
};

export default SubscriptionDetail;