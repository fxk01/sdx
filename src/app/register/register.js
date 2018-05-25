/**
 * 注册逻辑
 */

'use strict';
import './register.less';
import registerTpl from './register.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';
import $$ from 'jquery';
import regStore from '../../store/reg_store';
import regTypeTpl from '../../components/reg_one/reg_one.html';
import '../../components/user-info/user-info.less';
import regTwoTpl from '../../components/regTwo-tpl/regTwo-tpl.html';
import Validator from 'validator.tool';

export default class Record extends widget {
  constructor() {
    super();
    this.stateSave = true;
  }

  init() {
    let self = this;
    $('.view').attr('data-page', 'register');
    let pageLeg = $('.register-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _registerTpl = Tool.renderTpl(registerTpl);
    $('.register-page').append($(_registerTpl));

    this.che();
    $('.framework7-root').on('click', '.registerHrefFund', () => { window.location.href = `${Constant.Href_Route}login.html`; });
    $('.framework7-root').on('click', '.sdx-reg-yYzh', () => { window.location.href = `${Constant.Href_Route}login.html`; });
    $$('.framework7-root').on('click', '.sdx-ps-ulTzzLx li', function() { let that = $(this); self.stInvestor(that); });
    $$('.framework7-root').on('click', '.sdx-ps-bc', function() { self.validOne(); });
    $$('.framework7-root').on('click', '.sdx-reg-two', function() { self.validTwo(); });
    $$('.framework7-root').on('click', '.sdx-ps-yzm', function() { self.postYzm(); });
  }
  /*
   模拟复选框
   */
  che() {
    $('.checkbox').on('click', function() {
      if($(this).siblings("input[type='checkbox']").attr('checked')) {
        $(this).removeClass('cur');
        $(this).siblings("input[type='checkbox']").removeAttr('checked')
      }
      else{
        $(this).addClass('cur');
        $(this).siblings("input[type='checkbox']").attr('checked','checked')
      }
    });
  }
  /*
  选择投资者类型
  */
  stInvestor(that) {
    let self = this;
    that.css({
      'background-color': '#2745b3'
    });
    window.regType = that.attr('data-type');
    that.append('<div class="sdx-ps-gg"><img src="../../../src/assets/images/gougou.png"></div>');
    $$('.sdx-ps-tzZlx').fadeOut();
    $$('.sdx-reg-block').fadeIn();

    let _regTypeTpl = Tool.renderTpl(regTypeTpl, {
      regType: window.regType,
    });
    $('.regTypeTpl').append($(_regTypeTpl));

    let _regTwoTpl = Tool.renderTpl(regTwoTpl, {
      user_type: window.regType,
    });
    $('.regTwoTpl').append($(_regTwoTpl));
    this.pickerZjLx();
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
  选择证件类型
  */
  pickerZjLx() {
    myApp.picker({
      toolbarCloseText: '完成',
      input: '#pickerZjLx',
      cols: [
        {
          textAlign: 'center',
          values: [
            '身份证',
            '护照',
            '军官证',
            '士兵证',
            '港澳居民来往内地通行证',
            '户口本',
            '外国护照',
            '其他',
            '警官证',
            '台胞证',
            '外国人永久居住证',
          ]
        }
      ],
      onClose: function(p) {
        $('.oneType').val(p.value[0]);
      }
    });
  }
  /*
   验证
   */
  validOne() {
    let self = this;
    let options = {
      duration: 2000,
    };
    let validator;
    if(window.regType === 'gr') {
      validator = new Validator('example_oneGr', [
        {
          name: 'name',
          display: '真实姓名不能为空',
          rules: 'required'
        }, {
          name: 'card_type',
          display: '证件类型不能为空',
          rules: 'required'
        }, {
          name: 'id_card',
          display: '证件号码不能为空',
          rules: 'required'
        }, {
          name: 'phone',
          display: '手机号码不能为空|手机号码格式不正确',
          rules: 'required|is_phone'
        }, {
          name: 'pin',
          display: '验证码不能为空',
          rules: 'required'
        }, {
          name: 'password',
          display: '新密码不能为空',
          rules: 'required'
        }, {
          name: 'rePassWorld',
          display: '密码不一致',
          rules: 'same(password)|required'
        }], function(obj) {
        try {
          if(obj.errors.length > 0) {
            let toast = myApp.toast('', `<div>${obj.errors[0].message}</div>`, options);
            toast.show();
          } else {
            let cheLeg = $$('.checkbox').length;
            for(let i = 0; i < cheLeg; i++) {
              if($$('.checkbox')[i].className.indexOf('cur') < 0) {
                let toast = myApp.toast('', `<div>${$$('.checkbox')[i].getAttribute('data-cn')}</div>`, options);
                toast.show();
                return false;
              }
            }
            regStore.postUserZc({
              data: {
                action: 'UserZc',
                method: 'selectUserZcByIdCard',
                cid: sessionStorage.getItem('cid'),
                pin: $('input[name="pin"]').val(),
                phone: $('input[name="phone"]').val(),
                id_card: $('input[name="id_card"]').val(),
              }
            }, (res) => {
              if(res.result === 'NG') {
                let toast = myApp.toast('', `<div>${res.error_message}</div>`, options);
                toast.show();
              } else {
                $('.regTwo').show();
                $('.regOne').hide();
              }
            });
          }
        } catch (e) {
          console.log(e.message);
        }
      });
    }

    if(window.regType === 'jg') {

    }

    if(window.regType === 'cp') {

    }
    validator.validate()
  }
  /*
   第二步验证
   */
  validTwo() {
    let self = this;
    let options = {
      duration: 2000,
    };
    let validator;
    console.log(window.regType);
    if(window.regType === 'gr') {
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
          return false;
        }
        if(sfwsjsyr_GrDom.parents('.textAraNone').length === 0 && sfwsjsyr_GrDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          return false;
        }
        if(sfczsjkzgx_GrDom.parents('.textAraNone').length === 0 && sfczsjkzgx_GrDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否存在实际控制关系必填</div>`, options);
          toast.show();
          return false;
        }
        if(self.stateSave) {
          try {
            if(obj.errors.length > 0) {
              let toast = myApp.toast('', `<div>${obj.errors[0].message}</div>`, options);
              toast.show();
            } else {
              let leg = $$(':text').length;
              let hash = {};
              for(let i = 0; i <leg; i++) {
                let gr = $$(':text')[i].getAttribute('data-gr');
                let _val = $$(':text')[i].value;
                hash[gr] =_val;
              }
              console.log(hash);
              // regStore.postRegister({
              //   data: {
              //     action: 'Register',
              //     cid: sessionStorage.getItem('cid'),
              //     registerUserType: window.registerUserType,
              //     user_type: '个人',
              //     id_card: 'sadsadsadsa',
              //     card_type_A: '护照',
              //     name_A: '李凯明',
              //     jbr_name_A: '李凯明',
              //     phone_A: '13564303463',
              //     password_A: '111111',
              //     B_sfwzytzz: 2,
              //   }
              // }, (res) => {
              //   if(res.result === 'NG') {
              //     let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
              //     toast.show();
              //   } else {
              //
              //   }
              // });
              self.stateSave = true;
            }
          } catch (e) {
            console.log(e.message);
          }
        }
      });
    }

    if(window.regType === 'jg') {
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
      }], function(obj) {
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

    if(window.regType === 'cp') {
      validator = new Validator('newProduct', [{
        name: 'B_cp_cpmc',
        display: '产品名称不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cplx',
        display: '产品类型不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpbajg',
        display: '产品备案机构不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpclsj',
        display: '成立时间不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpbasj',
        display: '备案时间不能为空',
        rules: 'required'
      }, {
        name: 'id_card',
        display: '产品备案编号不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpcxq',
        display: '产品存续期不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cplb',
        display: '产品类别不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpgm',
        display: '产品规模不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cpglr',
        display: '产品管理人不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_cptgr',
        display: '产品托管人不能为空',
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
        name: 'B_cp_glrmc',
        display: '管理人名称不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_jglx',
        display: '机构类型不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_jgzjlx',
        display: '机构证件类型不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_jgzjbh',
        display: '机构证件编号不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_yxq',
        display: '有效期不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_jgzzzm',
        display: '机构资质证明不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_zzzsbh',
        display: '资质证书编号不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_jyfw',
        display: '经营范围不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_zcdz',
        display: '注册地址不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_bgdz',
        display: '办公地址不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_zczb',
        display: '注册资本不能为空',
        rules: 'required'
      }, {
        name: 'B_cp_sjkzr',
        display: '控股股东或实际控制人不能为空',
        rules: 'required'
      }], function(obj) {
        const sfyblcxjl_cpDom = $('.sfyblcxjl_cp');
        const sfwsjsyr_cpDom = $('.sfwsjsyr_cp');
        const sfczsjkzgx_cpDom = $('.sfczsjkzgx_cp');
        if(sfyblcxjl_cpDom.parents('.textAraNone').length === 0 && sfyblcxjl_cpDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>是否有不良诚信记录必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfwsjsyr_cpDom.parents('.textAraNone').length === 0 && sfwsjsyr_cpDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          self.stateSave = false;
          return false;
        }
        if(sfczsjkzgx_cpDom.parents('.textAraNone').length === 0 && sfczsjkzgx_cpDom[0].value.length < 1) {
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
    validator.validate();
  }
  /*
  获取手机验证码
  */
  postYzm() {
    let options = {
      duration: 2000,
    };
    let phoneVal = $('input[name="phone"]').val();
    if(phoneVal.length !== 11) {
      let toast = myApp.toast('', `<div>手机号码格式不正确</div>`, options);
      toast.show();
      return false;
    }
    regStore.postPin({
      data: {
        action: 'pin',
        phone: phoneVal,
      }
    }, (res) => {
      if(res.result === 'NG') {
        let toast = myApp.toast('', `<div>${res['error_message']}e</div>`, options);
        toast.show();
      } else {
        this.countDown();
      }
    })
  }
  /*
   倒计时
   */
  countDown() {
    let interValObj;
    let curCount = 30;

    function SetRemainTime() {
      if (curCount === 0) {
        $$('.sdx-ps-yzm').removeAttr('disabled');
        $$('.sdx-ps-yzm').text('获取验证码');
        window.clearInterval(interValObj);
      }
      else {
        curCount--;
        $$('.sdx-ps-yzm').text('获取验证码 ' + curCount);
      }
    }
    $$('.sdx-ps-yzm').attr('disabled', 'true');

    interValObj = window.setInterval(SetRemainTime, 1000);
  }
};
