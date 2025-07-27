import React, { useState, useEffect } from 'react';
import { X, Plus, X as XIcon } from 'lucide-react';
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
    name: '',
    url: '',
    price: 0,
    currency: 'KRW',
    billingCycle: 'monthly',
    billingDay: 1,
    startDate: new Date().toISOString().split('T')[0],
    autoRenew: true,
    status: 'active',
    categories: [],
    notifications: {
      sevenDaysBefore: false,
      threeDaysBefore: true,
      onBillingDay: true
    },
    notes: '',
    imageUrl: '',
    paymentMethod: '',
    tier: ''
  });

  const [newCategory, setNewCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        url: subscription.url || '',
        price: subscription.price,
        currency: subscription.currency,
        billingCycle: subscription.billingCycle,
        billingDay: subscription.billingDay,
        startDate: subscription.startDate,
        autoRenew: subscription.autoRenew,
        status: subscription.status,
        categories: subscription.categories || [],
        notifications: subscription.notifications || {
          sevenDaysBefore: false,
          threeDaysBefore: true,
          onBillingDay: true
        },
        notes: subscription.notes || '',
        imageUrl: subscription.imageUrl || '',
        paymentMethod: subscription.paymentMethod || '',
        tier: subscription.tier || ''
      });
    } else {
      setFormData({
        name: '',
        url: '',
        price: 0,
        currency: 'KRW',
        billingCycle: 'monthly',
        billingDay: 1,
        startDate: new Date().toISOString().split('T')[0],
        autoRenew: true,
        status: 'active',
        categories: [],
        notifications: {
          sevenDaysBefore: false,
          threeDaysBefore: true,
          onBillingDay: true
        },
        notes: '',
        imageUrl: '',
        paymentMethod: '',
        tier: ''
      });
    }
    setErrors({});
  }, [subscription, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '서비스명을 입력해주세요';
    }

    if (formData.price <= 0) {
      newErrors.price = '가격을 입력해주세요';
    }

    if (formData.billingDay < 1 || formData.billingDay > 31) {
      newErrors.billingDay = '1-31 사이의 숫자를 입력해주세요';
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

  const handleInputChange = (field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
      handleInputChange('categories', [...formData.categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    handleInputChange('categories', formData.categories.filter(c => c !== category));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          {/* Header */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">닫기</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <form onSubmit={handleSubmit} className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="space-y-6">
              {/* Service Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-2">
                  서비스 이미지
                </label>
                <div className="flex items-center space-x-4">
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Service"
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="이미지 URL을 입력하세요"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        "font-pretendard tracking-ko-normal",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "border-gray-300"
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  기본 정보
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                    서비스명 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      "font-pretendard tracking-ko-normal",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      errors.name ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="서비스명을 입력하세요"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                    서비스 URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      "font-pretendard tracking-ko-normal",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "border-gray-300"
                    )}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      카테고리
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={cn(
                          "flex-1 px-3 py-2 border rounded-md",
                          "font-pretendard tracking-ko-normal",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          "border-gray-300"
                        )}
                        placeholder="카테고리 추가"
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className={cn(
                          "font-pretendard font-semibold rounded-lg px-3 py-2",
                          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                          "tracking-ko-normal break-keep-ko antialiased",
                          "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500"
                        )}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {formData.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={() => removeCategory(category)}
                              className="ml-1 text-blue-400 hover:text-blue-600"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  결제 정보
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      금액 *
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className={cn(
                          "flex-1 px-3 py-2 border rounded-l-md",
                          "font-pretendard tracking-ko-normal",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          errors.price ? "border-red-300" : "border-gray-300"
                        )}
                        placeholder="0"
                        min="0"
                        step="0.01"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className={cn(
                          "px-3 py-2 border border-l-0 rounded-r-md",
                          "font-pretendard tracking-ko-normal",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          "border-gray-300 bg-gray-50"
                        )}
                      >
                        <option value="KRW">KRW</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      결제주기 *
                    </label>
                    <div className="space-y-2">
                      {['monthly', 'yearly', 'one-time'].map((cycle) => (
                        <label key={cycle} className="flex items-center">
                          <input
                            type="radio"
                            name="billingCycle"
                            value={cycle}
                            checked={formData.billingCycle === cycle}
                            onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700 font-pretendard tracking-ko-normal break-keep-ko">
                            {cycle === 'monthly' ? '월간' : cycle === 'yearly' ? '연간' : '일회성'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      결제일 *
                    </label>
                    <input
                      type="number"
                      value={formData.billingDay}
                      onChange={(e) => handleInputChange('billingDay', parseInt(e.target.value) || 1)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        "font-pretendard tracking-ko-normal",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        errors.billingDay ? "border-red-300" : "border-gray-300"
                      )}
                      placeholder="1-31"
                      min="1"
                      max="31"
                    />
                    {errors.billingDay && (
                      <p className="text-sm text-red-600 mt-1">{errors.billingDay}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                    결제수단
                  </label>
                  <input
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      "font-pretendard tracking-ko-normal",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "border-gray-300"
                    )}
                    placeholder="신용카드, 계좌이체 등"
                  />
                </div>
              </div>

              {/* Subscription Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  구독 정보
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      시작일 *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        "font-pretendard tracking-ko-normal",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "border-gray-300"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                      상태
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md",
                        "font-pretendard tracking-ko-normal",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "border-gray-300"
                      )}
                    >
                      <option value="active">활성</option>
                      <option value="paused">일시정지</option>
                      <option value="cancelled">해지</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoRenew" className="ml-2 text-sm text-gray-700 font-pretendard tracking-ko-normal break-keep-ko">
                    자동갱신
                  </label>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  알림 설정
                </h4>
                
                <div className="space-y-3">
                  {[
                    { key: 'sevenDaysBefore', label: '결제 7일 전' },
                    { key: 'threeDaysBefore', label: '결제 3일 전' },
                    { key: 'onBillingDay', label: '결제 당일' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={formData.notifications[key as keyof typeof formData.notifications]}
                        onChange={(e) => handleInputChange('notifications', {
                          ...formData.notifications,
                          [key]: e.target.checked
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={key} className="ml-2 text-sm text-gray-700 font-pretendard tracking-ko-normal break-keep-ko">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 font-pretendard tracking-ko-tight break-keep-ko">
                  추가 정보
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                    티어/등급
                  </label>
                  <input
                    type="text"
                    value={formData.tier}
                    onChange={(e) => handleInputChange('tier', e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      "font-pretendard tracking-ko-normal",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "border-gray-300"
                    )}
                    placeholder="Basic, Pro, Premium 등"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 font-pretendard tracking-ko-normal break-keep-ko mb-1">
                    메모
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md",
                      "font-pretendard tracking-ko-normal",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "border-gray-300"
                    )}
                    placeholder="이 구독에 대한 메모를 입력하세요..."
                  />
                </div>
              </div>
            </div>
          </form>
          
          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleSubmit}
              className={cn(
                "font-pretendard font-semibold rounded-lg px-4 py-2",
                "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "tracking-ko-normal break-keep-ko antialiased",
                "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500",
                "inline-flex w-full justify-center sm:ml-3 sm:w-auto"
              )}
            >
              {subscription ? '업데이트' : '추가'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "font-pretendard font-semibold rounded-lg px-4 py-2",
                "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                "tracking-ko-normal break-keep-ko antialiased",
                "bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-gray-500",
                "mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto"
              )}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;