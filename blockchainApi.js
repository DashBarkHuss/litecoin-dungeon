// blockchainApi.js
class BlockchainApi {
  async fetchAllTransactions(address) {
    throw new Error("Method not implemented");
  }
  async fetchAllReceivedTransactions(address) {
    throw new Error("Method not implemented");
  }

  async getTotalReceived(transactions) {
    throw new Error("Method not implemented");
  }

  async getUniqueSenders(transactions) {
    throw new Error("Method not implemented");
  }

  async getLargestSend(transactions) {
    throw new Error("Method not implemented");
  }
}

module.exports = BlockchainApi;
