import BaseModel from '@/models/BaseModel';
import { uuid } from '@/models/utils';

class PaymentDistribution extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('userId'),
      {
        key: 'currency',
        type: String,
      },
      {
        key: 'partition',
        type: Number,
      },
      {
        key: 'revenue',
        type: Number,
      },
      {
        key: 'tax',
        type: Number,
      },
      {
        key: 'total',
        type: Number,
      },
      {
        key: 'edited',
        type: Boolean,
      },
      {
        key: 'remarks',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default PaymentDistribution;
