import BaseModel from '@/models/BaseModel';

class YieldRate extends BaseModel {
  constructor(params, options) {
    const validators = [
      {
        key: 'date',
        type: String,
      },
      {
        key: 'energy',
        type: Number,
      },
      {
        key: 'revenue',
        type: Number,
      },
    ];

    super({ params, validators, options });
  }
}

export default YieldRate;
