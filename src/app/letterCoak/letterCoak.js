/**
 * 基金产品公告详情
 */

'use strict';
import './letterCoak.less';
import letterCoakTpl from './letterCoak.tpl.html';
import fundBulletinDetailsTpl from '../../components/fund-bulletinDetails/fund-bulletinDetails.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import fundNoticeDetailsStore from '../../store/fundGgDetails_store';
import Constant from '../../utils/constant';

export default class LetterCoak extends widget {
  init() {
    $('.view').attr('data-page', 'letterCoak');
    let pageLeg = $('.letterCoak-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }

    let _letterCoakTpl = Tool.renderTpl(letterCoakTpl, {
      code: Tool.parseURL('code'),
    });
    $('.letterCoak-page').append($(_letterCoakTpl));
    this.postGgDetails();

    $('.framework7-root').on('click', '.fundBulReg', () => { window.location.href = `${Constant.Href_Route}stockDetail.html?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}`; });
  }
  /*
   获取信披报告详情
   */
  postGgDetails() {
    fundNoticeDetailsStore.postChanPinGongGao({
      data: {
        action: 'chanPinPiLu',
        ChanPinCode: Tool.parseURL('code'),
        cid: sessionStorage.getItem('cid'),
        id: Tool.parseURL('id'),
        readPower: this.getReadPower(),
      }
    }, (res) => {
      let _json = res;
      for(let i = 0; i < _json.ChanPinPiLu.length; i++) {
        let oldTime = (new Date(_json.ChanPinPiLu[i]['create_timestamp'])).getTime();
        let da = new Date(oldTime);
        let year = da.getFullYear() + '年';
        let month = da.getMonth() + 1 + '月';
        let date = da.getDate() + '日';
        _json.ChanPinPiLu[i]['create_timestamp'] = [year, month, date].join('');
      }
      let _fundBulletinDetailsTpl = Tool.renderTpl(fundBulletinDetailsTpl, _json);
      $('.productBulletinDetails').html('').append($(_fundBulletinDetailsTpl));
    })
  }
};
