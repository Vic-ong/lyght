import BaseModel from '@/models/BaseModel';
import { file } from '@/models/utils';

class Insurance extends BaseModel {
  constructor(params, options) {
    const validators = [
      file(),
      {
        key: 'provider',
        type: String,
      },
      {
        key: 'type',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default Insurance;
