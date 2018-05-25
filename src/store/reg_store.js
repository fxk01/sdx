/**
 * regStore
 */

'use strict';
import request from '../utils/fetch'

export default {
  postPin(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      queryCompanylist: [],
    };
    request(params, 'POST', callback);
  },
  postUserZc(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      error_message: [],
      error_code: '',
    };
    request(params, 'POST', callback);
  }
};
