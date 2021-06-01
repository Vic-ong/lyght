import BaseModel from './BaseModel';
import { uuid } from './utils';

class Expenses extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('projectGroupId'),
      {
        key: 'date',
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
        key: 'status',
        type: String,
      },
      {
        key: 'expenses',
        type: Array,
        fields: [
          {
            key: 'account',
            type: String,
          },
          {
            key: 'value',
            type: Number,
          },
        ],
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

export default Expenses;
