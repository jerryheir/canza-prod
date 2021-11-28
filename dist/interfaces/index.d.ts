export interface responseData {
    status: 'success' | 'error';
    message: string;
    data?: any;
}
export declare type Currency = 'ngn' | 'usd' | 'gbp';
export declare type Supported = 'btc' | 'eth' | 'cusd';
export interface notificationData {
    userId: number;
    type: 'order' | 'issue' | 'swap';
    description: string;
    metadata: string;
}
export interface SendArguments {
    from: string;
    to: string;
    privateKey: string;
    amount: string;
}
