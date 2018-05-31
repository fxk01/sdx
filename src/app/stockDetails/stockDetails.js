/**
 * 在线投资详情逻辑
 */

'use strict';
import './stockDetails.less';
import stockDetailsTpl from './stockDetails.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';
import stockDetailStore from '../../store/stockDetails_store';
import ggListTpl from '../../components/fund-ggList/fund-ggList.html';
import $$ from 'jquery';

export default class StockDetail extends widget {
  constructor() {
    super();
    this.lone = [];
  }

  init(page) {
    $('.view').attr('data-page', 'stockDetail');
    let pageLeg = $('.stockDetail-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    this.apTpl();

    this.fundInvestment();
    this.postStyle();
    $('.framework7-root').on('click', '.fundDeHrefRegFund', () => { window.location.href = `${Constant.Href_Route}stockRight.html?tab2=${Tool.parseURL('tab2')}` });
    $('.framework7-root').on('click', '.fundHrefBul', () => { window.location.href = `${Constant.Href_Route}fundBulletin.html?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}`; });
    $('.framework7-root').on('click', '.rgFlagListTrue .cppl li', function() { window.location.href = `${Constant.Href_Route}letterCoak.html?tab2=${Tool.parseURL('tab2')}&code=${Tool.parseURL('code')}&id=${$$(this).attr('data-id')}`; });
    $('.framework7-root').on('click', '.reservationHref', () => { window.location.href = `${Constant.Href_Route}reservation.html?code=${Tool.parseURL('code')}&name=${encodeURI($('.sdx-fund-jjCpH1').text())}`; });
    $('.framework7-root').on('click', '.jjTxContent img', () => { this.myPhotoBrowserStandalone.open(); });
  }
  apTpl() {
    let _stockDetailsTpl = Tool.renderTpl(stockDetailsTpl);
    $('.stockDetail-page').html('').append($(_stockDetailsTpl));
  }
  /*
   获取基金投向
   */
  fundInvestment() {
    stockDetailStore.postChanpin({
      data: {
        action: 'chanpin',
        ChanPinCode: decodeURI(Tool.parseURL('code')),
        cid: sessionStorage.getItem('cid'),
        company_type: sessionStorage.getItem('company_type'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        $('.sdxEchoCpInfo').html(res.chanpin['jijingtouxiang_title']);
        $('.jjTxContent').html(res.chanpin['jijintouxiang_element']);
        $('.sdx-fund-jjCpH1').text(res.chanpin['name']);
        let txImgLeg = $$('.jjTxContent').find('img');
        for(let i = 0; i < txImgLeg.length; i++) {
          let _url = `${Constant.SERVER_URL}` + txImgLeg[i].getAttribute('src').replace('..', '');
          this.lone.push(_url);
          txImgLeg[i].setAttribute('src', _url);
        }
        this.myPhotoBrowserStandalone = myApp.photoBrowser({
          photos: this.lone,
          theme: 'dark',
          type: 'standalone',
          backLinkText: '关闭',
        });
      } else {
        alert('接口报错!');
      }
    })
  }
  /*
   获取产品风格要求
   */
  postStyle() {
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
        this.productElements();
        this.letterCloak();
      } else {
        alert('接口报错!');
      }
    })
  }
  /*
   获取产品要素
   */
  productElements() {
    stockDetailStore.postChanpinYaoSu({
      data: {
        action: 'ChanpinYaoSu',
        cid: sessionStorage.getItem('cid'),
        chanpinCode: decodeURI(Tool.parseURL('code')),
        company_type: sessionStorage.getItem('company_type'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        if (res.chanPinYaoSuList.length === 0) {
          $('.cpYs_Gq').show();
        } else {
          $('.productElementContent').html(res.chanPinYaoSuList[0].content);
        }
      } else {
        alert('接口报错!');
      }
    })
  }
  /*
   信披报告
   */
  letterCloak() {
    stockDetailStore.postChanPinPiLu({
      data: {
        action: 'chanPinPiLu',
        cid: sessionStorage.getItem('cid'),
        ChanPinCode: decodeURI(Tool.parseURL('code')),
        readPower: this.getReadPower(),
      }
    }, (res) => {
      if(res.result === 'OK') {
        if (res.ChanPinPiLu.length === 0) {
          $('.rgFlagListFalse').show();
          $('.rgFlagListTrue').hide();
        } else {
          let _json = res;
          for(let i = 0; i < _json.ChanPinPiLu.length; i++) {
            let oldTime = (new Date(_json.ChanPinPiLu[i]['create_timestamp'])).getTime();
            let da = new Date(oldTime);
            let year = da.getFullYear() + '年';
            let month = da.getMonth() + 1 + '月';
            let date = da.getDate() + '日';
            _json.ChanPinPiLu[i]['create_timestamp'] = [year, month, date].join('');
          }
          let _ggListTpl = Tool.renderTpl(ggListTpl, _json);
          $('.rgFlagListTrue').html('').append($(_ggListTpl));
        }
      } else {
        alert('接口报错!');
      }
    })
  }
};
