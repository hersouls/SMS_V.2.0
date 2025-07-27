import React from 'react';
import { ExternalLink, Play, Pause, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../ui';
import type { Subscription } from '../../../types/database.types';
import { cn } from '../../../lib/utils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onToggleStatus?: (id: string, currentStatus: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onToggleStatus,
  onDelete,
  className
}) => {
  const navigate = useNavigate();
  const formatCurrency = (amount: number, currency: 'KRW' | 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-3 h-3" />;
      case 'paused':
        return <Pause className="w-3 h-3" />;
      case 'canceled':
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleServiceClick = () => {
    if (subscription.service_url) {
      window.open(subscription.service_url, '_blank');
    }
  };

  const handleCardClick = () => {
    // Navigate to subscription detail page
    navigate(`/subscriptions/${subscription.id}`);
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleStatus) {
      onToggleStatus(subscription.id, subscription.status);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(subscription.id);
    }
  };

  return (
    <Card 
      className={cn(
        'hover:shadow-lg transition-all duration-200 cursor-pointer group',
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Service Info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Logo/Image */}
            <div 
              className="relative w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={handleServiceClick}
            >
              {subscription.imageUrl ? (
                <img 
                  src={subscription.imageUrl} 
                  alt={subscription.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center ${subscription.service_image_url ? 'hidden' : ''}`}>
                <span className="text-white font-bold text-lg font-pretendard">
                  {subscription.service_name.charAt(0).toUpperCase()}
                </span>
              </div>
              {subscription.service_url && (
                <ExternalLink className="absolute -top-1 -right-1 w-4 h-4 text-white bg-blue-600 rounded-full p-0.5" />
              )}
            </div>

            {/* Service Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate break-keep-ko tracking-ko-normal font-pretendard">
                {subscription.service_name}
              </h3>
              <p className="text-sm text-gray-500 break-keep-ko tracking-ko-normal font-pretendard">
                {subscription.payment_cycle} • {formatCurrency(subscription.amount, subscription.currency)}
              </p>
              {subscription.category && (
                <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full break-keep-ko tracking-ko-normal font-pretendard">
                  {subscription.category}
                </span>
              )}
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border font-pretendard tracking-ko-normal',
              getStatusColor(subscription.status)
            )}>
              {getStatusIcon(subscription.status)}
              <span className="capitalize break-keep-ko">
                {subscription.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleStatus}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title={subscription.status === 'active' ? 'Pause' : 'Activate'}
              >
                {subscription.status === 'active' ? (
                  <Pause className="w-5 h-5 text-gray-600" />
                ) : (
                  <Play className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 break-keep-ko tracking-ko-normal font-pretendard">
              Payment day:
            </span>
            <span className="font-medium text-gray-900 font-pretendard tracking-ko-normal">
              {subscription.payment_day ? `Day ${subscription.payment_day}` : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500 break-keep-ko tracking-ko-normal font-pretendard">
              Monthly cost:
            </span>
            <span className="font-semibold text-lg text-gray-900 font-pretendard tracking-ko-normal">
              {formatCurrency(subscription.amount, subscription.currency)}
            </span>
          </div>
          {subscription.memo && (
            <div className="mt-2 text-xs text-gray-500 break-keep-ko tracking-ko-normal font-pretendard">
              {subscription.memo}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionCard;