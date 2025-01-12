const axios = require("axios");

async function axiosGet(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error.response?.data || error.message);
    return null;
  }
}

module.exports = {
  axiosGet,
};
