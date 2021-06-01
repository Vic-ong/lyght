import BaseModel from '@/models/BaseModel';
import { uuid, trans, address } from '@/models/utils';

class ProjectGroup extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('entityId'),
      trans('nameTrans'),
      address('address'),
      {
        key: 'capacity',
        type: Number,
      },
      {
        key: 'panelsTotal',
        type: Number,
      },
      {
        key: 'ppaContractStartDate',
        type: String,
      },
      {
        key: 'ppaContractEndDate',
        type: String,
      },
      {
        key: 'electricityPurchaser',
        type: String,
      },
      {
        key: 'classification',
        type: String,
      },
      {
        key: 'grade',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default ProjectGroup;
