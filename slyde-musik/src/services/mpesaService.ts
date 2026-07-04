import axios from 'axios';
import crypto from 'node:crypto';

const MPESA_API_URL = 'https://openapi.m-pesa.com';
const SESSION_PATH = '/sandbox/ipg/v2/vodafoneGHA/getSession/';

export async function getMpesaSessionKey(): Promise<string> {
  const apiKey = process.env.MPESA_API_KEY;
  const publicKey = process.env.MPESA_PUBLIC_KEY;

  console.log('API Key exists:', !!apiKey);
  console.log('Public Key exists:', !!publicKey);

  if (!apiKey || !publicKey) {
    throw new Error('M-Pesa API Key or Public Key is missing.');
  }

  // 1. Encrypt the API Key using RSA
  // M-Pesa usually expects the public key in a specific format (PEM)
  
  // Ensure the public key is correctly formatted as PEM
  let formattedPublicKey = publicKey;
  let keyType: 'spki' | 'pkcs1' = 'spki';
  
  if (!publicKey.includes('BEGIN PUBLIC KEY') && !publicKey.includes('BEGIN RSA PUBLIC KEY')) {
    formattedPublicKey = `-----BEGIN PUBLIC KEY-----\n${publicKey.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
  } else if (publicKey.includes('BEGIN RSA PUBLIC KEY')) {
    keyType = 'pkcs1';
  }

  const buffer = Buffer.from(apiKey, 'utf-8');
  
  try {
    let key;
    try {
      console.log('Creating public key (SPKI)...');
      key = crypto.createPublicKey({
        key: formattedPublicKey,
        format: 'pem',
        type: 'spki'
      });
      console.log('Public key created successfully (SPKI).');
    } catch (e) {
      console.log('Failed to create public key with SPKI, trying PKCS1...');
      try {
        key = crypto.createPublicKey({
          key: formattedPublicKey,
          format: 'pem',
          type: 'pkcs1'
        });
        console.log('Public key created successfully (PKCS1).');
      } catch (e2) {
        console.error('Failed to create public key with format:', keyType, 'error:', e2);
        // Fallback: Try base64 DER format
        try {
          console.log('Trying DER fallback...');
          key = crypto.createPublicKey({
            key: Buffer.from(publicKey, 'base64'),
            format: 'der',
            type: 'spki'
          });
          console.log('DER fallback successful.');
        } catch (e3) {
          console.error('Failed to create public key with DER fallback:', e3);
          throw new Error('Invalid M-Pesa Public Key format. Please ensure it is a valid RSA public key.');
        }
      }
    }

    console.log('Encrypting API key...');
    const encrypted = crypto.publicEncrypt(
      {
        key: key,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    console.log('API key encrypted successfully.');
    const encryptedApiKey = encrypted.toString('base64');

    // 2. Make the GET request
    console.log('Making request to M-Pesa session endpoint...');
    const response = await axios.get(`${MPESA_API_URL}${SESSION_PATH}`, {
      headers: {
        'Authorization': `Bearer ${encryptedApiKey}`,
        'Origin': '*'
      }
    });
    console.log('Session key request successful.');

    // Assuming the session key is in the body, e.g., response.data.output_SessionID
    return response.data.output_SessionID;
  } catch (error) {
    console.error('Error in M-Pesa encryption or request:', error);
    throw new Error('Failed to process M-Pesa request: ' + (error instanceof Error ? error.message : String(error)));
  }
}
