/**
 * 股权版已购产品逻辑
 */

'use strict';
import './stockPurchasedCp.less';
import stockPurchasedCpTpl from './stockPurchasedCp.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import stockPur from '../../store/stockPur_store';
import homeStockProduct from '../../components/stock-product/stock-product.html';
import '../../components/stock-product/stock-product.less';
import Constant from '../../utils/constant';


export default class StockPurchasedCp extends widget {
  constructor() {
    super();
  }

  init() {
    try {
      let self = this;

      $('.view').attr('data-page', 'stockPurchasedCp');
      let pageLeg = $('.stockPurchasedCp-page').length;
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
    let _stockPurchasedCpTpl = Tool.renderTpl(stockPurchasedCpTpl);
    $('.stockPurchasedCp-page').html('').append($(_stockPurchasedCpTpl));
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
      stockPur.postYonghuChanpin({
        data: {
          action: 'yonghuChanpin',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
          company_type: sessionStorage.getItem('company_type'),
        }
      }, (res) => {
        let json = res;
        if(json.chanpin.length === 0) {
          $('.stockPurListLeg0').show();
          return;
        }
        for(let i = 0; i < json.chanpin.length; i++) {
          json.chanpin[i]['create_date'] = this.formatDate(new Date(json.chanpin[i]['create_date']));
        }
        let echoHomeStockProductTpl = Tool.renderTpl(homeStockProduct, json);
        $('.stockPurList').html('').append($(echoHomeStockProductTpl));
        resolve('c');
      })
    });
  }
};
