require('module-alias/register');

const functions = require('firebase-functions');
const Auth = require('@/controllers/Auth');
const Backups = require('@/controllers/Backups');

const app = require('./app');

const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;

// List of functions
exports.api = functions.https.onRequest(app.callback());

exports.updateAccess = functions.firestore.document('access/{accessId}').onUpdate(Auth.setUserClaims);

exports.deleteUserData = functions.auth.user().onDelete(Auth.deleteUserData);

if (projectId === 'lyght-prod') {
  exports.backupFirestore = functions.pubsub.schedule('every 6 hours').onRun(() => {
    Backups.backupFirestore({
      outputUriPrefix: 'gs://lyght-prod-backups',
      collectionIds: [],
    });
  });
}
