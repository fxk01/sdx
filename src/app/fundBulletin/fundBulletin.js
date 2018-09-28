/**
 * 基金产品公告列表
 */

'use strict';
import './fundBulletin.less';
import fundBulletinTpl from './fundBulletin.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import ggListTpl from '../../components/fund-ggList/fund-ggList.html';
import fundBulletinStore from '../../store/fund_bulletin';
import Constant from '../../utils/constant';
import stockDetailStore from '../../store/stockDetails_store';

export default class FundBulletin extends widget {
  init() {
    let self = this;
    $('.view').attr('data-page', 'fundBulletin');
    let pageLeg = $('.fundBulletin-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _fundBulletinTpl = Tool.renderTpl(fundBulletinTpl);
    $('.fundBulletin-page').html('').append($(_fundBulletinTpl));
    stockDetailStore.postChanpinFenggeyaoqiu({
      data: {
        action: 'ChanpinFenggeyaoqiu',
        cid: sessionStorage.getItem('cid'),
        chanpinCode: decodeURI(Tool.parseURL('code')),
        tongxingzhen: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        sessionStorage.setItem('rgFlag', res.is_rgFlag);
      } else {
        alert('接口报错!');
      }
    });
    this.noticeList();

    $('.fundHrefBulReg').on('click', () => { self.fundStockDetail(`?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}`); });
    $('.framework7-root').on('click', '.fundNoticeHref', function() { window.location.href = `${Constant.Href_Route}fundNoticeDetails.html?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}&id=${$(this).attr('data-id')}` });
  }
  /*
   获取公告列表
   */
  noticeList() {
    if(sessionStorage.getItem('rgFlag') === 'undefined') {
      $('.rgFlagListTrue').hide();
      $('.rgFlagListFalse').show();
      return false;
    } else if(sessionStorage.getItem('rgFlag') === '1') {
      $('.rgFlagListTrue').show();
      $('.rgFlagListFalse').hide();
      fundBulletinStore.postChanPinGongGao({
        data: {
          action: 'ChanPinGongGao',
          cid: sessionStorage.getItem('cid'),
          ChanPinCode: Tool.parseURL('code'),
          readPower: this.getReadPower(),
        }
      }, (res) => {
        let _json = res;
        if(_json.ChanPinGongGao.length === 0) {
          $('.rgFlagListTrue').text('本基金暂未发布产品公告').css({
            'color': 'red',
            'font-size': '18px',
            'line-height': '40px',
            'margin-top': '50px',
            'text-align': 'center',
          });
          return false;
        }
        for(let i = 0; i < _json.ChanPinGongGao.length; i++) {
          let oldTime = (new Date(_json.ChanPinGongGao[i]['create_timestamp'])).getTime();
          let da = new Date(oldTime);
          let year = da.getFullYear() + '年';
          let month = da.getMonth() + 1 + '月';
          let date = da.getDate() + '日';
          _json.ChanPinGongGao[i]['create_timestamp'] = [year, month, date].join('');
        }
        let _ggListTpl = Tool.renderTpl(ggListTpl, res);
        $('.rgFlagListTrue').html('').append($(_ggListTpl));
      })
    }
  }
};
