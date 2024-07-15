// functions/fetch-data.js
import nodefetch from "node-fetch";
exports.handler = async function (event, context) {
  const response = await nodefetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd"
  );
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
