import express, { Response, Request } from 'express';
import { hmacDigest, shareKeys } from '@boost/v1/controllers/verification.controller';
import { KeyPair, generateSharedSecret } from '@boost/v1/utils/crypto.utils';
import { DiffieHellman } from 'crypto';
import axios from 'axios';
import { sendAAPublicKey, verifyData } from '@boost/v1/controllers/aa.controller';

const appBoost = express();
const appAA = express();
const PORT_BOOST = 3000;
const PORT_AA = 3001;

let boostPublicKey: Buffer, boostPrivateKey: Buffer;
let boostGenerator: Buffer, boostPrime: Buffer;
let sharedSecret: Buffer;
let AAPublicKey: Buffer;
let boostKeyPair: KeyPair, boostDiffeHellman: DiffieHellman;

appBoost.get('/init', async (req: Request, res: Response) => {
    ({ boostPublicKey, boostPrivateKey, boostGenerator, boostPrime, boostDiffeHellman } = shareKeys());
    res.send({ boostPublicKey, boostGenerator, boostPrime });
});

appAA.get('/fetchAAPublicKey', async (req: Request, res: Response) => {
    AAPublicKey = await sendAAPublicKey();
    res.send({ AAPublicKey: AAPublicKey.toString('hex') });

    boostKeyPair = {
        publicKey: boostPublicKey,
        privateKey: boostPrivateKey,
        generator: boostGenerator,
        prime: boostPrime,
        diffieHellman: boostDiffeHellman
    }

    sharedSecret = generateSharedSecret(boostKeyPair, AAPublicKey);
});

const data = {
    name: 'Boost User 1',
    ssn: 'WSDFS561324'
};

appBoost.get('/fetchData', async (req: Request, res: Response) => {
    const hmac = hmacDigest(data, sharedSecret);
    res.send({ data, hmac });
});

appAA.get('/verifyData', async (req: Request, res: Response) => {
    const resp = await axios.get('http://localhost:3000/fetchData');
    const { data, hmac } = resp.data;
    const verified = await verifyData(data, hmac);
    res.send({ verified });
});


appBoost.listen(PORT_BOOST, () => {
    console.log(`Boost server is running on port ${PORT_BOOST}`);
});

appAA.listen(PORT_AA, () => {
    console.log(`AA server is running on port ${PORT_AA}`);
});