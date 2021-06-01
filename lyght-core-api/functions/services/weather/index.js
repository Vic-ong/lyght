const axios = require('axios');
const { baseUrl, apiKey, getLocationKey } = require('./config');

const fetchCurrentWeather = (param) => {
  const { city = 'taipei', lang = 'en-US' } = param;
  return axios.get(
    `${baseUrl}/currentconditions/v1/${getLocationKey(city)}?apikey=${apiKey}&language=${lang}&details=false`,
  );
};

module.exports = {
  fetchCurrentWeather,
};
