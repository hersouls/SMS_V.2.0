import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Subscription, SubscriptionFormData } from '../types/database.types';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSubscriptions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new subscription
  const addSubscription = async (subscriptionData: SubscriptionFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionData,
          user_id: user.id,
          status: subscriptionData.status || 'active'
        });

      if (insertError) {
        throw insertError;
      }

      // Refresh the list
      await fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update subscription
  const updateSubscription = async (id: string, updates: Partial<SubscriptionFormData>): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the list
      await fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Delete subscription
  const deleteSubscription = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh the list
      await fetchSubscriptions();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Toggle subscription status
  const toggleSubscriptionStatus = async (id: string, currentStatus: string): Promise<{ success: boolean; error?: string }> => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    return updateSubscription(id, { status: newStatus as 'active' | 'paused' | 'canceled' });
  };

  // Get subscription by ID
  const getSubscriptionById = (id: string): Subscription | undefined => {
    return subscriptions.find(sub => sub.id === id);
  };

  // Get subscriptions by status
  const getSubscriptionsByStatus = (status: 'active' | 'paused' | 'canceled'): Subscription[] => {
    return subscriptions.filter(sub => sub.status === status);
  };

  // Get total cost by currency
  const getTotalCostByCurrency = (currency: 'KRW' | 'USD'): number => {
    return subscriptions
      .filter(sub => sub.currency === currency && sub.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0);
  };

  // Real-time subscription
  useEffect(() => {
    const setupSubscription = async () => {
      await fetchSubscriptions();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('subscriptions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscriptions',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchSubscriptions();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupSubscription();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    getSubscriptionById,
    getSubscriptionsByStatus,
    getTotalCostByCurrency
  };
};