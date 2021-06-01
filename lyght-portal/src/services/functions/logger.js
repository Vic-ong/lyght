import axios from 'axios';
import firebase from '@/services/firebase';
import { parseError } from '@/utils/errors';
import baseUrl from './config';

const refreshAuth = () => {
  return firebase.auth().currentUser.reload();
};

export const logger = async (params) => {
  await refreshAuth();
  const idToken = await firebase.auth().currentUser.getIdToken(true);

  try {
    return axios.post(`${baseUrl}/logger`, {
      idToken,
      params,
    });
  } catch (err) {
    const error = parseError(err);
    throw new Error(error.message);
  }
};
