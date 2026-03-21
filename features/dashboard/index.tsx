'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';
import {
  getDashboardStats,
  getChartData,
  getRecentOrders,
  getTopProducts,
} from './server/actions';
import { StatCard } from './components/stat-card';
import { RevenueChart } from './components/revenue-chart';
import { RecentOrders } from './components/recent-orders';
import { TopProducts } from './components/top-products';
import { BarChart3, ShoppingCart, Users, Package } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
}

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
}

export function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, chartDataResult, ordersData, productsData] = await Promise.all([
        getDashboardStats(),
        getChartData(),
        getRecentOrders(),
        getTopProducts(),
      ]);

      setStats(statsData);
      setChartData(chartDataResult);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setError(t('Common.error'));
      toast.error(t('Common.error'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, [locale, fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 dark:border-pink-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('Common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-pink-200 dark:border-pink-900 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 rounded-lg bg-pink-500 dark:bg-pink-700 text-white hover:bg-pink-600 dark:hover:bg-pink-800 transition-colors"
        >
          {t('Common.retry') || 'Retry'}
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-pink-200 dark:border-pink-900 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">{t('Common.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalRevenue')}
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<BarChart3 className="w-6 h-6" />}
          trend={stats.revenueGrowth}
          trendLabel={t('dashboard.fromLastMonth')}
          type="revenue"
        />
        <StatCard
          title={t('dashboard.totalOrders')}
          value={stats.totalOrders.toString()}
          icon={<ShoppingCart className="w-6 h-6" />}
          trend={stats.ordersGrowth}
          trendLabel={t('dashboard.fromLastMonth')}
          type="orders"
        />
        <StatCard
          title={t('dashboard.totalCustomers')}
          value={stats.totalCustomers.toString()}
          icon={<Users className="w-6 h-6" />}
          trend={stats.customersGrowth}
          trendLabel={t('dashboard.fromLastMonth')}
          type="customers"
        />
        <StatCard
          title={t('dashboard.totalProducts')}
          value={stats.totalProducts.toString()}
          icon={<Package className="w-6 h-6" />}
          trend={stats.productsGrowth}
          trendLabel={t('dashboard.fromLastMonth')}
          type="products"
        />
      </div>

      {/* Chart */}
      {chartData.length > 0 && <RevenueChart data={chartData} />}

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={orders} />
        <TopProducts products={products} />
      </div>
    </div>
  );
}