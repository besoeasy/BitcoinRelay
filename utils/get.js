import axios from 'axios';

async function axiosGet(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export {
  axiosGet,
};