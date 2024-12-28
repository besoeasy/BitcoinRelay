const axios = require("axios");
const FormData = require("form-data");

async function getBitcoinPrice() {
  try {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );

    return response.data.bpi.USD.rate;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

async function uploadToImgbb(apiKey, buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Provided data is not a Buffer");
  }

  const form = new FormData();
  form.append("image", buffer.toString("base64"));

  try {
    const headers = form.getHeaders();
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`,
      form,
      { headers }
    );

    console.log("Image URL:", response.data.data.url);

    return response.data.data.url;
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = {
  getBitcoinPrice,
  uploadToImgbb,
};
