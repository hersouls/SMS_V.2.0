import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, TrendingUp, CreditCard, Users, DollarSign, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui';
import { ExchangeRateDisplay } from '../components/features/ExchangeRateDisplay';
import { ExchangeRateModal } from '../components/features/ExchangeRateModal';
import { supabase } from '../lib/supabase';
import type { Subscription, DashboardStats } from '../types/database.types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubscriptions: 0,
    monthlyCost: 0,
    averageCost: 0,
    activeCount: 0,
    totalCostKRW: 0,
    totalCostUSD: 0
  });
  const [, setExchangeRate] = useState<number>(1300);
  const [activeSubscriptions, setActiveSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user's subscriptions (all statuses)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, redirecting to login...');
        return;
      }

      console.log('Fetching data for user:', user.email);

      // Fetch all subscriptions for the user
      const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (subError) {
        console.error('Error fetching subscriptions:', subError);
      } else {
        console.log('Fetched subscriptions:', subscriptions?.length || 0);
      }

      // Fetch exchange rate
      const { data: rateData, error: rateError } = await supabase
        .from('exchange_rates')
        .select('usd_krw')
        .eq('user_id', user.id)
        .single();

      if (rateError && rateError.code !== 'PGRST116') {
        console.error('Error fetching exchange rate:', rateError);
      }

      const currentRate = rateData?.usd_krw || 1300;
      setExchangeRate(currentRate);

      if (subscriptions) {
        const activeSubs = subscriptions.filter(sub => sub.status === 'active');
        setActiveSubscriptions(activeSubs.slice(0, 5));
        calculateStats(subscriptions, currentRate);
      } else {
        setActiveSubscriptions([]);
        calculateStats([], currentRate);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const calculateStats = (subscriptions: Subscription[], rate: number) => {
    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    const activeCount = activeSubscriptions.length;

    let totalCostKRW = 0;
    let totalCostUSD = 0;

    subscriptions.forEach(sub => {
      if (sub.currency === 'KRW') {
        totalCostKRW += sub.amount;
      } else {
        totalCostUSD += sub.amount;
      }
    });

    const totalCostInKRW = totalCostKRW + (totalCostUSD * rate);
    const monthlyCost = totalCostInKRW;
    const averageCost = totalSubscriptions > 0 ? totalCostInKRW / totalSubscriptions : 0;

    setStats({
      totalSubscriptions,
      monthlyCost,
      averageCost,
      activeCount,
      totalCostKRW,
      totalCostUSD
    });
  };

  const formatCurrency = (amount: number, currency: 'KRW' | 'USD' = 'KRW') => {
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

  const statsCards = [
    {
      title: 'Total Subscriptions',
      value: stats.totalSubscriptions,
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Cost',
      value: formatCurrency(stats.monthlyCost),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Cost',
      value: formatCurrency(stats.averageCost),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Services',
      value: stats.activeCount,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Exchange Rate and Subscriptions Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-12"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3">
                      <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 break-keep-ko">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 break-keep-ko">
          Welcome back! Here's an overview of your subscriptions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 break-keep-ko">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor} dark:bg-opacity-20`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Exchange Rate and Active Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exchange Rate */}
        <div className="lg:col-span-1">
          <ExchangeRateDisplay
            onEditClick={() => setIsExchangeRateModalOpen(true)}
            showRefreshButton={true}
          />
        </div>

        {/* Active Subscriptions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 break-keep-ko">
                  No active subscriptions found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 break-keep-ko">
                  Add your first subscription to start managing your services.
                </p>
                <Button
                  onClick={() => window.location.href = '/subscriptions'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200 dark:border-gray-700"
                    onClick={() => window.location.href = `/subscriptions`}
                  >
                    <div className="p-4">
                      {/* Service Logo and Name */}
                      <div className="flex items-center gap-3 mb-3">
                        {subscription.service_image_url ? (
                          <img 
                            src={subscription.service_image_url} 
                            alt={subscription.service_name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const nextSibling = target.nextElementSibling as HTMLElement;
                              if (nextSibling) {
                                nextSibling.style.display = 'flex';
                              }
                              target.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-sm ${subscription.service_image_url ? 'hidden' : ''}`}>
                          <span className="text-white font-bold text-sm">
                            {subscription.service_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate break-keep-ko">
                            {subscription.service_name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price and Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400 break-keep-ko">
                            {subscription.payment_cycle}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(subscription.amount, subscription.currency)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span className="break-keep-ko">
                            {subscription.category || 'Uncategorized'}
                          </span>
                          <span className="break-keep-ko">
                            {subscription.payment_day ? `Day ${subscription.payment_day}` : 'No date'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button 
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/subscriptions`;
                          }}
                        >
                          Manage
                        </button>
                        <button 
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement cancel subscription
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mini Calendar */}
      <Card className="mt-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 break-keep-ko">
              Calendar view coming soon...
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate Modal */}
      <ExchangeRateModal
        isOpen={isExchangeRateModalOpen}
        onClose={() => setIsExchangeRateModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;