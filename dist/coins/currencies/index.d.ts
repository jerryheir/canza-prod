import { SendArguments, Supported } from '../../interfaces';
export declare class Currencies {
    getWallet(a: Supported): Promise<{
        privateKey: any;
        address: any;
    }>;
    sendCrypto(a: Supported, object: SendArguments): Promise<any>;
    getBalance(a: Supported, address: string): Promise<any>;
}
