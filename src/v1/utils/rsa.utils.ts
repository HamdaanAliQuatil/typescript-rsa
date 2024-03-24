import { RSAKeyPair, generatePrime, coprime, bufferToBigInt } from '@rsa-elgamal/v1/utils/crypto.utils'
import bigInt from 'big-integer';

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
    const d = bigInt(e).modInv(phi);

    // console.log(`Public key: (${e}, ${n})`);
    // console.log(`Private key: (${d}`);

    return {
        publicKey: {
            e,
            n
        },
        privateKey: d
    };
}