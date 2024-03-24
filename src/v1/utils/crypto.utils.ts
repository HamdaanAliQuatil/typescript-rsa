import crypto from 'crypto';
import bigInt from 'big-integer';

interface RSAKeyPair {
    publicKey: {
        e: bigint;
        n: bigint;
    }
    privateKey?: bigInt.BigInteger;
}

function powerMod(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = BigInt(1);
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n == 1n)
            result = (result * base) % mod;
        exp >>= 1n;
        base = (base * base) % mod;
    }
    return result;
}

function millerRabinTest(n: bigint, d: bigint): boolean {
    const a = 2n + BigInt(Math.floor(Math.random() * (Number(n) - 2)));
    let x = powerMod(a, d, n);
    if (x == 1n || x == n - 1n)
        return true;
    while (d != n - 1n) {
        x = (x * x) % n;
        d *= 2n;
        if (x == 1n)
            return false;
        if (x == n - 1n)
            return true;
    }
    return false;
}

function isProbablePrime(n: bigint, k: number = 5): boolean {
    if (n <= 1n)
        return false;
    if (n <= 3n)
        return true;
    if (n % 2n == 0n)
        return false;

    let d = n - 1n;
    while (d % 2n == 0n)
        d /= 2n;

    for (let i = 0; i < k; i++) {
        if (!millerRabinTest(n, d))
            return false;
    }
    return true;
}

function generatePrime(bitLength: number): bigint {
    const min = 2n ** BigInt(bitLength - 1);
    const max = 2n ** BigInt(bitLength) - 1n;

    while (true) {
        const primeCandidate = min + BigInt(Math.floor(Math.random() * Number(max - min)));
        if (isProbablePrime(primeCandidate)) {
            return primeCandidate;
        }
    }
}

function coprime(a: bigint, b: bigint): boolean {
    while (b != 0n) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a == 1n;
}

function bufferToBigInt(buffer: ArrayBuffer): bigint {
    let hexString = '';
    const view = new DataView(buffer);
    for (let i = 0; i < buffer.byteLength; i++) {
        hexString += view.getUint8(i).toString(16).padStart(2, '0');
    }

    return BigInt(`0x${hexString}`);
}

export { RSAKeyPair, generatePrime, coprime, bufferToBigInt }
