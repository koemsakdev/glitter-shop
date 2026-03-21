'use client';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const t = useTranslations();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartColors = {
    grid: isDark ? '#262626' : '#e5e7eb',
    axis: isDark ? '#9ca3af' : '#9ca3af',
    tooltip: isDark ? '#1f2937' : '#ffffff',
    tooltipBorder: isDark ? '#404040' : '#e5e7eb',
    tooltipText: isDark ? '#f3f4f6' : '#000000',
    line1: isDark ? '#f472b6' : '#ec4899',
    line2: isDark ? '#be7399' : '#be7399'
  };


  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
        {t('dashboard.revenueTrend')}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="date"
            stroke={chartColors.axis}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke={chartColors.axis}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.tooltip,
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: '8px',
              color: chartColors.tooltipText,
            }}
            labelStyle={{ color: chartColors.tooltipText }}
          />
          <Legend
            wrapperStyle={{ color: isDark ? '#f3f4f6' : '#000000' }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name={t("dashboard.revenue") + " ($)"}
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name={t("dashboard.orders")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}