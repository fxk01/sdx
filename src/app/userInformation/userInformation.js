/**
 * 基本信息逻辑
 */

'use strict';
import './userInformation.less';
import userInformationTpl from './userInformation.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import '../../components/user-info/user-info.less';
import userInfoListTpl from '../../components/user-info/user-info.html';
import userInfoStore from '../../store/userBasicInfo_store';
import $$ from 'jquery';
import Constant from '../../utils/constant';

export default class UserInformation extends widget {
  constructor() {
    super();
  }

  init() {
    let self = this;
    $('.view').attr('data-page', 'userInformation');
    let pageLeg = $('.userInformation-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _userInformationTpl = Tool.renderTpl(userInformationTpl);
    $('.userInformation-page').html('').append($(_userInformationTpl));

    this.userBasicInfo();
    $$('#userInfoLink').on('click', () => { window.location.href = `${Constant.Href_Route}fund.html`; });
    $('.userBasicInfo').on('click', '.infoEdit', () => { this.infoEdit(); });
    $$('.userBasicInfo').on('click', '.sdx-info-bc', function() { let that = $$(this); self.preservationInfo(that); });
  }
  /*
   获取用户基本信息
   */
  userBasicInfo() {
    userInfoStore.postUserZcJbxx({
      data: {
        action: 'UserZcJbxx',
        method: 'selectUserZcJbxxByIdCard',
        cid: sessionStorage.getItem('cid'),
        user_type: sessionStorage.getItem('userType'),
        id_card: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      let _userInfoListTpl = Tool.renderTpl(userInfoListTpl, res['yongHuJbxx']);
      $('.userBasicInfo').html('').append($(_userInfoListTpl));
    })
  }
  /*
   编辑个人信息
   */
  infoEdit() {
    let self = this;
    $('.sdx-info-bc').show();
    $('.infoEdit').hide();
    $(':disabled').removeAttr('disabled');
    $$('.onRadio').unbind('click').click(function(e) { let that = $$(this); self.onRadio(that); });
  }
  /*
   单选框
   */
  onRadio(self) {
    self.find('.onSelect').addClass('onSelectScale1');
    self.parent('label').siblings().find('.onSelect').removeClass('onSelectScale1');
  }
  /*
   保存用户信息
   */
  preservationInfo() {
    let leg = $$(':text').length;
    let hash = {};
    for(let i = 0; i <leg; i++) {
      let gr = $$(':text')[i].getAttribute('data-gr');
      let _val = $$(':text')[i].value;
      hash[gr] =_val;
    }
    let scaleLeg = $$('.onSelectScale1').length;
    for(let j = 0; j <scaleLeg; j++) {
      const slGr = $$('.onSelectScale1')[j].getAttribute('data-gr');
      const key = $$('.onSelectScale1')[j].parentNode.parentNode.parentNode.getAttribute('data-key');
      hash[key] = slGr;
    }
    let textArLeg = $$('.textareaText').length;
    for(let k = 0; k < textArLeg; k++) {
      const areaKey = $$('.textareaText')[k].getAttribute('data-key');
      const areaValue = $$('.textareaText')[k].value;
      hash[areaKey] = areaValue;
    }

    userInfoStore.postBcUserZcJbxx({
      data: {
        registerUserType: window.registerUserType,
        action: 'UserZcJbxx',
        method: 'insetUserZcJbxx',
        cid: sessionStorage.getItem('cid'),
        user_type: sessionStorage.getItem('userType'),
        B_sfwzytzz: sessionStorage.getItem('sfwzytzz'),
        ...hash,
      }
    }, (res) => {
      if(res.result === 'OK') {
        this.userBasicInfo();
        $('.sdx-info-bc').hide();
        $('.infoEdit').show();
        $$('.onRadio').unbind(this.onRadio);
      }
    })
  }
};
