const dotenv = require('dotenv');
const locations = require('./locations.json');

dotenv.config();

const apiKey = process.env.ACCUWEATHER_APIKEY;

const baseUrl = 'http://dataservice.accuweather.com';

const getLocationKey = (city) => {
  const location = locations.find((loc) => city.toLowerCase().includes(loc.name));
  return location.key;
};

module.exports = {
  apiKey,
  baseUrl,
  getLocationKey,
};
