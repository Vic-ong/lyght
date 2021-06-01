import BaseModel from '@/models/BaseModel';

class ExpenseAllocation extends BaseModel {
  constructor(params, options) {
    const validators = [
      {
        key: 'account',
        type: String,
      },
      {
        key: 'amount',
        type: Object,
        fields: [
          {
            key: 'type',
            type: String,
          },
          {
            key: 'value',
            type: Number,
          },
        ],
      },
    ];

    super({ params, validators, options });
  }
}

export default ExpenseAllocation;
