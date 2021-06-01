import get from 'lodash/get';
import set from 'lodash/set';
import firebase from 'firebase/app';
import userStore from '@/store/users';
import { isObject, isArray, camelToSnake, snakeToCamel } from '@/utils/formats';

class BaseModel {
  constructor({ params, validators, options = {} }) {
    // Ownership information
    const { _id, displayName: name } = get(userStore, 'state.user.data') || {};
    this.owner = { _id, name };

    // Use firebase server timestamp
    this.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    this.params = params;
    this.validators = validators;
    this.options = options;
    this.errors = [];
  }

  hasData(v) {
    const { allowNull } = this.options;

    if (allowNull && v === null) return true;
    return !!v || v === 0 || v === false;
  }

  // Convert firebase document to object (snake case)
  getData() {
    if (this.params.data && typeof this.params.data === 'function') {
      return {
        _id: this.params.id,
        ...snakeToCamel(this.params.data()),
      };
    }

    throw new Error({
      error: 'Invalid firebase document!',
      data: this.params,
    });
  }

  setCreateDoc(options) {
    return {
      ...this.objectToDocument(options),
      created_at: this.timestamp,
      created_by: this.owner,
      updated_at: this.timestamp,
      updated_by: this.owner,
    };
  }

  setUpdateDoc(options) {
    return {
      ...this.objectToDocument(options),
      updated_at: this.timestamp,
      updated_by: this.owner,
    };
  }

  /**
   * Convert an object to firebase document format:
   * - Remove empty, undefined or null values
   * - Validate data type passed from the validators
   */
  objectToDocument() {
    const data = {};

    const reducer = (acc, curr) => {
      const { key, type, optional, fields } = curr;

      let value = get(this.params, key);
      if (!this.hasData(value)) return acc;
      if (type === Number && typeof value === 'string') value = Number(value);

      this.validate({ value, key, type, optional });

      if (fields && fields.length > 0) {
        if (type === Object && isObject(value)) {
          fields.map((f) => ({ ...f, key: `${key}.${f.key}` })).reduce(reducer, data);
        } else if (type === Array && isArray(value)) {
          if (value.length === 0) {
            set(acc, key, []);
          } else {
            value.forEach((_, index) => {
              fields.map((f) => ({ ...f, key: `${key}[${index}].${f.key}` })).reduce(reducer, data);
            });
          }
        }
      } else {
        set(acc, key, value);
      }
      return acc;
    };

    return camelToSnake(this.validators.reduce(reducer, data));
  }

  /**
   * Validate a value with its associated validation settings
   * If an error is found, the data will be pushed to this.errors
   */
  validate({ value, key, type, optional }) {
    let error;

    const setError = (t) => {
      error = `"${key}" must be ${t === 'object' || t === 'array' ? 'an' : 'a'} ${t}.`;
    };

    if (!optional && !this.hasData(value)) {
      error = `"${key}" is a required field`;
    } else if (this.hasData(value)) {
      switch (type) {
        case String:
          if (optional && typeof value !== 'string') setError(key, 'string');
          break;
        case Number:
          if (typeof value !== 'number') setError(key, 'number');
          break;
        case Boolean:
          if (typeof value !== 'boolean') setError(key, 'boolean');
          break;
        case Object:
          if (!isObject(value)) setError(key, 'object');
          break;
        case Array:
          if (!isArray(value)) setError(key, 'array');
          break;
        default:
          error = `"${key}" has an invalid type.`;
          break;
      }
    }

    if (error) this.errors.push({ value, error });
  }
}

export default BaseModel;
