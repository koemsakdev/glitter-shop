'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  type?: 'revenue' | 'orders' | 'customers' | 'products';
}

const getIconColor = (type?: string) => {
  switch (type) {
    case 'revenue':
      return { 
        bg: 'from-blue-500/10 to-blue-600/10', 
        icon: 'text-blue-600 dark:text-blue-400',
        circle: 'bg-blue-300/15 dark:bg-blue-500/10',
        accent: '#3b82f6' 
      };
    case 'orders':
      return { 
        bg: 'from-purple-500/10 to-purple-600/10', 
        icon: 'text-purple-600 dark:text-purple-400',
        circle: 'bg-purple-300/15 dark:bg-purple-500/10',
        accent: '#a855f7' 
      };
    case 'customers':
      return { 
        bg: 'from-pink-500/10 to-pink-600/10', 
        icon: 'text-pink-600 dark:text-pink-400',
        circle: 'bg-pink-300/15 dark:bg-pink-500/10',
        accent: '#ec4899' 
      };
    case 'products':
      return { 
        bg: 'from-orange-500/10 to-orange-600/10', 
        icon: 'text-orange-600 dark:text-orange-400',
        circle: 'bg-orange-300/15 dark:bg-orange-500/10',
        accent: '#ea580c' 
      };
    default:
      return { 
        bg: 'from-pink-500/10 to-pink-600/10', 
        icon: 'text-pink-600 dark:text-pink-400',
        circle: 'bg-pink-300/15 dark:bg-pink-500/10',
        accent: '#ec4899' 
      };
  }
};

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel,
  type 
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const colors = getIconColor(type);

  return (
    <div className="group relative h-full">
      <div className="relative bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 p-6 hover:border-gray-300 dark:hover:border-neutral-700 transition-all duration-300 h-full animate-fade-in overflow-hidden">
        
        <div className={`absolute top-1/2 right-0 w-56 h-56 -translate-y-1/2 translate-x-1/3 ${colors.circle} rounded-full transition-transform duration-700 group-hover:scale-110 blur-2xl`} />
        <div className={`absolute bottom-0 right-12 w-40 h-40 ${colors.circle} rounded-full transition-transform duration-700 group-hover:scale-125 blur-xl opacity-50`} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-linear-to-br ${colors.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 transform ${colors.icon}`}>
              <div className="animate-pulse-gentle">
                {icon}
              </div>
            </div>

            {trend !== undefined && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isPositive 
                  ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300' 
                  : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 animate-bounce-up" />
                ) : (
                  <TrendingDown className="w-4 h-4 animate-bounce-down" />
                )}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )}
          </div>

          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:scale-105 origin-left transition-transform duration-300">
            {value}
          </p>

          {trendLabel && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
              {trendLabel}
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-up {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        @keyframes bounce-down {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(2px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce-up {
          animation: bounce-up 1s ease-in-out infinite;
        }

        .animate-bounce-down {
          animation: bounce-down 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}