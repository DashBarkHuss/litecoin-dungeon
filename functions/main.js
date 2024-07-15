// public/main.js
document.getElementById("fetch-data").addEventListener("click", () => {
  fetch("/.netlify/functions/fetch-data")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(
        "price"
      ).innerText = `Litecoin Price: ${data.litecoin.usd} USD`;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
