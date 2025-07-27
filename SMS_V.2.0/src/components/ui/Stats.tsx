import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatItem {
  name: string;
  stat: string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
}

interface StatsProps {
  stats: StatItem[];
  className?: string;
}

const Stats: React.FC<StatsProps> = ({ stats, className }) => {
  return (
    <div className={className}>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                {item.icon || (
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )}
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 font-pretendard tracking-ko-normal break-keep-ko">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 font-pretendard tracking-ko-normal">
                {item.stat}
              </p>
              {item.change && (
                <p
                  className={cn(
                    item.changeType === 'increase' ? 'text-green-600' : 
                    item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500',
                    'ml-2 flex items-baseline text-sm font-semibold font-pretendard tracking-ko-normal'
                  )}
                >
                  {item.changeType === 'increase' ? (
                    <TrendingUp className="h-5 w-5 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                  ) : item.changeType === 'decrease' ? (
                    <TrendingDown className="h-5 w-5 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                  ) : (
                    <Minus className="h-5 w-5 flex-shrink-0 self-center text-gray-500" aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase' ? '증가' : 
                     item.changeType === 'decrease' ? '감소' : '변화 없음'} by
                  </span>
                  {item.change}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Stats;