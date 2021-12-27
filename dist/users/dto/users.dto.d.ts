export declare class RegisterDto {
    firstname: string;
    lastname: string;
    readonly email: string;
    readonly password: string;
}
export declare class AgentsDto {
    firstname: string;
    lastname: string;
    readonly email: string;
    readonly password: string;
    location: number;
    image_url?: number;
}
export declare class LoginDto {
    readonly email: string;
    readonly password: string;
}
export declare class ChangePasswordDto {
    readonly email: string;
    readonly password: string;
    readonly newPassword: string;
}
export declare class EditProfileDto {
    readonly email: string;
    firstname?: string;
    lastname?: string;
    image_url?: string;
    location?: number;
}
export declare class ResetDto {
    readonly email: string;
}
export declare class FundWalletDto {
    amount: number;
}
