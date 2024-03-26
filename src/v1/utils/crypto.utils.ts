import crypto from 'crypto';
import bigInt from 'big-integer';

interface RSAKeyPair {
    publicKey: {
        e: bigint;
        n: bigint;
    }
    privateKey: bigint;
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

function bufferToBigInt(buffer: any, start = 0, end = buffer.length) {
    const bufferAsHexString = buffer.slice(start, end).toString("hex");
    return BigInt(`0x${bufferAsHexString}`);
}

function modInv(a: bigint, m: bigint): bigint {
    const m0 = m;
    let x0 = 0n;
    let x1 = 1n;

    if (m == 1n)
        return 0n;

    while (a > 1n) {
        const q = a / m;
        let t = m;

        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }

    if (x1 < 0n)
        x1 += m0;

    return x1;
}


export { RSAKeyPair, generatePrime, coprime, bufferToBigInt, powerMod, millerRabinTest, isProbablePrime, modInv}
