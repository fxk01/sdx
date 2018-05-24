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
import Validator from 'validator.tool';
import '../../components/toast/toast.css';
import '../../components/toast/toast';

export default class UserInformation extends widget {
  constructor() {
    super();
    this.stateSave = true;
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
      let json = res;
      json['yongHuJbxx'].sf = '否';
      json['yongHuJbxx'].br = '他人';
      json['yongHuJbxx'].tr = '他人';
      json['yongHuJbxx'].bjg = '本机构';
      let _userInfoListTpl = Tool.renderTpl(userInfoListTpl, json['yongHuJbxx']);
      $('.userBasicInfo').html('').append($(_userInfoListTpl));
    })
  }
  /*
   验证表单数据
   */
  validatorInfo() {
    let self = this;
    let options = {
      duration: 2000,
    };
    let validator;
    if(window.registerUserType === 'gr') {
      validator = new Validator('newFormUser', [{
        name: 'B_gr_name',
        display: '姓名不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_xb',
        display: '性别不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_nl',
        display: '年龄不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_card_type',
        display: '证件类型不能为空',
        rules: 'required'
      }, {
        name: 'id_card',
        display: '证件号码不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_gj',
        display: '国籍不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_zy',
        display: '职业不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_zw',
          display: '职务不能为空',
          rules: 'required'
      }, {
        name: 'B_gr_zj',
        display: '座机不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_phone',
        display: '手机不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_yb',
        display: '邮编不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_email',
        display: '电子邮箱不能为空',
        rules: 'required'
      }, {
        name: 'B_gr_dz',
        display: '住址不能为空',
        rules: 'required'
      }], function(obj) {
        const sfyblcxjl_GrDom = $('.sfyblcxjl_Gr');
        const sfwsjsyr_GrDom = $('.sfwsjsyr_Gr');
        const sfczsjkzgx_GrDom = $('.sfczsjkzgx_Gr');
        if(sfyblcxjl_GrDom.parents('.textAraNone').length === 0 && sfyblcxjl_GrDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否有不良诚信记录必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfwsjsyr_GrDom.parents('.textAraNone').length === 0 && sfwsjsyr_GrDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfczsjkzgx_GrDom.parents('.textAraNone').length === 0 && sfczsjkzgx_GrDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否存在实际控制关系必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        self.stateSave = true;
        if(self.stateSave) {
          try {
            if(obj.errors.length > 0) {
              let toast = myApp.toast('', `<div>${obj.errors[0].message}</div>`, options);
              toast.show();
              self.stateSave = false;
            } else {
              self.stateSave = true;
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      });
    }

    if(window.registerUserType === 'jg') {
      validator = new Validator('newFormMechanism', [{
        name: 'B_jg_jgmc',
        display: '机构名称不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_jglx',
        display: '机构类型不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_jgzjlx',
        display: '机构证件类型不能为空',
        rules: 'required'
      }, {
        name: 'id_card',
        display: '机构证件编号不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_yxq',
        display: '有效期不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_jgzzzm',
        display: '机构资质证明不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_zjzsbh',
        display: '资质证书编号不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_jyfw',
        display: '经营范围不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_zcdz',
        display: '注册地址不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_bgdz',
        display: '办公地址不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_zczb',
        display: '注册资本不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_sjkzr',
        display: '控股股东或实际控制人不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frxm',
        display: '姓名不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frxb',
        display: '性别不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frnl',
        display: '年龄不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frzjlx',
        display: '证件类型不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frzjhm',
        display: '证件号码不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frzw',
        display: '职务不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_fryx',
        display: '电子邮箱不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frzjyxq',
        display: '证件有效期不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frphone',
        display: '移动电话不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frbgyb',
        display: '办公邮编不能为空',
        rules: 'required'
      }, {
        name: 'B_jg_frbgdz',
        display: '办公地址不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrxm',
        display: '姓名不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrxb',
        display: '性别不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrnl',
        display: '年龄不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrzjlx',
        display: '证件类型不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrzjhm',
        display: '证件号码不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrzw',
        display: '职务不能为空',
        rules: 'required'
      }, {
        name: 'B_jbryx',
        display: '电子邮箱不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrzjyxq',
        display: '证件有效期不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrzj',
        display: '座机不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrphone',
        display: '移动电话不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrbgyb',
        display: '办公邮编不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrbgdz',
        display: '办公地址不能为空',
        rules: 'required'
      }, {
        name: 'B_jbrybjggx',
        display: '与该机构关系不能为空',
        rules: 'required'
      }
      ], function(obj) {
        const sfyblcxjl_JDom = $('.sfyblcxjl_Jg');
        const sfwsjsyr_JgDom = $('.sfwsjsyr_Jg');
        const sfczsjkzgx_JgDom = $('.sfczsjkzgx_Jg');
        if(sfyblcxjl_JDom.parents('.textAraNone').length === 0 && sfyblcxjl_JDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否有不良诚信记录必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfwsjsyr_JgDom.parents('.textAraNone').length === 0 && sfwsjsyr_JgDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfczsjkzgx_JgDom.parents('.textAraNone').length === 0 && sfczsjkzgx_JgDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否存在实际控制关系必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        self.stateSave = true;
        if(self.stateSave) {
          try {
            if(obj.errors.length > 0) {
              let toast = myApp.toast('', `<div>${obj.errors[0].message}</div>`, options);
              toast.show();
              self.stateSave = false;
            } else {
              self.stateSave = true;
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      });
    }

    if(window.registerUserType === 'cp') {

    }
    validator.validate();
    return this.stateSave;
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
    const has = self.parents('.sdx-info-jux').siblings('.item-content');
    self.find('.onSelect').addClass('onSelectScale1');
    has.hasClass('textAraNone') ? has.removeClass('textAraNone') : has.addClass('textAraNone');
    self.parent('label').siblings().find('.onSelect').removeClass('onSelectScale1');
  }
  /*
   保存用户信息
   */
  preservationInfo() {
    if(this.validatorInfo()) {
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
  }
};
