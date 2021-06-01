const { firebase } = require('@/services/firebase');
const User = require('@/models/User');

class AuthController {
  /**
   * Set custom claims on user for data access security
   */
  static async setUserClaims(change, context) {
    const id = context.params.accessId;
    const { email, isEditor = false, isAdmin = false } = change.after.data();
    const params = { isEditor, isAdmin };

    try {
      await User.updateCustomClaims(id, params);
      console.log(`${email} access --> isEditor: ${isEditor}; isAdmin: ${isAdmin}`);
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Set custom claims on user for data access security
   */
  static async deleteUserData(user) {
    const { uid } = user;

    try {
      User.deleteUser(uid);
      User.deleteAccess(uid);

      const promises = [];
      const bucket = firebase.storage().bucket();

      const identityFilesArray = await bucket.getFiles({ directory: `users/${uid}/identity` });
      const identityFiles = identityFilesArray[0];
      identityFiles.forEach((f) => {
        promises.push(f.delete());
      });

      const bankAccountFilesArray = await bucket.getFiles({ directory: `users/${uid}/bank_accounts` });
      const bankAccountFiles = bankAccountFilesArray[0];
      bankAccountFiles.forEach((f) => {
        promises.push(f.delete());
      });

      await Promise.all(promises);

      const querySnapshot = await User.getUserBankAccounts(uid);
      querySnapshot.forEach((doc) => {
        User.deleteUserBankAccount(uid, doc.id);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = AuthController;
