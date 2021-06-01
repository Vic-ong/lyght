import BaseModel from '@/models/BaseModel';
import { uuid } from '@/models/utils';

class Panel extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('projectGroupId', { optional: true }),
      uuid('userId', { optional: true }),
      uuid('orderId', { optional: true }),
      uuid('suffixId'),
    ];

    super({ params, validators, options });
  }
}

export default Panel;
