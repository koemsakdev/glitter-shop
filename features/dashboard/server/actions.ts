'use server';

import {
  fetchDashboardStats,
  fetchChartData,
  fetchRecentOrders,
  fetchTopProducts,
} from '@/lib/services/dashboard.service';

/**
 * Server Actions for Dashboard
 * These wrap the API services for use in React components
 */

export async function getDashboardStats() {
  try {
    return await fetchDashboardStats();
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

export async function getChartData(days: number = 7) {
  try {
    return await fetchChartData(days);
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
    throw error;
  }
}

export async function getRecentOrders(limit: number = 5) {
  try {
    return await fetchRecentOrders(limit);
  } catch (error) {
    console.error('Failed to fetch recent orders:', error);
    throw error;
  }
}

export async function getTopProducts(limit: number = 5) {
  try {
    return await fetchTopProducts(limit);
  } catch (error) {
    console.error('Failed to fetch top products:', error);
    throw error;
  }
}