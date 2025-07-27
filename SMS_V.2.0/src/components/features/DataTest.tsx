import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui';
import type { Subscription } from '../../types/database.types';

const DataTest: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No user found. Please sign in first.');
        return;
      }

      console.log('Fetching data for user:', user.email);

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      console.log('Fetched subscriptions:', data);
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addTestData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No user found. Please sign in first.');
        return;
      }

      const testSubscription = {
        user_id: user.id,
        service_name: 'Test Service',
        amount: 10000,
        currency: 'KRW',
        payment_cycle: 'monthly',
        payment_day: 15,
        status: 'active',
        category: 'Test',
        memo: 'This is a test subscription'
      };

      const { error } = await supabase
        .from('subscriptions')
        .insert(testSubscription);

      if (error) {
        throw error;
      }

      console.log('Test data added successfully');
      await fetchData();
    } catch (err) {
      console.error('Error adding test data:', err);
      setError(err instanceof Error ? err.message : 'Failed to add test data');
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymously = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        throw error;
      }
      
      console.log('Signed in anonymously:', data);
      setUser(data.user);
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Supabase Data Test</h1>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">User Status</h2>
          <p>User: {user ? user.email || 'Anonymous' : 'Not signed in'}</p>
          <p>User ID: {user?.id || 'N/A'}</p>
        </div>

        <div className="flex gap-4">
          {!user && (
            <Button onClick={signInAnonymously} disabled={loading}>
              Sign In Anonymously
            </Button>
          )}
          <Button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>
          <Button onClick={addTestData} disabled={loading}>
            Add Test Data
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Subscriptions ({subscriptions.length})</h2>
        
        {subscriptions.length === 0 ? (
          <p className="text-gray-500">No subscriptions found.</p>
        ) : (
          <div className="grid gap-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="p-4 border rounded-lg">
                <h3 className="font-semibold">{sub.service_name}</h3>
                <p>Amount: {sub.amount} {sub.currency}</p>
                <p>Status: {sub.status}</p>
                <p>Category: {sub.category || 'None'}</p>
                <p>Payment Day: {sub.payment_day || 'Not set'}</p>
                {sub.memo && <p>Memo: {sub.memo}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTest;