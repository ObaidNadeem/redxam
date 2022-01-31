import axiosModule from 'axios';

const {
  BLOCKCHAIN_URL,
  BLOCKCHAIN_KEY,
  BLOCKCHAIN_TESTNET_URL,
  BLOCKCHAIN_TESTNET_KEY,
  NODE_ENV,
} = process.env;

const axios = axiosModule.create({
  baseURL: NODE_ENV === 'production' ? BLOCKCHAIN_URL : BLOCKCHAIN_TESTNET_URL,
  auth: {
    username: 'x',
    password: NODE_ENV === 'production' ? BLOCKCHAIN_KEY : BLOCKCHAIN_TESTNET_KEY,
  },
});

const getTx = async (txHash: String) => {
  try {
    const tx = (await axios.get(`/tx/${txHash}`)).data;
    return { status: 200, tx };
  } catch (error) {
    return { status: 404, tx: null };
  }
};

const getTxByAddress = async (address: String) => {
  let addressTxs = [];
  let areMoreThanHundred = false;
  let lastTxId = 0;

  try {
    do {
      const txs = (
        await axios.get(
          `/tx/address/${address}${areMoreThanHundred ? `?after=${lastTxId}` : ''} `,
        )
      ).data;
      if (txs.length < 1) break;
      addressTxs = addressTxs.concat(txs);
      areMoreThanHundred = txs.length > 99;
      lastTxId = txs[txs.length - 1].hash;
    } while (areMoreThanHundred);
    return { status: 200, txs: addressTxs };
  } catch (error) {
    return { status: 404, txs: null };
  }
};

const getAddressUtxo = async (address: String) =>
  (await axios.get(`/coinbyaddr/${address}`)).data;

const getAddressBalance = async (address: String) => {
  const utxo = (await axios.get(`/coinbyaddr/${address}`)).data;
  let balance = 0;
  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  utxo.forEach(({ value }) => (balance += value));
  return balance;
};

const broadcastTx = async txHash =>
  axios.post('/', { method: 'sendrawtransaction', params: [txHash] });

const isNodeOn = async () => (await axios.post('/', { method: 'ping' })).status === 200;

export default {
  broadcastTx,
  getTx,
  getTxByAddress,
  isNodeOn,
  getAddressUtxo,
  getAddressBalance,
};
