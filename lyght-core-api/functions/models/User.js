const { firebase, firestore } = require('@/services/firebase');
const { setCreateRequest } = require('./utils');

const ACCESS_COLLECTION = 'access';
const USERS_COLLECTION = 'users';
const BANK_ACCOUNTS_COLLECTION = 'bank_accounts';
const accessRef = firestore.collection(ACCESS_COLLECTION);
const userRef = firestore.collection(USERS_COLLECTION);

class User {
  static updateUserAuth(id, params) {
    return firebase.auth().updateUser(id, params);
  }

  static createAccess(id, params) {
    const requestParams = setCreateRequest({
      email: params.email,
    });

    return accessRef.doc(id).set(requestParams);
  }

  static updateCustomClaims(id, params) {
    // Set custom user claims on this update.
    return firebase.auth().setCustomUserClaims(id, params);
  }

  static deleteAccess(id) {
    return accessRef.doc(id).delete();
  }

  static getUserBankAccounts(id) {
    return userRef.doc(id).collection(BANK_ACCOUNTS_COLLECTION).get();
  }

  static async deleteUserBankAccount(userId, id) {
    return userRef.doc(userId).collection(BANK_ACCOUNTS_COLLECTION).doc(id).delete();
  }

  static async deleteUser(id) {
    return userRef.doc(id).delete();
  }
}

module.exports = User;
