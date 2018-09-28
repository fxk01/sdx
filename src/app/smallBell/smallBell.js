/**
 * 证劵产品逻辑
 */

'use strict';
import '../fund/fund.less';
import './smallBell.less';
import fundTpl from './smallBell.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import smallBellStore from '../../store/smallBell_store';
import smallBellList from '../../components/smallBell_list/smallBell_list.html';
import Constant from '../../utils/constant';
import $$ from 'jquery';

export default class SmallBell extends widget {
  constructor() {
    super();
    this.show = false;
    this.showGood = false;
  }

  init(page) {
    let self = this;
    $('.view').attr('data-page', 'smallBell-page');
    let pageLeg = $('.smallBell-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    this.apTpl();

    this.chasedMsg();
    $$('.framework7-root').on('click', '.hrefFund', () => {
      $$('#root').remove();
      const parameter = `?tab3=${Tool.parseURL('tab3') === undefined ? '' : Tool.parseURL('tab3')}`; this.fundStockHref(parameter);
    });
    $$('.framework7-root').on('click', '.bg-red', function() {
      self.signMsg($$(this));
    });
    $$('.framework7-root').on('click', '.swipeout-delete', function() {
      self.id = $$(this).attr('data-id');
    });
    $$('.framework7-root').on('click', '.modal-button-bold', function() {
      self.deleteMsg($$(this));
    });
    $$('.framework7-root').on('click', '.hrefFundBulletin', function() {
      if(sessionStorage.getItem('companyType') === 1) {
        window.location.href = `${Constant.Href_Route}fundBulletin.html?code=${$$(this).attr('data-code')}&bell=small`
      } else {
        window.location.href = `${Constant.Href_Route}fundBulletin.html?tab2=undefined&code=${$$(this).attr('data-code')}&bell=small`
      }
    });
  }
  apTpl() {
    let _fundTpl = Tool.renderTpl(fundTpl);
    $('.smallBell-page').html('').append($(_fundTpl));
  }
  /*
   获取系统消息
   */
  chasedMsg() {
    smallBellStore.postProductMessage({
      data: {
        action: 'Message',
        method: 'getProductMessage',
        cid: sessionStorage.getItem('cid'),
        idCard: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      if(res.prodMsgList.length === 0) {
        $('.stockLeg0').show();
      }
      let smallBellListTpl = Tool.renderTpl(smallBellList, res);
      $('.chasedMsg').html('').append($(smallBellListTpl));
    })
  }
  /*
   标记已读
   */
  signMsg(self) {
    smallBellStore.postUpdateProductMsg({
      data: {
        action: "Message",
        method: 'updateProductMessage',
        messageId: self.attr('data-id'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        self.removeClass('bg-red');
      }
    })
  }
  /*
   标记删除
   */
  deleteMsg() {
    smallBellStore.postDeleteProductMsg({
      data: {
        action: "Message",
        method: 'deleteProductMessage',
        messageId: this.id,
      }
    }, (res) => {

    })
  }
};
