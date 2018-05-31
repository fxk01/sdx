/**
 * 股权版已购产品逻辑
 */

'use strict';
import './stockRecord.less';
import stockRecordTpl from './stockRecord.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';
import stockRecordStore from '../../store/stockRecord_store';
import recordListTpl from '../../components/fund-record/fund-record.html';

export default class StockRecord extends widget {
  constructor() {
    super();
  }

  init() {
    try {
      let self = this;

      $('.view').attr('data-page', 'stockRecord');
      let pageLeg = $('.stockRecord-page').length;
      if(pageLeg === 0) {
        window.location.reload();
      }
      this.apTpl();
      this.postProducts();

      $('.pullFundHome').on('refresh', () => { this.stockPurData(); });
      $('.framework7-root').on('click', '.stockRightHome', function() { window.location.href = `${Constant.Href_Route}stockRight.html?tab3=${Tool.parseURL('tab3')}` });
    } catch (e) {
      console.log(e.message);
    }
  }
  apTpl() {
    let _stockRecordTpl = Tool.renderTpl(stockRecordTpl);
    $('.stockRecord-page').html('').append($(_stockRecordTpl));
  }
  /*
   在线投资首页内容
   */
  stockPurData() {
    Promise.all([this.postProducts()]).then(([ret1]) => {
      if(ret1 === 'c') {
        myApp.pullToRefreshDone();
      }
    });
  }
  /*
   获取已购产品列表
   */
  postProducts() {
    return new Promise((resolve) => {
      stockRecordStore.postYonghuJiaoyi({
        data: {
          action: 'yonghuJiaoyi',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
          company_type: sessionStorage.getItem('company_type'),
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
        let _echoRecordListTplTpl = Tool.renderTpl(recordListTpl, json);
        $('.stockRecordList').html('').append($(_echoRecordListTplTpl));
        resolve('c');
      })
    });
  }
};
