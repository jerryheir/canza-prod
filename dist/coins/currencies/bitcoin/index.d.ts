import { SendArguments } from '../../../interfaces';
export declare class Bitcoin {
    generateBitcoinAddress(): {
        privateKey: any;
        address: any;
    };
    sendBitcoin(object: SendArguments): Promise<any>;
    verifyTransaction(object: {
        address: string;
        txId: string;
    }): Promise<boolean>;
    getBitcoinBalance(address: string): Promise<number>;
}
