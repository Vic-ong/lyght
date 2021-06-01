import BaseModel from '@/models/BaseModel';

class YieldRate extends BaseModel {
  constructor(params, options) {
    const validators = [
      {
        key: 'year',
        type: String,
      },
      {
        key: 'rate',
        type: Number,
      },
    ];

    super({ params, validators, options });
  }
}

export default YieldRate;
