import get from 'lodash/get';

export const setError = (err, log = true) => {
  if (log) console.error(err.code || err);
  return {
    text: err.message || err,
    color: 'error',
  };
};

export const parseError = (err) => {
  let message = '';
  const status = get(err, 'response.status');

  switch (status) {
    case 403:
      message = '⛔️ Unauthorized!';
      break;
    case 500:
      message = '⚠️ Internal Error! Please contact our support team at info@lyght.com.tw';
      break;
    default:
      message = '⚠️ Internal Error! Please contact our support team at info@lyght.com.tw';
      break;
  }

  return {
    status,
    message,
  };
};
