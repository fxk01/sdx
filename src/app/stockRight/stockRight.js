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
    $('.showFundGoods').on('click', (e) => { this.showGoods(e); });
    $$('.framework7-root').on('click', '.infoListGoods .accordion-item', function() { let itemSelf = $(this); self.openData(itemSelf); });
    $('.pullFundHome').on('refresh', () => { this.fundHomeData(); });
    $('.pullFund').on('refresh', () => {

    });
    $$('.framework7-root').on('click', '.questionHref', () => { window.location.href = `${Constant.Href_Route}questionnaire.html` });
    $$('.framework7-root').on('click', '.questionHref2', () => { window.location.href = `${Constant.Href_Route}questionnaire.html?tab3=active` });
    $$('.framework7-root').on('click', '.hrefYgCp', () => { window.location.href = `${Constant.Href_Route}purchasedProducts.html`; });
    $$('.framework7-root').on('click', '.hrefJyJl', () => { window.location.href = `${Constant.Href_Route}record.html`; });
    $$('.framework7-root').on('click', '.hrefJbXx', () => { window.location.href = `${Constant.Href_Route}userInformation.html`; });
    $$('.framework7-root').on('click', '.hrefXgMm', () => { window.location.href = `${Constant.Href_Route}modifyPassword.html`; });
    $$('.framework7-root').on('click', '.hrefTsJy', () => { window.location.href = `${Constant.Href_Route}complaint.html`; });
    $$('.framework7-root').on('click', '.hrefLoginOut', () => { self.loginOut(); });
  }
  apTpl() {
    let _idCard = sessionStorage.getItem('idCard');
    myApp.closeModal('.modal-main');
    let _stockRightTpl = Tool.renderTpl(stockRightTpl);
    $('.stockRight-page').html('').append($(_stockRightTpl));
    $('.userFundInformation').append(userFdInformation);
    $('.userFundInformation2').append(userFdInformation2);
    $('.fundUser').text(sessionStorage.getItem('companyUser'));
    $('.fundIdCard').text(_idCard.substr(0,2) + '**************' + _idCard.substr(_idCard.length-2, 2));

    if(Tool.parseURL('tab2')) {
      $('.tab').removeClass('active');
      $('#tab2').addClass('active');
    }
    if(Tool.parseURL('tab3')) {
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
   基金产品首页内容
   */
  fundHomeData() {
    Promise.all([this.postRiskTolerance(), this.postAssetProfile()]).then(([ret1, ret2, ret3]) => {
      if(ret3 === 'c') {
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
        let echoFundProductsTpl = Tool.renderTpl(fundProducts, res);
        $('.tab1BlockItem').html('').append($(echoFundProductsTpl));
        resolve('c');
      })
    })
  }
  /*
   显示隐藏资产已购产品信息
   */
  showGoods(e) {
    if(this.showGood) {
      $('.showGoodField').show();
      $('.hideGoods').hide();
      e.target.src = '../src/assets/images/home_openeye.png';
      this.showGood = false;
    } else {
      $('.showGoodField').hide();
      $('.hideGoods').show();
      e.target.src = '../src/assets/images/home_closeeye.png';
      this.showGood = true;
    }
  }
  /*
   设置openData及跳转
   */
  openData(itemSelf) {
    sessionStorage.setItem('chanPinId', itemSelf.attr('data-chanpinid'));
    window.location.href = `${Constant.Href_Route}fundDetail.html?code=${itemSelf.attr('data-chanpincode')}`;
  }
};
