export interface User {
  id: bigint;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: bigint;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  email?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: bigint;
  name: string;
  slug: string;
  logo?: string;
  status: string;
  createdAt: Date;
}

export interface Category {
  id: bigint;
  name: string;
  slug: string;
  image?: string;
  parentId?: bigint;
  status: string;
}

export interface Color {
  id: bigint;
  name: string;
  code?: string;
  status: string;
}

export interface Size {
  id: bigint;
  name: string;
  type?: string;
  status: string;
}

export interface Product {
  id: bigint;
  name: string;
  slug: string;
  description?: string;
  status: string;
  brandId?: bigint;
  categoryId?: bigint;
  branchId?: bigint;
  createdAt: Date;
  updatedAt: Date;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: bigint;
  productId: bigint;
  url: string;
  altText?: string;
  order: number;
  isPrimary: boolean;
  createdAt: Date;
}

export interface ProductVariant {
  id: bigint;
  productId: bigint;
  colorId?: bigint;
  sizeId?: bigint;
  sku: string;
  price: number;
  cost?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Warehouse {
  id: bigint;
  branchId?: bigint;
  name: string;
  address?: string;
  status: string;
  createdAt: Date;
}

export interface Inventory {
  id: bigint;
  warehouseId: bigint;
  variantId: bigint;
  qtyOnHand: number;
  qtyReserved: number;
  reorderLevel: number;
  updatedAt: Date;
}

export interface Customer {
  id: bigint;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: bigint;
  orderNumber: string;
  customerId?: bigint;
  branchId?: bigint;
  orderStatus: string;
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: bigint;
  orderId: bigint;
  productId: bigint;
  variantId?: bigint;
  quantity: number;
  price: number;
}

export interface Payment {
  id: bigint;
  orderId: bigint;
  amount: number;
  status: string;
  method?: string;
  reference?: string;
  createdAt: Date;
}

export interface Banner {
  id: bigint;
  branchId?: bigint;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  order: number;
  status: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: bigint;
  branchId?: bigint;
  title: string;
  slug: string;
  content?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
}

export interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}