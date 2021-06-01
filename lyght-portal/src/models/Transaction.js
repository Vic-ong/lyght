import BaseModel from './BaseModel';
import { uuid, currency, paymentInfo } from './utils';

class Transaction extends BaseModel {
  constructor(params, options) {
    const validators = [
      currency('amount'),
      uuid('projectId'),
      uuid('projectGroupId'),
      uuid('userId'),
      uuid('invoiceReferenceId', { optional: true }),
      uuid('paymentProvisionId', { optional: true }),
      uuid('expenseId', { optional: true }),
      paymentInfo('payer'),
      paymentInfo('recipient'),
      {
        key: 'account',
        type: String,
      },
      {
        key: 'debit',
        type: Boolean,
      },
      {
        key: 'status',
        type: String,
      },
      {
        key: 'remarks',
        type: String,
        optional: true,
      },
    ];

    super({ params, validators, options });
  }
}

export default Transaction;
