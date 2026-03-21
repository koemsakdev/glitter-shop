'use client';
import { useTranslations } from 'next-intl';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: string;
  date: string | Date;
}

interface RecentOrdersProps {
  orders: Order[];
}

const statusColors: Record<string, { light: string; dark: string }> = {
  PENDING: { 
    light: 'bg-yellow-100 text-yellow-800', 
    dark: 'dark:bg-yellow-900 dark:text-yellow-200' 
  },
  PROCESSING: { 
    light: 'bg-blue-100 text-blue-800', 
    dark: 'dark:bg-blue-900 dark:text-blue-200' 
  },
  SHIPPED: { 
    light: 'bg-purple-100 text-purple-800', 
    dark: 'dark:bg-purple-900 dark:text-purple-200' 
  },
  DELIVERED: { 
    light: 'bg-green-100 text-green-800', 
    dark: 'dark:bg-green-900 dark:text-green-200' 
  },
  CANCELLED: { 
    light: 'bg-red-100 text-red-800', 
    dark: 'dark:bg-red-900 dark:text-red-200' 
  },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  const t = useTranslations();
  if (orders.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
          {t('dashboard.recentOrders')}
        </h3>
        <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
          {t('dashboard.noRecentOrder')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        {t('dashboard.recentOrders')}
      </h3>
      <div className="space-y-4">
        {orders.map((order) => {
          const colors = statusColors[order.status] || { 
            light: 'bg-gray-100 text-gray-800', 
            dark: 'dark:bg-gray-800 dark:text-gray-200' 
          };

          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.orderNumber}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {order.customer}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-neutral-900 dark:text-white">
                  ${order.amount.toFixed(2)}
                </p>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.light} ${colors.dark}`}>
                  {order.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}