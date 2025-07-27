import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Modal } from '../../ui';
import { Button } from '../../ui';
import { Input } from '../../ui';
import { supabase } from '../../../lib/supabase';
import type { Subscription, SubscriptionFormData } from '../../../types/database.types';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => Promise<{ success: boolean; error?: string }>;
  subscription?: Subscription | null;
  title?: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subscription,
  title = 'Add Subscription'
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    service_name: subscription?.service_name || '',
    amount: subscription?.amount || 0,
    currency: subscription?.currency || 'KRW',
    payment_cycle: subscription?.payment_cycle || 'monthly',
    payment_day: subscription?.payment_day || 1,
    service_url: subscription?.service_url || '',
    service_image_url: subscription?.service_image_url || '',
    category: subscription?.category || '',
    status: subscription?.status || 'active',
    payment_method: subscription?.payment_method || '',
    start_date: subscription?.start_date ? 
      new Date(subscription.start_date).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    auto_renewal: subscription?.auto_renewal ?? true,
    memo: subscription?.memo || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(subscription?.logo_url || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Streaming',
    'Music',
    'Software',
    'Gaming',
    'Education',
    'Productivity',
    'Entertainment',
    'Other'
  ];

  const paymentCycles = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const currencies = [
    { value: 'KRW', label: 'KRW (₩)' },
    { value: 'USD', label: 'USD ($)' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'canceled', label: 'Canceled' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_name.trim()) {
      newErrors.service_name = 'Service name is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (formData.payment_day && (formData.payment_day < 1 || formData.payment_day > 31)) {
      newErrors.payment_day = 'Payment day must be between 1 and 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SubscriptionFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `subscription-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (imageFile) {
        const logoUrl = await handleImageUpload(imageFile);
        formData.service_image_url = logoUrl;
      }

      const result = await onSubmit({
        ...formData,
      });

      if (result.success) {
        resetForm();
        onClose();
      } else {
        setErrors({ general: result.error || 'Failed to save subscription' });
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      service_name: '',
      amount: 0,
      currency: 'KRW',
      payment_cycle: 'monthly',
      payment_day: 1,
      service_url: '',
      service_image_url: '',
      category: '',
      status: 'active',
      payment_method: '',
      start_date: new Date().toISOString().split('T')[0],
      auto_renewal: true,
      memo: ''
    });
    setErrors({});
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Name */}
        <Input
          label="Service Name"
          value={formData.service_name}
          onChange={(e) => handleInputChange('service_name', e.target.value)}
          placeholder="Enter service name"
          error={errors.service_name}
          required
        />

        {/* Amount and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            error={errors.amount}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Cycle and Payment Day */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
              Payment Cycle
            </label>
            <select
              value={formData.payment_cycle}
              onChange={(e) => handleInputChange('payment_cycle', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            >
              {paymentCycles.map(cycle => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Payment Day (1-31)"
            type="number"
            min="1"
            max="31"
            value={formData.payment_day || ''}
            onChange={(e) => handleInputChange('payment_day', parseInt(e.target.value) || 1)}
            placeholder="15"
            error={errors.payment_day}
            required
          />
        </div>

        {/* Service URL and Start Date */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Service URL (Optional)"
            type="url"
            value={formData.service_url}
            onChange={(e) => handleInputChange('service_url', e.target.value)}
            placeholder="https://example.com"
          />
          <Input
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
          />
        </div>

        {/* Payment Method and Auto Renewal */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Payment Method (Optional)"
            value={formData.payment_method}
            onChange={(e) => handleInputChange('payment_method', e.target.value)}
            placeholder="Credit Card, PayPal, etc."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
              Auto Renewal
            </label>
            <select
              value={formData.auto_renewal ? 'true' : 'false'}

            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {/* Memo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
            Memo (Optional)
          </label>
          <textarea
            value={formData.memo}
            onChange={(e) => handleInputChange('memo', e.target.value)}
            placeholder="Add any notes about this subscription..."
            className="w-full h-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-pretendard tracking-ko-normal"
          />
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-pretendard tracking-ko-normal"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko tracking-ko-normal font-pretendard">
            Service Logo (Optional)
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('');
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-pretendard tracking-ko-normal"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm break-keep-ko">Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {errors.logo && (
            <p className="mt-1 text-sm text-red-600 break-keep-ko tracking-ko-normal font-pretendard">{errors.logo}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg break-keep-ko tracking-ko-normal font-pretendard">
            {errors.general}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {subscription ? 'Update' : 'Add'} Subscription
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubscriptionForm;