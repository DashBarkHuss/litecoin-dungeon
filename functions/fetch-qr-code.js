// functions/fetch-qr-code.js
import nodeFetch from "node-fetch";

exports.handler = async function (event, context) {
  const { ltcAddress } = event.queryStringParameters;
  const response = await nodeFetch(
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ltcAddress}`
  );

  const qrCodeUrl = response.url; // Assuming the API returns a URL for the QR code
  return {
    statusCode: 200,
    body: JSON.stringify({ qrCodeUrl }),
  };
};
