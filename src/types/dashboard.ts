export interface DashboardStatsResponse {
  profile_views: number;
  unread_messages: number;
  total_sales: number;
  favorites_count: number;
}

export interface PerformanceData {
  name: string;
  views: number;
  messages: number;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface Listing {
  id: string;
  name: string;
  price: number;
  status: string;
  view_count: number;
  message_count: number;
  favorite_count: number;
  image_url?: string;
  breed?: string;
  category?: string;
}

export interface Order {
  order_number: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export interface AnalyticsResponse {
  performance: PerformanceData[];
  traffic: TrafficSource[];
}

export interface ListingsResponse {
  listings: Listing[];
}

export interface OrdersResponse {
  orders: Order[];
}