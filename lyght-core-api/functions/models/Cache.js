const { firestore } = require('@/services/firebase');

const CACHE_COLLECTION = 'caches';

class Cache {
  static getData(id) {
    return firestore.collection(CACHE_COLLECTION).doc(id).get();
  }

  static createData(params) {
    const { id } = params;
    const requestParams = {
      data: params.data,
      ttl: params.ttl,
    };

    return firestore.collection(CACHE_COLLECTION).doc(id).set(requestParams);
  }
}

module.exports = Cache;
