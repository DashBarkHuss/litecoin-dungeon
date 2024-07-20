// functions/fetch-ltc-price.js
import nodeFetch from "node-fetch";

exports.handler = async function (event, context) {
  const priceApiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd`;
  const response = await nodeFetch(priceApiUrl);
  const priceData = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(priceData),
  };
};
