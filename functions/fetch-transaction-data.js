// functions/fetch-transaction-data.js
const BlockcypherApi = require("../blockcypherApi");
// const AnotherApi = require("../anotherApi");

const apiProvider = process.env.API_PROVIDER || "blockcypher";
let blockchainApi;

if (apiProvider === "blockcypher") {
  blockchainApi = new BlockcypherApi("https://api.blockcypher.com");
} else if (apiProvider === "anotherapi") {
  console.log("Using Another API");
  // blockchainApi = new AnotherApi("https://api.anotherapi.com");
}

exports.handler = async function (event, context) {
  const { ltcAddress } = event.queryStringParameters;

  try {
    const receivedTransactions = await blockchainApi.fetchReceivedTransactions(
      ltcAddress
    );
    const totalReceived = await blockchainApi.getTotalReceived(
      receivedTransactions,
      ltcAddress
    );
    const uniqueSenders = await blockchainApi.getUniqueSenders(
      receivedTransactions,
      ltcAddress
    );
    const largestSend = await blockchainApi.getLargestSend(
      receivedTransactions,
      ltcAddress
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        address: ltcAddress,
        total_received: totalReceived,
        received_count: receivedTransactions.length,
        txs: receivedTransactions,
        unique_senders: uniqueSenders,
        largest_send: largestSend,
      }),
    };
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
