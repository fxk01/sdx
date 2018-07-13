/**
 * 在线投资首页逻辑
 */

'use strict';
import './stockRight.less';
import stockRightTpl from './stockRight.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import userFdInformation from '../../components/user-fd-information/user-fd-information.html';
import userFdInformation2 from '../../components/user-fd-infomation2/user-fd-information2.html';
import Constant from '../../utils/constant';
import $$ from 'jquery';
import stockRightStore from '../../store/stockRight_store';
import homeStockProduct from '../../components/stock-product/stock-product.html';
import '../../components/stock-product/stock-product.less';

export default class StockRight extends widget {
  init(page) {
    let self = this;
    if(sessionStorage.getItem('cid')) {
      if(sessionStorage.getItem('idCard') === undefined || sessionStorage.getItem('idCard') === null) {
        window.location.href = `${Constant.Href_Route}login.html`;
      }
    } else {
      window.location.href = `${Constant.Href_Route}main.html`;
    }
    $('.view').attr('data-page', 'stockRight');
    let pageLeg = $('.stockRight-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    this.apTpl();
    this.fundHomeData();
    this.onlineInvest();

    $('.pullFundHome').on('refresh', () => { this.fundHomeData(); });
    $('.pullFund').on('refresh', () => {
      this.onlineInvest().then(function(str) {
        if(str) {
          myApp.pullToRefreshDone();
        }
      });
    });

    $$('.framework7-root').on('click', '.questionHref, .retestQuestion', function() { let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}questionnaire.html?val=${_val}&xz=${$$(this).attr('data-xz')}` });
    $$('.framework7-root').on('click', '.questionHref2, .retestQuestion2', function() { let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}questionnaire.html?tab3=active&val=${_val}&xz=${$$(this).attr('data-xz')}` });
    $$('.framework7-root').on('click', '.sdx-stock-prXx', function() { sessionStorage.setItem('chanPinId', $$(this).attr('data-chanpinid')); window.location.href = `${Constant.Href_Route}stockDetail.html?tab2=${$$(this).attr('data-val')}&code=${$$(this).attr('data-code')}` });
    $$('.framework7-root').on('click', '.hrefYgCp', function() { window.location.href = `${Constant.Href_Route}stockPurchasedCp.html?tab3=${$$(this).attr('data-val')}` });
    $$('.framework7-root').on('click', '.hrefJyJl', function() { window.location.href = `${Constant.Href_Route}stockRecord.html?tab3=${$$(this).attr('data-val')}` });
    $$('.framework7-root').on('click', '.hrefJbXx', function() { window.location.href = `${Constant.Href_Route}userInformation.html?tab3=${$$(this).attr('data-val')}`; });
    $$('.framework7-root').on('click', '.hrefXgMm', function() { window.location.href = `${Constant.Href_Route}modifyPassword.html?tab3=${$$(this).attr('data-val')}`; });
    $$('.framework7-root').on('click', '.hrefTsJy', function() { window.location.href = `${Constant.Href_Route}complaint.html?tab3=${$$(this).attr('data-val')}`; });
    $$('.framework7-root').on('click', '.hrefZxZm', function() { window.location.href = `${Constant.Href_Route}certificate.html?tab3=${$$(this).attr('data-val')}`; });
    $$('.framework7-root').on('click', '.hrefLoginOut', () => { self.loginOut(); });
    $$('.framework7-root').on('click', '.toolbar-inner .tab-link', function() {
      let stateObject = {};
      let title = '';
      let newUrl;
      let href = $$(this).attr('href');
      if(href === '#tab2') {
        newUrl = `${Constant.Href_Route}stockRight.html?tab2=active`;
        history.pushState(stateObject, title, newUrl);
      } else if(href === '#tab1') {
        newUrl = `${Constant.Href_Route}stockRight.html`;
        history.pushState(stateObject, title, newUrl);
      } else {
        newUrl = `${Constant.Href_Route}stockRight.html?tab3=active`;
        history.pushState(stateObject, title, newUrl);
      }
    });
  }
  apTpl() {
    let _idCard = sessionStorage.getItem('idCard');
    myApp.closeModal('.modal-main');
    let _stockRightTpl = Tool.renderTpl(stockRightTpl);
    $('.stockRight-page').html('').append($(_stockRightTpl));
    $$('.page-content .content-block').css({
      'min-height': $(document.body).height()-$('.navbar').height()-$('.tabbar-labels').height(),
      'z-index': 9999999,
    });
    $('.userFundInformation').append(userFdInformation);
    $('.userFundInformation2').append(userFdInformation2);
    $('.fundUser').text(sessionStorage.getItem('companyUser'));
    $('.fundIdCard').text(_idCard.substr(0,2) + '**************' + _idCard.substr(_idCard.length-2, 2));

    if(Tool.parseURL('tab2') && Tool.parseURL('tab2') !== 'undefined') {
      $('.tab').removeClass('active');
      $('#tab2').addClass('active');
    }
    if(Tool.parseURL('tab3') && Tool.parseURL('tab3') !== 'undefined') {
      $('.tab').removeClass('active');
      $('#tab3').addClass('active');
    }
  }
  /*
  退出
   */
  loginOut() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('companyUser');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cardType');
    sessionStorage.removeItem('idCard');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('qTime');
    sessionStorage.removeItem('qScore');
    sessionStorage.removeItem('userType');
    window.location.href = `${Constant.Href_Route}login.html`;
  }
  /*
   在线投资首页内容
   */
  fundHomeData() {
    Promise.all([this.postRiskTolerance(), this.postAssetProfile()]).then(([ret1, ret2]) => {
      if(ret2 === 'b') {
        myApp.pullToRefreshDone();
      }
    });
  }
  /*
   获取风险承受能力
   */
  postRiskTolerance() {
    return new Promise((resolve) => {
      let assessmentResultDom = $('.assessmentResult');
      let gradeDom = $('.grade');
      let insertAnswerDateDom = $('.insertAnswerDate');
      let insertAnswerBetweenDaysDom = $('.insertAnswerBetweenDays');
      stockRightStore.postGetAnswer({
        data: {
          action: 'GetAnswer',
          cid: sessionStorage.getItem('cid'),
          accountId: sessionStorage.getItem('userId'),
          grade: sessionStorage.getItem('qScore'),
          topicType: sessionStorage.getItem('company_type'),
        }
      }, (res) => {
        if(sessionStorage.getItem('qScore') === '-1') {
          assessmentResultDom.text('未测评');
          gradeDom.text('未测评。');
          insertAnswerDateDom.text('-');
          insertAnswerBetweenDaysDom.text('-');
        } else {
          assessmentResultDom.text(res['assessment']);
          gradeDom.text(sessionStorage.getItem('qScore'));
          insertAnswerDateDom.text(sessionStorage.getItem('qTime').substring(0, 11).replace(/\//g, '.'));
          insertAnswerBetweenDaysDom.text(sessionStorage.getItem('betweenDays') + '天');
        }
        sessionStorage.setItem('riskTolerance', res.assessment);
        resolve('a');
      })
    })
  }
  /*
   获取已购产品
   */
  postAssetProfile() {
    return new Promise((resolve) => {
      stockRightStore.postYonghuChanpin({
        data: {
          action: 'yonghuChanpin',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
          company_type: sessionStorage.getItem('company_type'),
        }
      }, (res) => {
        let json = res;
        if(json.chanpin.length === 0) {
          $('.stockLeg0').show();
        }
        for(let i = 0; i < json.chanpin.length; i++) {
          json.chanpin[i]['create_date'] = this.formatDate(new Date(json.chanpin[i]['create_date']));
        }
        resolve('b');
        let echoHomeStockProductTpl = Tool.renderTpl(homeStockProduct, json);
        $('.tab1BlockItem').html('').append($(echoHomeStockProductTpl));
      })
    })
  }
  /*
   获取在线投资产品
   */
  onlineInvest() {
    return new Promise((resolve) => {
      stockRightStore.postYonghuChanpin({
        data: {
          action: 'ChanpinList',
          company_type: sessionStorage.getItem('company_type'),
          cid: sessionStorage.getItem('cid'),
          qScore: sessionStorage.getItem('qScore'),
          typeJudge: 1,
          sfwzytzz: sessionStorage.getItem('sfwzytzz'),
          idCard: sessionStorage.getItem('idCard'),
        }
      }, (res) => {
        let json = res;
        for(let i = 0; i < json.chanpin_list.length; i++) {
          json.chanpin_list[i]['createDate'] = this.formatDate(new Date(json.chanpin_list[i]['createDate']));
        }
        let echoHomeStockProductTpl = Tool.renderTpl(homeStockProduct, json);
        $('.fundTab2Accordion').html('').append($(echoHomeStockProductTpl));
        resolve(true);
      })
    });
  }
};
