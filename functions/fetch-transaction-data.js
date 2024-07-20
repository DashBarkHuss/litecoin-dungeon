// functions/fetch-transaction-data.js
import nodeFetch from "node-fetch";

exports.handler = async function (event, context) {
  const { ltcAddress } = event.queryStringParameters;
  const apiUrl = `https://api.blockcypher.com/v1/ltc/main/addrs/${ltcAddress}/full`;
  const response = await nodeFetch(apiUrl);
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
