import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { Subscription, SubscriptionFormData } from '../../../types/database.types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
  subscription?: Subscription;
  title?: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  title = '구독 추가'
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    service_name: '',
    service_url: '',
    amount: 0,
    currency: 'KRW',
    payment_cycle: 'monthly',
    payment_day: 1,
    start_date: new Date().toISOString().split('T')[0],
    auto_renewal: true,
    status: 'active',
    memo: '',
    service_image_url: '',
    payment_method: '',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        service_name: subscription.service_name,
        service_url: subscription.service_url || '',
        amount: subscription.amount,
        currency: subscription.currency,
        payment_cycle: subscription.payment_cycle,
        payment_day: subscription.payment_day,
        start_date: subscription.start_date,
        auto_renewal: subscription.auto_renewal,
        status: subscription.status,
        memo: subscription.memo || '',
        service_image_url: subscription.service_image_url || '',
        payment_method: subscription.payment_method || '',
        category: subscription.category || ''
      });
    } else {
      setFormData({
        service_name: '',
        service_url: '',
        amount: 0,
        currency: 'KRW',
        payment_cycle: 'monthly',
        payment_day: 1,
        start_date: new Date().toISOString().split('T')[0],
        auto_renewal: true,
        status: 'active',
        memo: '',
        service_image_url: '',
        payment_method: '',
        category: ''
      });
    }
    setErrors({});
  }, [subscription, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_name.trim()) {
      newErrors.service_name = '서비스명을 입력해주세요';
    }

    if (formData.amount <= 0) {
      newErrors.amount = '금액을 입력해주세요';
    }

    if (formData.payment_day && (formData.payment_day < 1 || formData.payment_day > 31)) {
      newErrors.payment_day = '결제일은 1-31 사이의 숫자여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof SubscriptionFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 @sm:p-6 border-b">
          <h2 className="text-lg @sm:text-xl @lg:text-2xl font-semibold font-pretendard tracking-ko-normal">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 @sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 @sm:w-5 @sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 @sm:p-6 space-y-4 @sm:space-y-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm @sm:text-base font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              서비스명 *
            </label>
            <input
              type="text"
              value={formData.service_name}
              onChange={(e) => handleInputChange('service_name', e.target.value)}
              className={cn(
                "w-full px-3 py-2 @sm:px-4 @sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal text-sm @sm:text-base",
                errors.service_name ? "border-red-500" : "border-gray-300"
              )}
              placeholder="서비스명을 입력하세요"
            />
            {errors.service_name && (
              <p className="text-red-500 text-xs @sm:text-sm mt-1 font-pretendard tracking-ko-normal">
                {errors.service_name}
              </p>
            )}
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-3 @sm:gap-4">
            <div>
              <label className="block text-sm @sm:text-base font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
                금액 *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={cn(
                  "w-full px-3 py-2 @sm:px-4 @sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal text-sm @sm:text-base",
                  errors.amount ? "border-red-500" : "border-gray-300"
                )}
                placeholder="0"
              />
              {errors.amount && (
                <p className="text-red-500 text-xs @sm:text-sm mt-1 font-pretendard tracking-ko-normal">
                  {errors.amount}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm @sm:text-base font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
                통화
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 @sm:px-4 @sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal text-sm @sm:text-base"
              >
                <option value="KRW">KRW</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Payment Cycle */}
          <div>
            <label className="block text-sm @sm:text-base font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              결제 주기
            </label>
            <select
              value={formData.payment_cycle}
              onChange={(e) => handleInputChange('payment_cycle', e.target.value)}
              className="w-full px-3 py-2 @sm:px-4 @sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal text-sm @sm:text-base"
            >
              <option value="monthly">월간</option>
              <option value="yearly">연간</option>
              <option value="quarterly">분기</option>
              <option value="weekly">주간</option>
            </select>
          </div>

          {/* Payment Day */}
          <div>
            <label className="block text-sm @sm:text-base font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              결제일
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={formData.payment_day || ''}
              onChange={(e) => handleInputChange('payment_day', parseInt(e.target.value) || 1)}
              className={cn(
                "w-full px-3 py-2 @sm:px-4 @sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal text-sm @sm:text-base",
                errors.payment_day ? "border-red-500" : "border-gray-300"
              )}
              placeholder="1-31"
            />
            {errors.payment_day && (
              <p className="text-red-500 text-xs @sm:text-sm mt-1 font-pretendard tracking-ko-normal">
                {errors.payment_day}
              </p>
            )}
          </div>

          {/* Service URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              서비스 URL
            </label>
            <input
              type="url"
              value={formData.service_url}
              onChange={(e) => handleInputChange('service_url', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
              placeholder="https://example.com"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              시작일
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              결제 방법
            </label>
            <input
              type="text"
              value={formData.payment_method}
              onChange={(e) => handleInputChange('payment_method', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
              placeholder="신용카드, 계좌이체 등"
            />
          </div>

          {/* Auto Renewal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              자동 갱신
            </label>
            <select
              value={formData.auto_renewal ? 'true' : 'false'}
              onChange={(e) => handleInputChange('auto_renewal', e.target.value === 'true')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            >
              <option value="true">ON</option>
              <option value="false">OFF</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              카테고리
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
              placeholder="엔터테인먼트, 생산성 등"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-pretendard tracking-ko-normal">
              메모
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
              placeholder="추가 정보를 입력하세요"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-pretendard tracking-ko-normal"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-pretendard tracking-ko-normal"
            >
              {subscription ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionModal;