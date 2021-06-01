const { firebase } = require('@/services/firebase');

class Auth {
  constructor(idToken) {
    this.idToken = idToken;
    this.claims = null;
    this.emailVerified = null;
    this.isAdmin = null;
    this.readAccess = null;
    this.writeAccess = null;
  }

  async verifyIdToken(idToken) {
    if (!this.claims) {
      this.claims = await firebase.auth().verifyIdToken(idToken);
    }
  }

  async verifyEmail() {
    if (!this.claims) {
      await this.verifyIdToken(this.idToken);
    }

    this.emailVerified =
      typeof this.claims.email !== 'undefined' &&
      typeof this.claims.email_verified !== 'undefined' &&
      this.claims.email_verified;
  }

  async verifyAdmin() {
    if (!this.claims) {
      await this.verifyIdToken(this.idToken);
    }

    this.isAdmin = this.claims.isAdmin === true;
  }

  async hasAdminClaims() {
    await this.verifyIdToken(this.idToken);
    await this.verifyAdmin();
    await this.verifyEmail();

    return this.claims && this.emailVerified && this.isAdmin;
  }

  async hasReadAccess() {
    await this.verifyIdToken(this.idToken);
    await this.verifyEmail();

    const result = this.claims && this.emailVerified;
    this.readAccess = result;
    return result;
  }

  async hasWriteAccess() {
    await this.verifyIdToken(this.idToken);
    await this.verifyAdmin();
    await this.verifyEmail();

    const result = this.claims && (this.emailVerified || this.isAdmin);
    this.writeAccess = result;
    return result;
  }

  async verifyAll() {
    await this.hasAdminClaims();
    await this.hasReadAccess();
    await this.hasWriteAccess();
  }
}

module.exports = Auth;
