import { Deposits, DepositsType, DepositsCurrencyType, User } from '@/database';

export const updateUserDeposits = async (txList, currentUserWallet, isNode = false) => {
  if (txList.length > currentUserWallet.txsCount || currentUserWallet.hasPendingTxs) {
    let hasPendingTxs = false;

    const userTxs = getUserTxList(txList, currentUserWallet.address, isNode);
    for (const tx of userTxs) {
      const status = tx.block_id > 0 ? 'completed' : 'pending';
      if (tx.block_id === -1) hasPendingTxs = true;

      await Deposits.updateOne(
        { userId: currentUserWallet.userId, hash: tx.txHash },
        {
          $set: {
            userId: currentUserWallet.userId,
            address: currentUserWallet.address,
            index: tx.txIndex,
            type: DepositsType.CRYPTO,
            currency: DepositsCurrencyType.BTC,
            processedByRedxam: false,
            hash: tx.txHash,
            amount: tx.value,
            status,
          },
          $setOnInsert: {
            timestamp: Date.now(),
          },
        },
        {
          upsert: true,
        },
      );
    }

    await User.updateOne(
      {
        _id: currentUserWallet.userId,
      },
      {
        $set: { hasPendingTxs, 'wallet.txsCount': txList.lenght },
      },
    );
  }
};

const getUserTxList = (transactionsList, address, isNode) => {
  return isNode
    ? getUserTxListNode(transactionsList, address)
    : getUserTxListBlockChair(transactionsList, address);
};

const getUserTxListBlockChair = (transactionsList, address) => {
  console.log(address);
  return transactionsList
    .map(tx => tx.outputs)
    .flat(1)
    .filter(tx => tx.recipient === address)
    .map((tx: any) => ({
      block_id: tx.block_id,
      value: tx.value,
      txIndex: tx.index,
      txHash: tx.transaction_hash,
    }));
};

const getUserTxListNode = (transactionsList, address) => {
  const userTxs = [];

  transactionsList.forEach(tx => {
    const outputs = tx.outputs.filter(output => output.address === address);
    outputs.forEach((out, index) =>
      userTxs.push({
        block_id: tx.height,
        value: out.value,
        txIndex: index,
        txHash: tx.hash,
      }),
    );
  });

  return userTxs;
};
