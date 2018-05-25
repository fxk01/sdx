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
  },
  postRegister(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      result_A: 'OK',
      result_B: 'OK',
      token: 'w89NYv9eKru1wOm3imP+3Q==',
      yongHu: {},
      yongHuJbxx: {},
    };
    request(params, 'POST', callback);
  }
};
