import {constants} from 'src/constants.mjs';
import Utility     from 'src/utility/Utility.mjs';

export default class WorkshopError extends Error {
  constructor(error) {
    error = `${constants.moduleLabel} | ${error}`;
    Utility.notify(error, {type: 'error'})
    super(error);
  }
}