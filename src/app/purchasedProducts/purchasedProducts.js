/**
 * 交易记录逻辑
 */

'use strict';
import './purchasedProducts.less';
import purchasedProductsTpl from './purchasedProducts.tpl.html';
import Tool from '../../utils/tool';
import fundProducts from '../../components/fund-products/fund-products.html';
import chasedStore from '../../store/fundChased_stroe'
import widget from '../../utils/widget';
import Constant from '../../utils/constant';

export default class PurchasedProducts extends widget {
  constructor() {
    super();
  }

  init() {
    $('.view').attr('data-page', 'purchasedProducts');
    let pageLeg = $('.purchasedProducts-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _purchasedProductsTpl = Tool.renderTpl(purchasedProductsTpl);
    $('.purchasedProducts-page').html('').append($(_purchasedProductsTpl));

    this.chased();
    $('.purHrefFund').on('click', () => { window.location.href = `${Constant.Href_Route}fund.html?tab3=active`; });
  }
  /*
   获取已购产品
   */
  chased() {
    chasedStore.postYonghuChanpin({
      data: {
        action: 'yonghuChanpin',
        cid: sessionStorage.getItem('cid'),
        idCard: sessionStorage.getItem('idCard'),
        company_type: sessionStorage.getItem('company_type'),
      }
    }, (res) => {
      if(res.chanpin.length === 0) {
        $('.stockLeg0').show();
      }
      for(let i = 0; i < res['chanpin'].length; i++) {
        res['chanpin'][i]['chicang_profit'] = this.formatNumber(res['chanpin'][i]['chicang_profit'], 2);
        res['chanpin'][i]['chicang_profit_ratio'] = this.formatNumber(res['chanpin'][i]['chicang_profit_ratio'], 2) + '%';
        res['chanpin'][i]['return_rate'] = this.formatNumber(res['chanpin'][i]['return_rate'], 2);
        res['chanpin'][i]['profit'] = this.formatNumber(res['chanpin'][i]['profit'], 2);
        res['chanpin'][i]['shares'] = this.formatNumber(res['chanpin'][i]['shares'], 2);
        res['chanpin'][i]['capital'] = this.formatNumber(res['chanpin'][i]['capital'], 2);
        res['chanpin'][i]['unit_net_worth_now'] = this.formatUnitNetWorth(res['chanpin'][i]['unit_net_worth_now']);
        res['chanpin'][i]['total_unit_net_worth'] = this.formatUnitNetWorth(res['chanpin'][i]['total_unit_net_worth']);
      }
      let echoFundProductsTpl = Tool.renderTpl(fundProducts, res);
      $('.chased').html('').append($(echoFundProductsTpl));
    })
  }
};
