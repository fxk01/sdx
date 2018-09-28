/**
 * 基金产品公告详情
 */

'use strict';
import './fundNoticeDetails.less';
import fundNoticeDetailsTpl from './fundNoticeDetails.tpl.html';
import fundBulletinDetailsTpl from '../../components/fund-bulletinDetails/fund-bulletinDetails.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import fundNoticeDetailsStore from '../../store/fundGgDetails_store';
import Constant from '../../utils/constant';

export default class FundNoticeDetails extends widget {
  init() {
    $('.view').attr('data-page', 'fundNoticeDetails');
    let pageLeg = $('.fundNoticeDetails-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }

    let _fundNoticeDetailsTpl = Tool.renderTpl(fundNoticeDetailsTpl, {
      code: Tool.parseURL('code'),
    });
    $('.fundNoticeDetails-page').append($(_fundNoticeDetailsTpl));
    this.postGgDetails();
    let tab3 = '';
    if(Tool.parseURL('tab3') !== undefined) {
      tab3 = `?tab3=${Tool.parseURL('tab3')}&`;
    } else {
      tab3 = `?`;
    }

    $('.framework7-root').on('click', '.fundBulReg', () => {
      if(Tool.parseURL('bell') === 'small') {
        window.location.href = `${Constant.Href_Route}fundBulletin.html${tab3}code=${Tool.parseURL('code')}&bell=${Tool.parseURL('bell')}`;
      } else {
        window.location.href = `${Constant.Href_Route}fundBulletin.html?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}`;
      }
    });
  }
  /*
   获取产品公告详情
   */
  postGgDetails() {
    fundNoticeDetailsStore.postChanPinGongGao({
      data: {
        action: 'ChanPinGongGao',
        ChanPinCode: Tool.parseURL('code'),
        cid: sessionStorage.getItem('cid'),
        id: Tool.parseURL('id'),
        readPower: this.getReadPower(),
      }
    }, (res) => {
      let _json = res;
      for(let i = 0; i < _json.ChanPinGongGao.length; i++) {
        let oldTime = (new Date(_json.ChanPinGongGao[i]['create_timestamp'])).getTime();
        let da = new Date(oldTime);
        let year = da.getFullYear() + '年';
        let month = da.getMonth() + 1 + '月';
        let date = da.getDate() + '日';
        _json.ChanPinGongGao[i]['create_timestamp'] = [year, month, date].join('');
      }
      let _fundBulletinDetailsTpl = Tool.renderTpl(fundBulletinDetailsTpl, res);
      $('.productBulletinDetails').html('').append($(_fundBulletinDetailsTpl));
    })
  }
};
