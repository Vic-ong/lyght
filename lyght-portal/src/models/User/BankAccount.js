import BaseModel from '@/models/BaseModel';
import { file, address } from '@/models/utils';

class User extends BaseModel {
  constructor(params, userStore, options) {
    const validators = [
      file('profilePhoto'),
      file('idPhotoBack'),
      file('idPhotoFront'),
      address('registeredAddress'),
      address('residentialAddress'),
      {
        key: 'firstName',
        type: String,
      },
      {
        key: 'lastName',
        type: String,
      },
      {
        key: 'displayName',
        type: String,
      },
      {
        key: 'dob',
        type: String,
      },
      {
        key: 'email',
        type: String,
      },
      {
        key: 'phoneNumber',
        type: String,
      },
      {
        key: 'idNumber',
        type: String,
      },
      {
        key: 'nationality',
        type: String,
      },
      {
        key: 'usCitizenship',
        type: Boolean,
      },
      {
        key: 'panelMini',
        type: String,
      },
      {
        key: 'active',
        type: String,
      },
      {
        key: 'setup',
        type: Object,
        fields: [
          {
            key: 'accountVerified',
            type: Boolean,
          },
          {
            key: 'identityVerification',
            type: String,
          },
        ],
      },
    ];

    super({ params, validators, options, userStore });
  }
}

export default User;
