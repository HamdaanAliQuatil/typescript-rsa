import express, { Response, Request } from 'express';
import { elgamalDecryption, elgamalEncryption, fetchAliceDecryptedData, fetchAliceEncryptedData, fetchAlicePublicKey, keyPublic } from '@rsa-elgamal/v1/controllers/alice.controller';
import axios from 'axios';
import { decrypt } from './utils/rsa.utils';

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
    const decryptedDataStr = decryptedData.toString();
    console.log({ decryptedDataStr });
    res.send({ decryptedDataStr });
});

bob.get('/all', async (req: Request, res: Response) => {
    try {
        const [initResp, encryptResp] = await Promise.all([
            axios.get('http://localhost:3000/init'),
            axios.get('http://localhost:3000/encryptData')
        ]);

        const { alicePublicKey } = initResp.data;
        const { encryptedData } = encryptResp.data;

        const decryptResp = await axios.get(`http://localhost:3001/decryptData?encryptedData=${encryptedData}`);
        const { decryptedDataStr } = decryptResp.data;

        console.log({ decryptedDataStr });
        res.send({ alicePublicKey, encryptedData, decryptedDataStr });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
});


alice.get('/encryptElgamal', async (req: Request, res: Response) => {
    const { data } = req.query;
    const encryptedData = await elgamalEncryption(23, 5, Number(data));
    res.send({ encryptedData });
});

bob.get('/decryptElgamal', async (req: Request, res: Response) => {
    const { data } = req.query;
    const stringData = data as string;
    const decryptedData = await elgamalDecryption(23, stringData);
    res.send({ decryptedData });
});

alice.listen(PORT_ALICE, () => {
    console.log(`Boost server is running on port ${PORT_ALICE}`);
});

bob.listen(PORT_BOB, () => {
    console.log(`AA server is running on port ${PORT_BOB}`);
});