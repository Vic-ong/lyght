import axios from 'axios';
import get from 'lodash/get';
import firebase from '@/services/firebase';
import { parseError } from '@/utils/errors';
import baseUrl from './config';

const refreshAuth = () => {
  return firebase.auth().currentUser.reload();
};

export const sendCode = async (params) => {
  await refreshAuth();
  const idToken = await firebase.auth().currentUser.getIdToken(true);

  try {
    const res = await axios.post(`${baseUrl}/auth/phone/sendCode`, {
      idToken,
      userId: params.userId,
      phoneNumber: params.phoneNumber,
      recaptchaToken: params.recaptchaToken,
    });
    return res;
  } catch (err) {
    let message = '';
    const status = get(err, 'response.status');
    const errorMsg = get(err, 'response.data.error');
    console.error(errorMsg);

    switch (status) {
      case 403:
        message = '⛔️ Unauthorized!';
        break;
      case 500:
        if (errorMsg.includes('phone number already exists')) {
          message = 'Phone number already exists! Please use another number.';
        } else if (errorMsg.includes('INVALID_PHONE_NUMBER')) {
          message = 'Invalid phone number! Please try again.';
        } else if (errorMsg.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
          message = 'Too many attempts detected! Please try again later.';
        } else {
          message = '⚠️ Internal Error! Please contact our support team at info@lyght.com.tw';
        }
        break;
      default:
        message = '⚠️ Internal Error! Please contact our support team at info@lyght.com.tw';
        break;
    }
    throw new Error(message);
  }
};

export const verifyCode = async (params) => {
  await refreshAuth();
  const idToken = await firebase.auth().currentUser.getIdToken(true);

  try {
    return axios.post(`${baseUrl}/auth/phone/verifyCode`, {
      idToken,
      code: params.code,
      sessionInfo: params.sessionInfo,
    });
  } catch (err) {
    const error = parseError(err);
    throw new Error(error.message);
  }
};
