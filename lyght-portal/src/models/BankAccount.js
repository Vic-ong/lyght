import BaseModel from '@/models/BaseModel';

class BankAccount extends BaseModel {
  constructor(params, options) {
    const validators = [
      {
        key: 'accountName',
        type: String,
      },
      {
        key: 'accountNumber',
        type: String,
      },
      {
        key: 'bankCode',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default BankAccount;
