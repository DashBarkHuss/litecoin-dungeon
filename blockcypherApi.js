// blockcypherApi.js
import fetch from "node-fetch";
const BlockchainApi = require("./blockchainApi");

class BlockcypherApi extends BlockchainApi {
  constructor() {
    super();
    this.baseUrl = "https://api.blockcypher.com/v1/ltc/main";
  }

  async fetchAllTransactions(address) {
    const limit = 50; // maximum number of transactions per request
    let hasMore = true;
    let before = undefined; // used for pagination
    let allTransactions = [];

    while (hasMore) {
      let apiUrl = `${this.baseUrl}/addrs/${address}/full?limit=${limit}`;
      if (before) {
        apiUrl += `&before=${before}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.error) {
        console.error("Error fetching transaction data:", data.error);
        throw new Error(data.error);
      }

      allTransactions = allTransactions.concat(data.txs);

      if (data.txs && data.txs.length > 0) {
        before = data.txs[data.txs.length - 1].block_height;
      } else {
        hasMore = false;
      }
    }

    return allTransactions;
  }

  async fetchReceivedTransactions(recipientAddress) {
    const allTransactions = await this.fetchAllTransactions(recipientAddress);
    const sentTransactions = allTransactions.filter((tx) =>
      tx.outputs.some((output) => output.addresses.includes(recipientAddress))
    );
    return sentTransactions;
  }

  async getTotalReceived(transactions, recipientAddress) {
    return transactions.reduce((acc, tx) => {
      return (
        acc +
        tx.outputs.reduce((sum, output) => {
          // only count received transactions to the address
          if (output.addresses.includes(recipientAddress)) {
            return sum + output.value;
          }
          return sum;
        }, 0)
      );
    }, 0);
  }

  async getUniqueSenders(transactions, recipientAddress) {
    const uniqueSenders = new Set();
    transactions.forEach((tx) => {
      tx.inputs.forEach((input) => {
        input.addresses.forEach((address) => {
          // check if the address is not the same as the recipient
          if (address !== recipientAddress) {
            uniqueSenders.add(address);
          }
        });
      });
    });
    return uniqueSenders.size;
  }

  async getLargestSend(transactions, recipientAddress) {
    let largestSend = 0;
    transactions.forEach((tx) => {
      // Check if the recipient address is not in the inputs (meaning it did not send the transaction)
      const isSentFromRecipient = tx.inputs.some((input) =>
        input.addresses.includes(recipientAddress)
      );
      console.log("isSentFromRecipient", isSentFromRecipient);
      if (!isSentFromRecipient) {
        tx.outputs.forEach((output) => {
          if (
            output.value > largestSend &&
            output.addresses.includes(recipientAddress)
          ) {
            largestSend = output.value;
          }
        });
      }
    });
    return largestSend;
  }
}

module.exports = BlockcypherApi;
