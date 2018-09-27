/**
 * smallBellStore
 */

'use strict';
import request from '../utils/fetch'

export default {
  postProductMessage(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
    };
    request(params, 'POST', callback);
  },
  postUpdateProductMsg(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
    };
    request(params, 'POST', callback);
  },
  postDeleteProductMsg(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
    };
    request(params, 'POST', callback);
  },
};
