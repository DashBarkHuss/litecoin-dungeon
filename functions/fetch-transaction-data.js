// functions/fetch-transaction-data.js
import nodeFetch from "node-fetch";

exports.handler = async function (event, context) {
  const { ltcAddress } = event.queryStringParameters;
  const limit = 50; // maximum number of transactions per request
  let hasMore = true;
  let before = undefined; // used for pagination
  let allSenders = new Set();
  let allTransactions = [];

  while (hasMore) {
    let apiUrl = `https://api.blockcypher.com/v1/ltc/main/addrs/${ltcAddress}/full?limit=${limit}`;
    if (before) {
      apiUrl += `&before=${before}`;
    }

    const response = await nodeFetch(apiUrl);
    const data = await response.json();

    // Store transactions for the final response
    allTransactions = allTransactions.concat(data.txs);

    // Extract senders from the transactions
    if (data.txs && data.txs.length > 0) {
      data.txs.forEach((tx) => {
        tx.inputs.forEach((input) => {
          input.addresses.forEach((address) => {
            allSenders.add(address);
          });
        });
      });

      // Set the 'before' variable to the block height of the last transaction for pagination
      before = data.txs[data.txs.length - 1].block_height;
    } else {
      hasMore = false; // No more transactions to fetch
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      address: ltcAddress,
      total_received: allTransactions.reduce((acc, tx) => acc + tx.total, 0),
      total_sent: allTransactions.reduce((acc, tx) => acc + (tx.fees || 0), 0),
      balance:
        allTransactions.reduce((acc, tx) => acc + tx.total, 0) -
        allTransactions.reduce((acc, tx) => acc + (tx.fees || 0), 0),
      n_tx: allTransactions.length,
      txs: allTransactions,
      allSenders: [...allSenders],
    }),
  };
};
