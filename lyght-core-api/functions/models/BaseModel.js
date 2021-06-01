const { firebase } = require('@/services/firebase');

class BaseModel {
  constructor(user = {}) {
    this.owner = { _id: user._id, name: user.displayName };
    this.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  }

  hasData(v) {
    return v === null || !!v || v === 0 || v === false;
  }

  getCreatedTime() {
    return {
      created_at: this.timestamp,
      created_by: this.owner,
    };
  }

  getUpdatedTime() {
    return {
      updated_at: this.timestamp,
      updated_by: this.owner,
    };
  }
}

module.exports = BaseModel;
