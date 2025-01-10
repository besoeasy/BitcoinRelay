const axios = require("axios");

async function shorturl(url) {
  return axios
    .post(
      "https://spoo.me/",
      {
        url: url,
      },
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      return response.data.short_url || url;
    });
}

module.exports = {
  shorturl,
};
