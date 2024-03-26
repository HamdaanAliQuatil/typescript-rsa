import express, { Response, Request } from 'express';
import { fetchAliceDecryptedData, fetchAliceEncryptedData, fetchAlicePublicKey, keyPublic } from '@rsa-elgamal/v1/controllers/alice.controller';
import axios from 'axios';

const alice = express();
const bob = express();

const PORT_ALICE = 3000;
const PORT_BOB = 3001;

let alicePublicKey: keyPublic;

alice.get('/init', async (req: Request, res: Response) => {
    alicePublicKey = await fetchAlicePublicKey();
    res.send({ alicePublicKey });
});

alice.get('/encryptData', async (req: Request, res: Response) => {
    const encryptedData = await fetchAliceEncryptedData();
    res.send({ encryptedData });
});

bob.get('/decryptData', async (req: Request, res: Response) => {
    const { encryptedData } = req.query;
    const decryptedData = await fetchAliceDecryptedData(encryptedData as string);
    res.send({ decryptedData });
});

bob.get('/all', async (req: Request, res: Response) => {
    const resp = await axios.get('http://localhost:3000/init');
    const { alicePublicKey } = resp.data;
    const resp2 = await axios.get('http://localhost:3000/encryptData');
    const { encryptedData } = resp2.data;
    const resp3 = await axios.get(`http://localhost:3001/decryptData?encryptedData=${encryptedData}`);
    const { decryptedData } = resp3.data;
    res.send({ alicePublicKey, encryptedData, decryptedData });
});

alice.get('/fetchData', async (req: Request, res: Response) => {
    // const hmac = hmacDigest(data, sharedSecret);
    // res.send({ data, hmac });
});

bob.get('/verifyData', async (req: Request, res: Response) => {
    // const resp = await axios.get('http://localhost:3000/fetchData');
    // const { data, hmac } = resp.data;
    // const verified = await verifyData(data, hmac);
    // res.send({ verified });
});


alice.listen(PORT_ALICE, () => {
    console.log(`Boost server is running on port ${PORT_ALICE}`);
});

bob.listen(PORT_BOB, () => {
    console.log(`AA server is running on port ${PORT_BOB}`);
});