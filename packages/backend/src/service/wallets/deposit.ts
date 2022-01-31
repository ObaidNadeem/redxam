require('dotenv').config();
import { InternalDeposits } from '@/database';
import { transporter } from '@/service/emailService';
import * as Sentry from '@sentry/node';
import { REDXAM_ADDRESS } from './consts';
import { createRawTx } from './index';
import blockchain from '../../apis/blockchain';

const { SERVICE_EMAIL } = process.env;

export const deposit = async (txsList, wallet, threshold, TX_FEE, isNode = false) => {
  const unspentInfo = await getUnspentInfo(txsList, wallet.address, isNode);

  if (unspentInfo.balance - TX_FEE > threshold) {
    try {
      const { hash } = createRawTx(
        {
          senderWIF: wallet.wif,
          receiverAddress: REDXAM_ADDRESS,
        },
        unspentInfo.outputs,
        isNode,
      );

      const txData = await blockchain.broadcastTx(hash);

      if (txData.status === 200) {
        await sendDepositMail(wallet, unspentInfo, threshold, txData.data.result);

        await InternalDeposits.create({
          amount: unspentInfo.balance - TX_FEE,
          hash: txData.data.result,
          userId: wallet.userId,
          address: wallet.address,
          timestamp: new Date().getTime(),
        });
        console.debug(`TxHash: ${txData.data.result}`);
      } else {
        throw txData.data.error;
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
};

const getUnspentInfo = async (txList, address, isNode) => {
  return isNode ? getUnspentInfoNode(address) : getUnspentInfoBlockchair(txList, address);
};

const getUnspentInfoBlockchair = (txList, address) => {
  // TODO: filter used ones
  const unspentOutputs = txList
    .map(tx => tx.outputs)
    .flat(1)
    .filter(tx => tx.is_spent === false && tx.recipient === address && tx.block_id > -1)
    .map((tx: any) => ({
      value: tx.value,
      txIndex: tx.index,
      txHash: tx.transaction_hash,
    }));

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  const unspentBalance = unspentOutputs.reduce((prev, curr) => (prev += curr.value), 0);
  return { outputs: unspentOutputs, balance: unspentBalance };
};

const getUnspentInfoNode = async address => {
  const outputs = await blockchain.getAddressUtxo(address);
  const unspentBalance = outputs
    .filter(({ height }) => height > 0)
    .reduce((prev, curr) => (prev += curr.value), 0);
  return { outputs, balance: unspentBalance };
};

const sendDepositMail = async (wallet, unspentInfo, threshold, txHash) => {
  await transporter.sendMail({
    from: `redxam.com <${SERVICE_EMAIL}>`,
    to: 'events.bitcoindeposits@redxam.com',
    subject: 'User balancer surpass threshold',
    html: `User: ${wallet.userId} has surpass the threshold: ${threshold} whit balance: ${unspentInfo.balance}
    a deposit has been made to the binance address with txHash: ${txHash}`,
  });
};
