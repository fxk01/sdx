/**
 * 交易记录逻辑
 */

'use strict';
import './record.less';
import recordTpl from './record.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import recordStore from '../../store/record_store';
import recordListTpl from '../../components/fund-record/fund-record.html';
import Constant from '../../utils/constant';

export default class Record extends widget {
  constructor() {
    super();
  }

  init() {
    $('.view').attr('data-page', 'record');
    let pageLeg = $('.record-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _recordTpl = Tool.renderTpl(recordTpl);
    $('.record-page').append($(_recordTpl));

    this.transactionRecord();
    $('.recordHrefFund').on('click', () => { window.location.href = `${Constant.Href_Route}fund.html?tab3=active`; });
  }
  /*
   获取交易记录
   */
  transactionRecord() {
    recordStore.postYonghuJiaoyi({
      data: {
        action: 'yonghuJiaoyi',
        cid: sessionStorage.getItem('cid'),
        idCard: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      let json = res;
      let jyLeg = json['jiaoyi'].length;
      for(let i = 0; i < jyLeg; i++) {
        for(let j = 0; j < json['jiaoyi'][i].detail.length; j++) {
          json['jiaoyi'][i].detail[j].date = json['jiaoyi'][i].detail[j].date.substring(0, 10).replace(/\//g , '.');
          json['jiaoyi'][i].detail[j]['unit_net_worth'] = json['jiaoyi'][i].detail[j]['unit_net_worth'].toFixed(4);
          json['jiaoyi'][i].detail[j]['amount'] = this.formatNumber(json['jiaoyi'][i].detail[j]['amount'], 2);
          json['jiaoyi'][i].detail[j]['shares'] = this.formatNumber(json['jiaoyi'][i].detail[j]['shares'], 2);
        }
      }
      let _recordListTpl = Tool.renderTpl(recordListTpl, json);
      $('.recordList').html('').append($(_recordListTpl));
    })
  }
};
