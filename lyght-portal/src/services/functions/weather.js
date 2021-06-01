import axios from 'axios';
import baseUrl from './config';

export const fetchCurrentWeather = (params) => {
  return axios.post(`${baseUrl}/weather/current`, {
    city: params.city,
    lang: params.lang,
  });
};
