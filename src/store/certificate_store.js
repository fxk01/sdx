/**
 * certificateStore
 */

'use strict';
import request from '../utils/fetch'

export default {
  selectUserZcZczmByIdCard(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      userZcZczmList: [],
    };
    request(params, 'POST', callback);
  },
  postdeleteUserZcZczm(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
    };
    request(params, 'POST', callback);
  },
};
