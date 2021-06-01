import axios from 'axios';
import firebase from '@/services/firebase';
import baseUrl from './config';

export const sendCode = async (params) => {
  const idToken = await firebase.auth().currentUser.getIdToken();

  return axios.post(`${baseUrl}/auth/phone/sendCode`, {
    idToken,
    userId: params.userId,
    phoneNumber: params.phoneNumber,
    recaptchaToken: params.recaptchaToken,
  });
};

export const verifyCode = async (params) => {
  const idToken = await firebase.auth().currentUser.getIdToken();

  return axios.post(`${baseUrl}/auth/phone/verifyCode`, {
    idToken,
    code: params.code,
    sessionInfo: params.sessionInfo,
  });
};

export const sendEmailAccountApproved = async (params) => {
  const idToken = await firebase.auth().currentUser.getIdToken();

  return axios.post(`${baseUrl}/broadcast/accountApproved`, {
    idToken,
    to: params.to,
    lang: params.lang,
    params: params.params,
  });
};

export const sendEmailOrderPaid = async (params) => {
  const idToken = await firebase.auth().currentUser.getIdToken();

  return axios.post(`${baseUrl}/broadcast/orderPaid`, {
    idToken,
    to: params.to,
    lang: params.lang,
    params: params.params,
  });
};

export const sendEmailOrderCancelled = async (params) => {
  const idToken = await firebase.auth().currentUser.getIdToken();

  return axios.post(`${baseUrl}/broadcast/orderCancelled`, {
    idToken,
    to: params.to,
    lang: params.lang,
    params: params.params,
  });
};
