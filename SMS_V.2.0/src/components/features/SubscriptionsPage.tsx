import React, { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  PlayIcon,
  PauseIcon,
  XMarkIcon,
  ExternalLinkIcon,
  HomeIcon,
  BellIcon,
  UserIcon,
  Bars3Icon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import ResponsiveContainer from '../ui/ResponsiveContainer';
import GridLayout from '../ui/GridLayout';
import ResponsiveHeader from '../ui/ResponsiveHeader';

interface Subscription {
  id: string;
  name: string;
  icon: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  billingCycle: string;
  price: number;
  currency: string;
  paymentDay: number;
  description: string;
}

const SubscriptionsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedSort, setSelectedSort] = useState('Name (A-Z)');

  const subscriptions: Subscription[] = [
    {
      id: '1',
      name: 'Adobe CC',
      icon: 'A',
      category: 'Design',
      status: 'active',
      billingCycle: 'monthly',
      price: 25.99,
      currency: '$',
      paymentDay: 16,
      description: '디자인'
    }
  ];

  const categories = ['All Categories', 'Design', 'Development', 'Productivity', 'Entertainment'];
  const statuses = ['All Status', 'Active', 'Paused', 'Cancelled'];
  const sortOptions = ['Name (A-Z)', 'Name (Z-A)', 'Price (Low-High)', 'Price (High-Low)', 'Date Added'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* System Bar */}
      <div className="bg-blue-600 text-white px-4 py-1 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span>KT 5:46</span>
          <span>Moonwav</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <span>HD</span>
          <span>5G</span>
          <div className="flex space-x-0.5">
            {[1, 2, 3, 4].map((bar) => (
              <div key={bar} className="w-0.5 h-2 bg-white rounded-full"></div>
            ))}
          </div>
          <div className="w-6 h-3 border border-white rounded-sm relative">
            <div className="w-4 h-1.5 bg-white rounded-sm absolute top-0.5 left-0.5"></div>
          </div>
          <span className="text-xs">65%</span>
        </div>
      </div>

      {/* Header with Wave Graphic */}
      <ResponsiveHeader />

      {/* Main Content */}
      <ResponsiveContainer maxWidth="xl" padding="lg">
        <div className="space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-2 md:hidden">
          <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-600">Manage your subscription services</p>
        </div>

        {/* Add Subscription Button */}
        <div className="flex justify-center">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <PlusIcon className="w-5 h-5" />
            <span className="text-sm sm:text-base">Add Subscription</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        {/* Filters */}
        <GridLayout cols={{ sm: 1, md: 3 }} gap="sm">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </GridLayout>

        {/* Subscription Count and View Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium text-sm sm:text-base">{subscriptions.length} subscriptions</span>
          <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Squares2X2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 sm:p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <ListBulletIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Subscription Items */}
        {viewMode === 'grid' ? (
          <GridLayout cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap="md">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} viewMode={viewMode} />
            ))}
          </GridLayout>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} viewMode={viewMode} />
            ))}
          </div>
        )}
        </div>
      </ResponsiveContainer>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:py-3">
        <div className="flex items-center justify-around">
          <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full"></div>
          </div>
          <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

interface SubscriptionCardProps {
  subscription: Subscription;
  viewMode: 'grid' | 'list';
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, viewMode }) => {
  const isActive = subscription.status === 'active';
  const statusColors = {
    active: 'text-green-600',
    paused: 'text-yellow-600',
    cancelled: 'text-red-600'
  };

  const statusIcons = {
    active: <PlayIcon className="w-3 h-3 text-green-500" />,
    paused: <PauseIcon className="w-3 h-3 text-yellow-500" />,
    cancelled: <XMarkIcon className="w-3 h-3 text-red-500" />
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow ${
      viewMode === 'list' ? 'flex items-center space-x-3 sm:space-x-4' : ''
    }`}>
      <div className={`flex items-center ${viewMode === 'list' ? 'flex-shrink-0' : 'justify-center mb-2 sm:mb-3'}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm">
          {subscription.icon}
        </div>
        {viewMode === 'list' && (
          <ExternalLinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-1 sm:ml-2" />
        )}
      </div>

      <div className={`${viewMode === 'list' ? 'flex-1' : 'text-center'}`}>
        <div className="flex items-center justify-center space-x-1 mb-1">
          <span className="text-xs sm:text-sm text-gray-500">{subscription.icon}</span>
          <ExternalLinkIcon className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-1 truncate text-sm sm:text-base">{subscription.name}</h3>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
          {subscription.billingCycle} • {subscription.currency}{subscription.price}
        </p>
        
        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{subscription.description}</p>
        
        <div className="flex items-center justify-center space-x-1 mb-2 sm:mb-3">
          {statusIcons[subscription.status]}
          <span className={`text-xs sm:text-sm font-medium ${statusColors[subscription.status]}`}>
            {subscription.status}
          </span>
        </div>
        
        <div className="flex justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
          <button className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <PauseIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
          <button className="p-1.5 sm:p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Payment day: Day {subscription.paymentDay}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionsPage;