/**
 * Error code based on https://firebase.google.com/docs/auth/admin/errors
 * @param {string} code
 */
export const getErrorTextKey = (code) => {
  switch (code) {
    case 'auth/invalid-email':
    case 'auth/invalid-password':
      return 'Status-Auth-WrongCredentials';

    case 'auth/account-exists-with-different-credential':
      return 'Status-Auth-AccountExistedUseGoogle';

    case 'auth/phone-number-already-exists':
    case 'auth/email-already-exists':
      return 'Status-Auth-AccountExisted';

    default:
      return 'Status-Auth-InternalError';
  }
};

export const getErrorMessage = (err, translate) => {
  if (err) {
    if (err.code) {
      const textKey = getErrorTextKey(err.code);
      return translate(textKey, { contact: process.env.VUE_APP_SUPPORT_EMAIL });
    }
    return err.message || err;
  }
  return translate('Status-InternalError');
};
