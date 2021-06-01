import BaseModel from './BaseModel';
import { uuid, currency } from './utils';

class Transaction extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('projectId'),
      uuid('projectGroupId'),
      uuid('userId'),
      uuid('bankAccountId'),
      currency('unitCost'),
      currency('total'),
      {
        key: 'orderNumber',
        type: String,
      },
      {
        key: 'item',
        type: String,
      },
      {
        key: 'quantity',
        type: Number,
      },
      {
        key: 'status',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default Transaction;
