const { firebase, firestore } = require('@/services/firebase');
const { compressObject } = require('./utils');

const collectionRef = firestore.collection('projects');

class Project {
  constructor(data = {}) {
    this.panelsReserved = firebase.firestore.FieldValue.increment(Number(data.panelsReservedIncrement));
  }

  updateDoc(id, process) {
    const payload = this.toJson();
    if (process) {
      return process.update(collectionRef.doc(id), payload);
    }
    return collectionRef.doc(id).update(payload);
  }

  toJson() {
    const obj = {
      panels_reserved: this.panelsReserved,
    };

    compressObject(obj);
    return obj;
  }
}

module.exports = Project;
