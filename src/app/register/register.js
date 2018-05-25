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
import Validator from 'validator.tool';
import regTypeTpl from '../../components/reg_one/reg_one.html';
import '../../components/user-info/user-info.less';
import regTwoTpl from '../../components/regTwo-tpl/regTwo-tpl.html';


export default class Record extends widget {
  constructor() {
    super();
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
   注册&忘记密码-验证
   */
  validOne() {
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
