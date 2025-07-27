import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid3X3, List } from 'lucide-react';
import { Card, CardContent } from '../components/ui';
import { Button } from '../components/ui';
import { useSubscriptions } from '../hooks/useSubscriptions';
import SubscriptionCard from '../components/features/subscription/SubscriptionCard';
import SubscriptionForm from '../components/features/subscription/SubscriptionForm';
import type { Subscription, SubscriptionFormData } from '../types/database.types';



const Subscriptions: React.FC = () => {
  const {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscriptionStatus
  } = useSubscriptions();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'date' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Categories and statuses for filters
  const categories = ['Streaming', 'Music', 'Software', 'Gaming', 'Education', 'Productivity', 'Entertainment', 'Other'];
  const statuses = ['active', 'paused', 'canceled'];

  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(sub => sub.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(sub => sub.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.service_name.toLowerCase();
          bValue = b.service_name.toLowerCase();
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'date':
          aValue = new Date(a.next_payment_date || new Date());
          bValue = new Date(b.next_payment_date || new Date());
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [subscriptions, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleAddSubscription = async (data: SubscriptionFormData) => {
    const result = await addSubscription(data);
    if (result.success) {
      setShowForm(false);
    }
    return result;
  };

  const handleEditSubscription = async (data: SubscriptionFormData) => {
    if (!editingSubscription) return { success: false, error: 'No subscription to edit' };
    
    const result = await updateSubscription(editingSubscription.id, data);
    if (result.success) {
      setShowForm(false);
      setEditingSubscription(null);
    }
    return result;
  };



  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      await deleteSubscription(id);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    await toggleSubscriptionStatus(id, currentStatus);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
  };



  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 break-keep-ko">
            Subscriptions
          </h1>
          <p className="text-gray-600 break-keep-ko">
            Manage your subscription services
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'name' | 'amount' | 'date' | 'category');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="amount-asc">Amount (Low-High)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="date-desc">Date (Newest)</option>
              <option value="category-asc">Category (A-Z)</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory || selectedStatus) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 break-keep-ko">
            {filteredAndSortedSubscriptions.length} subscription{filteredAndSortedSubscriptions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 break-keep-ko">{error}</p>
        </div>
      )}

      {/* Subscriptions Grid/List */}
      {filteredAndSortedSubscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 break-keep-ko">
              No subscriptions found
            </h3>
            <p className="text-gray-500 break-keep-ko">
              {searchTerm || selectedCategory || selectedStatus
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first subscription.'}
            </p>
            {!searchTerm && !selectedCategory && !selectedStatus && (
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {filteredAndSortedSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              className={viewMode === 'list' ? 'flex-row' : ''}
            />
          ))}
        </div>
      )}

      {/* Subscription Form Modal */}
      <SubscriptionForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingSubscription(null);
        }}
        onSubmit={editingSubscription ? handleEditSubscription : handleAddSubscription}
        subscription={editingSubscription}
        title={editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
      />
    </div>
  );
};

export default Subscriptions;