/**
 * router -> views, viewsJs
 * 路由加载页面及当前逻辑
 */

'use strict';
import {
  Record,
  Complaint,
  Login,
  Fund,
  FundDetail,
  Reservation,
  FundBulletin,
  FundNoticeDetails,
  PurchasedProducts,
  UserInformation,
  ModifyPassword,
  ForgetPassword,
  Questionnaire,
  Register,
  StockRight,
} from './page';
import Main from './main/main';
import Utils from '../utils/tool';

export default {
  init() {
    let that = this;
    window.fundNum = 0;
    $(document).on('pageBeforeInit', (e) => {
      e.srcElement.innerHTML = Utils.renderTpl(e.srcElement.innerHTML, {});
      that.pageBeforeInit(e.detail.page);
    });
    window.addEventListener('popstate', () => { this.poPHtml() });
  },
  poPHtml() {
    let _arrUrl = window.location.href.split('/');
    let page = '';
    _arrUrl.forEach((item) => {
      if(item.indexOf('.html') > 0) {
        page = item.match(/\w+.html+/g)[0].slice(0, -5);
      }
    });
    this.pageBeforeInit({
      name: page === '' ? 'index' : page,
      query: {
        cid: Utils.parseURL('cid'),
      },
      url: window.location.href,
    });
  },
  pageBeforeInit(page) {
    window.registerUserType = '';
    if(sessionStorage.getItem('userType') === '个人') {
      window.registerUserType = 'gr'
    }
    if(sessionStorage.getItem('userType') === '机构') {
      window.registerUserType = 'jg'
    }
    if(sessionStorage.getItem('userType') === '产品') {
      window.registerUserType = 'cp'
    }
    switch (page.name) {
      case 'main':
        new Main().init(page);
        break;
      case 'record':
        new Record().init(page);
        break;
      case 'complaint':
        new Complaint().init(page);
        break;
      case 'login':
        new Login().init(page);
        break;
      case 'fund':
        new Fund().init(page);
        break;
      case 'fundDetail':
        new FundDetail().init(page);
        break;
      case 'reservation':
        new Reservation().init(page);
        break;
      case 'fundBulletin':
        new FundBulletin().init(page);
        break;
      case 'fundNoticeDetails':
        new FundNoticeDetails().init(page);
        break;
      case 'purchasedProducts':
        new PurchasedProducts().init(page);
        break;
      case 'userInformation':
        new UserInformation().init(page);
        break;
      case 'modifyPassword':
        new ModifyPassword().init(page);
        break;
      case 'forgetPassword':
        new ForgetPassword().init(page);
        break;
      case 'questionnaire':
        new Questionnaire().init(page);
        break;
      case 'register':
        new Register().init(page);
        break;
      case 'stockRight':
        new StockRight().init(page);
        break;
      default:
        break;
    }
  }
};
