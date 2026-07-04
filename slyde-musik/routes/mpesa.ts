import express from 'express';
import axios from 'axios';

const router = express.Router();

const E2PAYMENTS_URL = 'https://e2payments.explicador.co.mz';

// Payment route
router.post('/pay', async (req, res) => {
  console.log('Recebida requisição de pagamento:', req.body);
  try {
    const { amount, phoneNumber, reference } = req.body;
    const clientId = process.env.E2PAYMENTS_CLIENT_ID;
    const secretKey = process.env.E2PAYMENTS_SECRET_KEY;
    const walletId = process.env.E2PAYMENTS_WALLET_ID;

    if (!clientId || !secretKey) {
      throw new Error('Credenciais E2Payments não configuradas.');
    }

    console.log('Autenticando no E2Payments...');
    const authResponse = await axios.post(`${E2PAYMENTS_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: secretKey
    });

    const token = `${authResponse.data.token_type} ${authResponse.data.access_token}`;
    console.log('Autenticação bem-sucedida.');

    let targetWalletId = walletId;

    // Se não houver walletId configurada, buscamos a primeira disponível
    if (!targetWalletId) {
      console.log('Buscando carteiras disponíveis...');
      const walletsResponse = await axios.post(`${E2PAYMENTS_URL}/v1/wallets/mpesa/get/all`, {
        client_id: clientId
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      // A resposta pode vir como data ou dentro de data.data dependendo do axios/api
      const wallets = walletsResponse.data.data || walletsResponse.data;
      
      if (!wallets || wallets.length === 0) {
        throw new Error('Nenhuma carteira M-Pesa encontrada para esta conta.');
      }
      targetWalletId = wallets[0].id;
      console.log(`Usando carteira extraída: ${targetWalletId}`);
    }

    console.log('Iniciando pagamento C2B...');
    const paymentResponse = await axios.post(`${E2PAYMENTS_URL}/v1/c2b/mpesa-payment/${targetWalletId}`, {
      amount,
      phonenumber: phoneNumber,
      reference,
      client_id: clientId
    }, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    console.log('Resposta do pagamento:', paymentResponse.data);
    res.json(paymentResponse.data);
  } catch (error: any) {
    const errorData = error.response?.data || error.message;
    console.error('Erro E2Payments:', errorData);
    res.status(500).json({ 
      error: 'Falha ao processar pagamento.', 
      details: errorData 
    });
  }
});

export default router;
