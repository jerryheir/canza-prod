export declare class User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    image_url: string;
    role: number;
    google_signin: 0 | 1;
    verified: 0 | 1;
    banned: 0 | 1;
    location: number;
    phone: string;
    wallet_balance: number;
    fcm_token: string;
    created_at: Date;
    updated_at: Date;
}
export declare class Contacts {
    id: number;
    userId: number;
    contact_id: number;
}
