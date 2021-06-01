import BaseModel from '@/models/BaseModel';
import { uuid, trans, file, files } from '@/models/utils';

class Project extends BaseModel {
  constructor(params, options) {
    const validators = [
      uuid('projectGroupId'),
      trans('nameTrans'),
      file('imagePrimary'),
      file('fileFactSheet'),
      file('fileProjectLayout'),
      files('images'),
      {
        key: 'unitCost',
        type: Number,
      },
      {
        key: 'panelsTotal',
        type: Number,
      },
      {
        key: 'panelsReserved',
        type: Number,
      },
      {
        key: 'panelsSold',
        type: Number,
      },
      {
        key: 'yieldRateAvg',
        type: Number,
      },
      {
        key: 'estimatedIrr',
        type: Number,
      },
      {
        key: 'imagePrimary',
        type: String,
      },
      {
        key: 'fundingStartDate',
        type: String,
      },
      {
        key: 'fundingEndDate',
        type: String,
      },
      {
        key: 'status',
        type: String,
      },
    ];

    super({ params, validators, options });
  }
}

export default Project;
