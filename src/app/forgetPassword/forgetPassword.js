/**
 * 基本信息逻辑
 */

'use strict';
import './forgetPassword.less';
import forgetPasswordTpl from './forgetPassword.tpl.html';
import Tool from '../../utils/tool';
import modiFyPs from '../../components/modify-ps/modify-ps.html';
import '../../components/modify-ps/modify-ps.less';
import widget from '../../utils/widget';
import $$ from 'jquery';
import '../../components/toast/toast.css';
import '../../components/toast/toast';
import Validator from 'validator.tool';
import forgetPwStore from '../../store/forgetPw_store';
import Constant from '../../utils/constant';

export default class ForgetPassword extends widget {
  constructor() {
    super();
  }

  init() {
    try {
      let self = this;

      $('.view').attr('data-page', 'forgetPassword');
      let pageLeg = $('.forgetPassword-page').length;
      if(pageLeg === 0) {
        window.location.reload();
      }
      this.apTpl();

      this.pickerZjLx();
      $$('.framework7-root').on('click', '.modifyRegLogin', () => { window.location.href = `${Constant.Href_Route}login.html`; });
      $$('.forget').on('click', '.sdx-ps-yzm', function() { self.postYzm(); });
      $$('.forget').on('click', '.sdx-ps-bc', function() { self.validOne(); })
    } catch (e) {
      console.log(e.message);
    }
  }
  apTpl() {
    let _forgetPasswordTpl = Tool.renderTpl(forgetPasswordTpl);
    $('.forgetPassword-page').html('').append($(_forgetPasswordTpl));
    $('.forget').append($(Tool.renderTpl(modiFyPs)));
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
    let options = {
      duration: 2000,
    };
    let validator = new Validator('example_one', [
      {
        name: 'name',
        display: '真实姓名不能为空',
        rules: 'required'
      },
      {
        name: 'card_type',
        display: '证件类型不能为空',
        rules: 'required'
      },
      {
        name: 'id_card',
        display: '证件号码不能为空',
        rules: 'required'
      },
      {
        name: 'phone',
        display: '手机号码不能为空|手机号码格式不正确',
        rules: 'required|is_phone'
      },
      {
        name: 'pin',
        display: '验证码不能为空',
        rules: 'required'
      },
      {
        name: 'password',
        display: '新密码不能为空',
        rules: 'required'
      },
      {
        name: 'rePassWorld',
        display: '密码不一致',
        rules: 'same(password)|required'
      },
    ], function(obj) {
      try {
        if(obj.errors.length > 0) {
          let toast = myApp.toast('', `<div>${obj.errors[0].message}</div>`, options);
          toast.show();
        } else {
          let liZe = $$('#example_one').serializeArray();
          let o = {};
          $$.each(liZe, function() {
            if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
            } else {
              o[this.name] = this.value || '';
            }
          });
          delete o['rePassWorld'];
          forgetPwStore.posUpdateUser({
            data: {
              action: 'UpdateUser',
              cid: sessionStorage.getItem('cid'),
              ...o,
            }
          }, (res) => {
            if(res.result === 'NG') {
              let toast = myApp.toast('', `<div>${res.error_message}</div>`, options);
              toast.show();
            } else {
              let toast = myApp.toast('', `<div>修改密码成功</div>`, options);
              toast.show();
            }
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    });
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
    forgetPwStore.postPin({
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
