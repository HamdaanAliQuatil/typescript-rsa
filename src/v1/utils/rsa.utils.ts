import { RSAKeyPair, generatePrime, coprime, bufferToBigInt, powerMod, modInv } from '@rsa-elgamal/v1/utils/crypto.utils'
// import BigInt from 'big-integer';

export function rsa(): RSAKeyPair {
    // Generate two distinct primes
    const p: bigint = generatePrime(32);
    const q: bigint = generatePrime(32);

    if (p === q) {
        throw new Error(`p and q must be different`);
    }

    // calculate n
    const n: bigint = p * q;

    // Calculate phi(n) 
    const phi: bigint = (p - 1n) * (q - 1n);

    // Choose e such that e and phi are coprime
    let e: bigint = 3n;
    while (!coprime(e, phi)) {
        e += 2n;
    }

    // console.log(`e: ${e} and phi: ${phi} are coprime`);
    
    // Calculate d
    const d = modInv(e, phi);
    
    // console.log(`p: ${p}, q: ${q}, n: ${n}, phi: ${phi}, e: ${e} and d: ${d}`);

    return {
        publicKey: {
            e,
            n
        },
        privateKey: d
    };
}

export function encrypt(data: string, publicKey: RSAKeyPair['publicKey']): any {
    const n = publicKey.n;
    const e = publicKey.e;
    
    let dataBigInt =  BigInt(data);
    console.log(dataBigInt);
    
    const encryptedData = powerMod(dataBigInt, e, n);

    return encryptedData;
}

export function decrypt(encryptedData: bigint, privateKey: RSAKeyPair['privateKey'], publicKey: RSAKeyPair['publicKey']): bigint {
    const n = publicKey.n;
    const d = privateKey;

    const decryptedData = powerMod(encryptedData, d, n);
    console.log(`decryptedData: ${decryptedData}`);
    let decryptedDataStr = decryptedData.toString(2);
    console.log(decryptedDataStr);

    return decryptedData;
}

