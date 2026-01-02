import axios from "axios";
import FormData from "form-data";

const uploadToFiledrop = async (buffer, filename = "image.png") => {
  const form = new FormData();
  form.append("file", buffer, filename);

  const url = "https://filedrop.besoeasy.com/upload";

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    if (response.data) {
      if (typeof response.data === "string") return response.data.trim();
      if (response.data.url) return response.data.url;
      if (response.data.path) return response.data.path;
    }

    console.error("Unexpected response format from Filedrop:", response.data);
    return null;
  } catch (error) {
    console.error(`Error uploading to Filedrop: ${error.message}`);
    return null;
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
      return null; // Return null to indicate failure
    }
  } catch (error) {
    console.error(`Error uploading to Catbox: ${error.message}`);
    return null; // Return null to indicate failure
  }
};

async function uploadIMG(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError("Provided data is not a Buffer");
  }

  let imageUrl = null;

  // Try Filedrop
  imageUrl = await uploadToFiledrop(buffer);
  if (imageUrl) return imageUrl;
  console.warn("Filedrop upload failed.");

  // Try Catbox
  imageUrl = await uploadToCatbox(buffer);
  if (imageUrl) return imageUrl;

  throw new Error("Image upload failed.");
}

export { uploadIMG };
