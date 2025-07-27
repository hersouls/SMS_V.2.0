import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, TrendingUp, CreditCard, Users, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui';
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

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = useCallback(async () => {
    try {
      // Fetch user's subscriptions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      // Fetch exchange rate
      const { data: rateData } = await supabase
        .from('exchange_rates')
        .select('usd_krw')
        .eq('user_id', user.id)
        .single();

      if (rateData) {
        setExchangeRate(rateData.usd_krw);
      }

      if (subscriptions) {
        setActiveSubscriptions(subscriptions.slice(0, 5));
        calculateStats(subscriptions, rateData?.usd_krw || 1300);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

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
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 break-keep-ko">
          Dashboard
        </h1>
        <p className="text-gray-600 break-keep-ko">
          Welcome back! Here's an overview of your subscriptions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 break-keep-ko">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
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
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 break-keep-ko">
                  No active subscriptions yet.
                </p>
                <p className="text-sm text-gray-400 mt-1 break-keep-ko">
                  Add your first subscription to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {subscription.service_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 break-keep-ko">
                          {subscription.service_name}
                        </h3>
                        <p className="text-sm text-gray-500 break-keep-ko">
                          {subscription.payment_cycle} • {formatCurrency(subscription.amount, subscription.currency)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(subscription.amount, subscription.currency)}
                      </p>
                      <p className="text-xs text-gray-500 break-keep-ko">
                        Next: {new Date(subscription.next_payment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mini Calendar */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 break-keep-ko">
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