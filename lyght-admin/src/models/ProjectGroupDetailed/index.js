import BaseModel from '@/models/BaseModel';
import { file } from '@/models/utils';

class ProjectGroupDetailed extends BaseModel {
  constructor(params, options) {
    const validators = [
      file('fileOngridCert'),
      file('filePpaContract'),
      file('fileRentalContract'),
      {
        key: 'publicIdentifier',
        type: String,
      },
      {
        key: 'ppaSerialNumber',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default ProjectGroupDetailed;
