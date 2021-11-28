export declare class Notifications {
    id: number;
    userId: number;
    type: 'order' | 'issue' | 'swap';
    description: string;
    metadata: string;
    created_at: Date;
    updated_at: Date;
}
