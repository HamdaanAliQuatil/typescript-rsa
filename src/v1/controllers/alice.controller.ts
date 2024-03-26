import { rsa, encrypt, decrypt } from '@rsa-elgamal/v1/utils/rsa.utils';

let keyPair: any;
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
    const data = 'árt';
    const ascii = toAscii( data );
    const encryptedData = encrypt(ascii, keyPair.publicKey);
    console.log(encryptedData.toString());
    return encryptedData.toString();
}

export async function fetchAliceDecryptedData( encryptedData: string ): Promise<string> {
    const decryptedData = decrypt(BigInt(encryptedData), keyPair.privateKey, keyPair.publicKey);
    console.log(decryptedData, decryptedData.toString());
    const ascii = fromAscii( decryptedData.toString() );
    console.log(`data ${ascii}`);
    return ascii;
}