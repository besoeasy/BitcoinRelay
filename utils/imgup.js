import axios from 'axios';
import FormData from 'form-data';

const apiKey = process.env.IMGBB_API_KEY;

const uploadToBlossom = async (buffer) => {
  const form = new FormData();
  form.append('file', buffer, 'image.png');

  const url = 'https://blossom.primal.net/upload';

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });
    const { data } = response;
    if (data && data.url) {
      return data.url;
    } else {
      console.error('Unexpected response format from Blossom:', data);
      return null; // Return null to indicate failure
    }
  } catch (error) {
    console.error(`Error uploading to Blossom: ${error.response?.data?.error || error.message}`);
    return null; // Return null to indicate failure
  }
};

const uploadToImgBB = async (buffer) => {
  const form = new FormData();
  form.append('image', buffer.toString('base64'));

  const headers = form.getHeaders();
  const url = `https://api.imgbb.com/1/upload?expiration=${86400 * 16}&key=${apiKey}`;

  try {
    const response = await axios.post(url, form, { headers });
    const { data } = response.data;
    if (data && data.url) {
      return data.url;
    } else {
      console.error('Unexpected response format from ImgBB:', response.data);
      return null; // Return null to indicate failure
    }
  } catch (error) {
    console.error(`Error uploading to ImgBB: ${error.response?.data?.error?.message || error.message}`);
    return null; // Return null to indicate failure
  }
};

const uploadToCatbox = async (buffer) => {
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('userhash', '');
  form.append('fileToUpload', buffer, 'image.png');

  const url = 'https://catbox.moe/user/api.php';

  try {
    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });
    if (response.data) {
      return response.data.trim();
    } else {
      console.error('Unexpected response format from Catbox:', response.data);
      return null; // Return null to indicate failure
    }
  } catch (error) {
    console.error(`Error uploading to Catbox: ${error.message}`);
    return null; // Return null to indicate failure
  }
};

async function uploadIMG(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Provided data is not a Buffer');
  }

  let imageUrl = null;

  // Try Blossom first
  imageUrl = await uploadToBlossom(buffer);
  if (imageUrl) {
    return imageUrl;
  }
  console.warn('Blossom upload failed. Falling back to ImgBB.');

  // Try ImgBB second
  if (apiKey) {
    imageUrl = await uploadToImgBB(buffer);
    if (imageUrl) {
      return imageUrl;
    }
    console.warn('ImgBB upload failed. Falling back to Catbox.');
  } else {
    console.warn('API key for ImgBB is not provided. Falling back to Catbox.');
  }

  // Try Catbox last
  imageUrl = await uploadToCatbox(buffer);
  if (imageUrl) {
    return imageUrl;
  }

  console.error('All upload services (Blossom, ImgBB, and Catbox) failed.');
  throw new Error('Image upload failed.');
}

export {
  uploadIMG,
};