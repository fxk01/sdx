/**
 * 首页逻辑
 */

'use strict';
import './main.less';
import mainTpl from './main.tpl.html';
import companyList from '../../components/company-list/company-list.html'
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import MainStore from '../../store/main_store';
import Constant from '../../utils/constant';

export default class Main extends widget {
  constructor() {
    super();
  }

  init() {
    $('.view').attr('data-page', 'main');
    let pageLeg = $('.main-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    this.apTpl();

    myApp.prompt('', '');
    $('.modal').addClass('modal-main');
    $('.modal-text-input').attr('placeholder', '请输入公司名称');
    $('.modal-text-input').on('input porpertychange', (e) => { this.queryCompany(e); });
    $('.framework7-root').on('click', '.sdx-main-ul li', (e) => { this.jumpLogin(e); });
  }
  apTpl() {
    let _mainTpl = Tool.renderTpl(mainTpl);
    $('.main-page').html('').append($(_mainTpl));
  }
  /*
   查询公司名称
   */
  queryCompany(e) {
    if(e.target.value.length > 0) {
      MainStore.companyListQuery({
        data: {
          action: 'CompanyListQuery',
          companyName: e.target.value,
        }
      }, (res) => {
        let topicsTpl = Tool.renderTpl(companyList, res);
        $('.modal-main .companyList').remove();
        $('.modal-main').append($(topicsTpl));
      })
    }
  }
  /*
   选择公司
   */
  jumpLogin(e) {
    $('.modal-main').remove();
    let _dataId = e.target.getAttribute('data-id');
    let _companyType = e.target.getAttribute('data-type');
    sessionStorage.setItem('cid', _dataId);
    sessionStorage.setItem('company_type', _companyType);
    let data = '=' + _dataId;
    let code = [];
    for(let i = 0; i < data.length; i++) {
      code += 'D' + data.charCodeAt(i).toString(6);
    }
    data = code + 'T' + _companyType;
    window.location.href = `${Constant.Href_Route}login.html?cid=${data}`;
  }
};
