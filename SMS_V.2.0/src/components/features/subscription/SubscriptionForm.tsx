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
    next_payment_date: subscription?.next_payment_date ? 
      new Date(subscription.next_payment_date).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    service_url: subscription?.service_url || '',
    logo_url: subscription?.logo_url || '',
    category: subscription?.category || '',
    status: subscription?.status || 'active'
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

    if (!formData.next_payment_date) {
      newErrors.next_payment_date = 'Next payment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SubscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('service-logos')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('service-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, logo: 'Please select an image file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'File size must be less than 5MB' }));
        return;
      }

      setImageFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let logoUrl = formData.logo_url;

      // Upload image if new file selected
      if (imageFile) {
        logoUrl = await handleImageUpload(imageFile);
      }

      const result = await onSubmit({
        ...formData,
        logo_url: logoUrl
      });

      if (result.success) {
        onClose();
        resetForm();
      } else {
        setErrors(prev => ({ ...prev, general: result.error || 'Failed to save subscription' }));
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: error instanceof Error ? error.message : 'An error occurred' }));
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
      next_payment_date: new Date().toISOString().split('T')[0],
      service_url: '',
      logo_url: '',
      category: '',
      status: 'active'
    });
    setErrors({});
    setImageFile(null);
    setImagePreview('');
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
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Cycle and Next Payment Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko">
              Payment Cycle
            </label>
            <select
              value={formData.payment_cycle}
              onChange={(e) => handleInputChange('payment_cycle', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paymentCycles.map(cycle => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Next Payment Date"
            type="date"
            value={formData.next_payment_date}
            onChange={(e) => handleInputChange('next_payment_date', e.target.value)}
            error={errors.next_payment_date}
            required
          />
        </div>

        {/* Service URL */}
        <Input
          label="Service URL (Optional)"
          type="url"
          value={formData.service_url}
          onChange={(e) => handleInputChange('service_url', e.target.value)}
          placeholder="https://example.com"
        />

        {/* Category and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2 break-keep-ko">
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
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
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
            <p className="mt-1 text-sm text-red-600 break-keep-ko">{errors.logo}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg break-keep-ko">
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