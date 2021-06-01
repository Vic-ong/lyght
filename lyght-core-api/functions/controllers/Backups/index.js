const firestore = require('@google-cloud/firestore');

const client = new firestore.v1.FirestoreAdminClient();

class BackupsController {
  /**
   * Backup production data
   */
  static backupFirestore({ outputUriPrefix, collectionIds }) {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix,
        collectionIds,
      })
      .then(([response]) => {
        console.log(`Operation Name: ${response.name}`);
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Export operation failed');
      });
  }
}

module.exports = BackupsController;
