import { rsa, encrypt, decrypt } from '@rsa-elgamal/v1/utils/rsa.utils';
import { decryption, encryption, keypairGeneration } from '../utils/elgamal.utils';

let keyPair: any;
let d: any;
export type keyPublic = {  e: bigint, n: bigint  };

export function toAscii(str: string): string {
    let ascii = '';
    for (let i = 0; i < str.length; i++) {
        let bin = str[i].charCodeAt(0).toString(2);
        while (bin.length < 8) {
            bin = '0' + bin;
        }
        ascii += bin;
    }
    return ascii;
}

export function fromAscii(ascii: string): string {
    let str = '';
    for (let i = 0; i < ascii.length; i += 8) {
        const bin = ascii.slice(i, i + 8);
        str += String.fromCharCode(parseInt(bin, 2));
    }
    return str;
}

export function fetchAlicePublicKey(): keyPublic {
    keyPair = rsa();
    return { e: keyPair.publicKey.e.toString(), n: keyPair.publicKey.n.toString() }
}

export async function fetchAliceEncryptedData(): Promise<string> {
    const data = '6';
    const ascii = toAscii( data );
    const encryptedData = encrypt(data, keyPair.publicKey);
    console.log(encryptedData.toString());
    return encryptedData.toString();
}

export async function fetchAliceDecryptedData( encryptedData: string ): Promise<bigint> {
    const decryptedData = decrypt(BigInt(encryptedData), keyPair.privateKey, keyPair.publicKey);
    console.log(decryptedData, decryptedData.toString());
    const ascii = fromAscii( decryptedData.toString() );
    console.log(`data ${ascii}`);
    return decryptedData;
}

export async function elgamalEncryption(p: number, g: number, data: number): Promise<[number, number]> {
    let key = keypairGeneration(p, g);
    if (key !== -1) {
        let publicKey = key[0];
        d = key[1].d;
        let encrypted = encryption(publicKey, data);
        if (encrypted !== -1) {
            return encrypted; 
        }
    }
    return [-1, -1];
}

export async function elgamalDecryption(p: number, encrypted: string): Promise<number> {
    return decryption({p, d}, encrypted);
}
