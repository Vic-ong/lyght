import BaseModel from '@/models/BaseModel';
import { uuid } from '@/models/utils';

class PaymentProvision extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('projectId'),
      uuid('projectGroupId'),
      uuid('expenseId'),
      {
        key: 'date',
        type: String,
      },
      {
        key: 'paymentDate',
        type: String,
      },
      {
        key: 'currency',
        type: String,
      },
      {
        key: 'revenue',
        type: Number,
      },
      {
        key: 'outstanding',
        type: Number,
      },
      {
        key: 'valueAddedTax',
        type: Number,
      },
      {
        key: 'remarks',
        type: String,
      },
      {
        key: 'payoutDate',
        type: String,
      },
      {
        key: 'status',
        type: String,
      },
      {
        key: 'approvedBy',
        type: Array,
        fields: [
          uuid(),
          {
            key: 'name',
            type: String,
          },
          {
            key: 'date',
            type: Date,
          },
        ],
      },
    ];

    super({ params, validators, options });
  }
}

export default PaymentProvision;
