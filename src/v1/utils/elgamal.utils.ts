import { isProbablePrime } from "./crypto.utils";


export function keypairGeneration(p: number, g: number, d?: number): [{ p: number, g: number, e: number }, { p: number, d: number }] | -1 {
    console.log('ElGamal Key Pair Generation');

    // Choose an integer p that is a prime number
    if (!isProbablePrime(BigInt(p))) {
        console.log(`The variable p = ${p} must be a prime number.`);
        return -1;
    }

    // Choose an integer g such that 1 ≤ g < p
    if (g < 1 || g >= p) {
        console.log(`For the variable g = ${g}, it should satisfy 1 ≤ g < ${p}.`);
        return -1;
    }

    // Choose an integer d such that 1 ≤ d < (p - 1)
    if (d === undefined) {
        d = Math.floor(Math.random() * (p - 1)) + 1;
    }

    if (d < 1 || d >= p - 1) {
        console.log(`For the variable d = ${d}, it should satisfy 1 ≤ d < ${p - 1}.`);
        return -1;
    }

    // Secret generation
    const e = (g ** d) % p;

    // Output calculation path
    console.log(`Using prime p = ${p} and base g = ${g} from the Galois field GF(${p}).`);
    console.log(`Chosen d = ${d} is valid as it satisfies: 1 ≤ ${d} < ${p - 1}`);
    console.log(`(A) Calculate: e = g^d mod p = ${g}^${d} mod ${p} = ${e}`);
    console.log(`The public key K(pub) = {p, g, e} is therefore K(pub) = {${p}, ${g}, ${e}}`);
    console.log(`The private key K(priv) = {p, d} is therefore K(priv) = {${p}, ${d}}`);

    return [{ p, g, e }, { p, d }];
}

// ElGamal encryption
export function encryption(publicKey: { p: number, g: number, e: number }, m: number, k?: number): [number, number] | -1 {
    console.log('ElGamal Encryption');

    const { p, g, e } = publicKey;

    // Choose an integer m such that 1 ≤ m < p
    if (m < 1 || m >= p) {
        console.log(`For the variable m = ${m}, it should satisfy 1 ≤ m < ${p}.`);
        return -1;
    }

    // Choose an integer k such that 1 ≤ k < p - 1 and such that k and p - 1 are coprime
    if (k === undefined) {
        k = Math.floor(Math.random() * (p - 1)) + 1;
        while (gcd(k, p - 1) !== 1) {
            k = Math.floor(Math.random() * (p - 1)) + 1;
        }
    } else {
        if (gcd(k, p - 1) !== 1) {
            console.log(`The chosen k = ${k} is not coprime to (p - 1) = ${p - 1} as gcd(${k},${p - 1}) = ${gcd(k, p - 1)}.`);
            return -1;
        }
    }

    // Encryption
    const a = (g ** k) % p;
    const b = ((e ** k) * m) % p;

    // Output calculation path
    console.log(`Chosen k = ${k} is valid as it satisfies: 1 ≤ ${k} < ${p - 1} and gcd(${k},${p - 1}) = ${gcd(k, p - 1)}`);
    console.log(`Encryption for K(pub) = {${p}, ${g}, ${e}} and plaintext m = ${m} results in ciphertext a = ${a} and b = ${b}`);

    return [a, b];
}

// ElGamal decryption
export function decryption(privateKey: { p: number, d: number }, c: string): number | -1 {
    console.log('ElGamal Decryption');
    const encrypted: string[] = c.split(',').map(str => str.replace(/"/g, '').trim());
    const parsedEncrypted: number[] = encrypted.map(str => parseInt(str, 10));


    const { p, d } = privateKey;
    console.log(`p: ${p}, d: ${d}`);
    const [a, b] = parsedEncrypted;

    // Choose an integer a such that 1 ≤ a <(p - 1)
    if (a < 1 || a >= p) {
        console.log(`For the variable a = ${a}, it should satisfy 1 ≤ a < ${p}.`);
        return -1;
    }
    // Decryption
    const m = (b * moduloInverseMultiplicative(a ** d, p)) % p;

    // Output calculation path
    console.log(`Chosen a = ${a} is valid as it satisfies: 1 ≤ ${a} < ${p}`);
    console.log(`Decryption for K(priv) = {${p}, ${d}} and ciphertext a = ${a}, b = ${b} results in plaintext m = ${m}`);

    return m;
}

export function moduloInverseMultiplicative(a: number, m: number): number {
    let m0 = m;
    let y = 0, x = 1;

    if (m === 1) {
        return 0;
    }

    while (a > 1) {
        // q is quotient
        const q = Math.floor(a / m);

        let t = m;

        // m is remainder now, process same as Euclid's algo
        m = a % m;
        a = t;

        t = y;

        // Update x and y
        y = x - q * y;
        x = t;
    }

    // Make x positive
    if (x < 0) {
        x += m0;
    }

    return x;
}

export function gcd(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

let key = keypairGeneration(23, 5);
if (key !== -1) {
    let publicKey = key[0];
    let privateKey = key[1];
    let message = 6;
    let encrypted = encryption(publicKey, message);
    if (encrypted !== -1) {
        let decrypted = decryption(privateKey, encrypted.join(','));
        console.log('Decrypted:', decrypted);
    }

    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);
    console.log('Message:', message);
    console.log('Encrypted:', encrypted);
}




