const axios = require("axios");
const FormData = require("form-data");

async function uploadToImgbb(apiKey, buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Provided data is not a Buffer");
  }

  const form = new FormData();
  form.append("image", buffer.toString("base64"));

  try {
    const headers = form.getHeaders();
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?expiration=15550000&key=${apiKey}`,
      form,
      { headers }
    );

    return response.data.data.url || "";
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response?.data || error.message
    );
    return "";
  }
}

module.exports = {
  uploadToImgbb,
};
