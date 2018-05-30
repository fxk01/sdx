/**
 * stockDetailsStore
 */

'use strict';
import request from '../utils/fetch'

export default {
  postChanpin(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      chanpin: {},
    };
    request(params, 'POST', callback);
  },
  postChanpinFenggeyaoqiu(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      is_rgFlag: '',
    };
    request(params, 'POST', callback);
  },
  postChanpinYaoSu(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      chanPinYaoSuList: [],
    };
    request(params, 'POST', callback);
  },
  postChanPinPiLu(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      ChanPinPiLu: [],
    };
    request(params, 'POST', callback);
  },
};
