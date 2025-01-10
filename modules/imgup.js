const axios = require("axios");
const FormData = require("form-data");

const apiKey = process.env.IMGBB_API_KEY;

const uploadToImgBB = async (buffer) => {
  const form = new FormData();
  form.append("image", buffer.toString("base64"));

  const headers = form.getHeaders();
  const url = `https://api.imgbb.com/1/upload?expiration=15550000&key=${apiKey}`;

  try {
    const response = await axios.post(url, form, { headers });
    const { data } = response.data;
    if (data && data.url) {
      return data.url;
    } else {
      console.error("Unexpected response format from ImgBB:", response.data);
      return "";
    }
  } catch (error) {
    console.error(
      `Error uploading to ImgBB: ${
        error.response?.data?.error?.message || error.message
      }`
    );
    return "";
  }
};

const uploadToCatbox = async (buffer) => {
  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("userhash", "");
  form.append("fileToUpload", buffer, "image.png");

  const url = "https://catbox.moe/user/api.php";

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });
    if (response.data) {
      return response.data.trim();
    } else {
      console.error("Unexpected response format from Catbox:", response.data);
      return "";
    }
  } catch (error) {
    console.error(`Error uploading to Catbox: ${error.message}`);
    return "";
  }
};

async function uploadIMG(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("Provided data is not a Buffer");
  }

  if (apiKey) {
    return await uploadToImgBB(buffer);
  } else {
    console.warn("API key for ImgBB is not provided. Falling back to Catbox.");
    return await uploadToCatbox(buffer);
  }
}

module.exports = {
  uploadIMG,
};
