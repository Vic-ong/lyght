import BaseModel from './BaseModel';
import { uuid, currency } from './utils';

class UserAsset extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('userId'),
      uuid('bankAccountId'),
      uuid('projectId'),
      uuid('projectGroupId'),
      currency('revenueLatest'),
      currency('revenueUpcoming'),
      currency('revenueTotal'),
      {
        key: 'revenueLatestDate',
        type: String,
      },
      {
        key: 'revenueUpcomingDate',
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

export default UserAsset;
