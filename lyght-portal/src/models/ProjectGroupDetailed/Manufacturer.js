import BaseModel from '@/models/BaseModel';

class Manufacturer extends BaseModel {
  constructor(params, options) {
    const validators = [
      {
        key: 'part',
        type: String,
      },
      {
        key: 'company',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default Manufacturer;
