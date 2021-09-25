export interface responseData {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export type Currency = 'ngn' | 'usd' | 'gbp';

export interface notificationData {
  userId: number;
  type: 'order' | 'issue' | 'swap';
  description: string;
  metadata: string;
}
