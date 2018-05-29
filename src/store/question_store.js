/**
 * questionStore
 */

'use strict';
import request from '../utils/fetch'

export default {
  postTopicList(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      answer: '',
      topiclist: [],
    };
    request(params, 'POST', callback);
  },
  postRetest(params, callback) {
    params.path = 'data';
    params.assign = {
      result: false,
      assessment: '',
      betweenDays: '',
      grade: '',
      id_card: '',
      qTime: '',
    };
    request(params, 'POST', callback);
  },
};
