import { apiClient } from '@/lib/api-client';

/**
 * Dashboard API Service
 * All dashboard-related API calls
 */

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

/**
 * Get dashboard statistics
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/dashboard/stats');
}

/**
 * Get chart data for revenue and orders
 * @param days - Number of days to fetch (default: 7)
 */
export async function fetchChartData(days: number = 7): Promise<ChartData[]> {
  return apiClient.get<ChartData[]>('/dashboard/chart', {
    params: { days },
  });
}

/**
 * Get recent orders
 * @param limit - Number of orders to fetch (default: 5)
 */
export async function fetchRecentOrders(limit: number = 5): Promise<Order[]> {
  return apiClient.get<Order[]>('/dashboard/orders', {
    params: { limit },
  });
}

/**
 * Get top products
 * @param limit - Number of products to fetch (default: 5)
 */
export async function fetchTopProducts(limit: number = 5): Promise<Product[]> {
  return apiClient.get<Product[]>('/dashboard/products', {
    params: { limit },
  });
}