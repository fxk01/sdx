/**
 * 登录业务逻辑
 */

'use strict';
import './login.less';
import '../../components/toast/toast.css';
import '../../components/toast/toast';
import loginTpl from './login.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import LoginStore from '../../store/login_store';
import Constant from '../../utils/constant';
import $$ from 'jquery';
import Cookie from '../../../src/components/cookie';

export default class Login extends widget {
  static defaultHtml = {
    tem: `<div style="text-align: left;">尊敬的投资者</div>`,
  };

  constructor() {
    super();
  }

  init(page) {
    $('.view').attr('data-page', 'login');
    let pageLeg = $('.login-page').length;
    // console.log(pageLeg);
    if(pageLeg === 0) {
      // $('#root').html('');
      window.location.reload();
    }
    if(pageLeg === 1) {
      myApp.modal({
        title: '风险提示',
        text: Login.defaultHtml.tem,
        buttons: [
          {
            text: '已知悉，继续浏览',
            onClick: function() {
              myApp.loginScreen();
              if(document.cookie.indexOf('name') >= 0) {
                $(`input[name='username']`).val(new Cookie('name').getCookie());
              }
            }
          },
        ],
      });
    }
    this.apTpl();
    if(!sessionStorage.getItem('cid') && page.query.cid === undefined) {
      window.location.href = `${Constant.Href_Route}main.html`;
    }
    if(!sessionStorage.getItem('cid')) {
      this.analysisCid(page);
    }
    let _loginTpl = Tool.renderTpl(loginTpl);
    $('.login-page').html('').append($(_loginTpl));
    $('.modal').addClass('modal-login');
    this.screen = $('.login-screen');
    this.screen.on('click', '.sdx-link-login', () => { this.loginHome(); });
    this.agreementMessage();
    $('.framework7-root').on('click', '#modifyLogin', () => { window.location.href = `${Constant.Href_Route}forgetPassword.html`; });
    $('.framework7-root').on('click', '#registerHref', () => { window.location.href = `${Constant.Href_Route}register.html`; });
    $('.framework7-root').on('click', '#btnSendCode1', () => { this.sendMessage(); });
    $('.framework7-root').on('click', '#btnActivation', () => { this.btnYzm(); });
  }

  apTpl() {
    let _loginTpl = Tool.renderTpl(loginTpl);
    $('.forgetPassword-page').html('').append($(_loginTpl));
  }
  /*
   验证验证码
   */
  btnYzm() {
    let options = {
      duration: 2000
    };
    let phoneYzm = $$.trim($('#loginYzm').val());
    LoginStore.postPinCheck({
      data: {
        action: 'PinCheck',
        cid: sessionStorage.getItem('cid'),
        phone: sessionStorage.getItem('phone'),
        pinCode: phoneYzm,
      }
    }, (res) => {
      if(res.result === 'OK') {
        this.btnHrefHome(this.name, this.passWd, this.res);
      } else {
        let toast = myApp.toast('', `<div>验证码不正确！</div>`, options);
        toast.show();
      }
    });
  }
  /*
   获取验证码
   */
  sendMessage() {
    myApp.showIndicator();
    let count = 60;
    let InterValObj1;
    let curCount1;
    function SetRemainTime1() {
      if (curCount1 === 0) {
        window.clearInterval(InterValObj1);
        $("#btnSendCode1").removeAttr("disabled");
        $("#btnSendCode1").val("重新发送");
      }
      else {
        curCount1--;
        $("#btnSendCode1").val( + curCount1 + "秒再获取");
      }
    }

    curCount1 = count;
    $("#btnSendCode1").attr("disabled", "true");
    $("#btnSendCode1").val( + curCount1 + "秒再获取");
    LoginStore.postPinYzm({
      data: {
        action: 'pin',
        phone: sessionStorage.getItem('phone'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        myApp.hideIndicator();
        InterValObj1 = window.setInterval(SetRemainTime1, 1000);
      }
    });
  }
  /*
   风险提示说明
   */
  agreementMessage() {
    $('.modal-login .modal-text').addClass('md-lg-ct');
    LoginStore.postAgreementMessage({
      data: {
        action: 'AgreementMessage',
        cid: sessionStorage.getItem('cid'),
        type: 3,
      }
    }, (res) => {
      $('.md-lg-ct').html(res['AgreementMessageList'][0].content);
    })
  }
  /*
   登陆
   */
  loginHome() {
    // let btnActivation = $('#btnActivation');
    let options = {
      onHide: function () {
      },
      duration: 2000
    };

    // function validator(target, validator, errorMsg) {
    //   let options = {
    //     onHide: function () {
    //     },
    //     duration: 2000
    //   };
    //   return new Proxy(target, {
    //     _validator: validator,
    //     set(target, key, value, proxy) {
    //       let errMsg = errorMsg;
    //       if (value === '') {
    //         alert(111);
    //         let toast = myApp.toast('', `<div>${errMsg[key]}不能为空！</div>`, options);
    //         toast.show();
    //         // throw new TypeError(`${errMsg[key]}不能为空！`);
    //       }
    //       let va = this._validator[key];
    //       if (!va(value)) {
    //         return Reflect.set(target, key, value, proxy)
    //       } else {
    //         alert(222);
    //         let toast = myApp.toast('', `<div>${errMsg[key]}格式不正确</div>`, options);
    //         toast.show();
    //         // throw new TypeError(`${errMsg[key]}格式不正确`);
    //       }
    //     }
    //   })
    // }
    // const validators = {
    //   name(value) {
    //     return value.length > 30
    //   },
    //   passWd(value) {
    //     return value.length > 30
    //   },
    // };
    // const errorMsg = {
    //   name: '证件号码',
    //   passWd: '登录密码',
    // };
    // const vaLi = validator({}, validators, errorMsg);
    // let validatorNext = function* () {
    //   yield vaLi.name = $(`input[name='username']`).val();
    //   yield vaLi.passWd = $(`input[name='password']`).val();
    // };
    // let _validator = validatorNext();
    // _validator.next();
    // !vaLi.name || _validator.next();
    // !vaLi.passWd || _validator.next();

    if($(`input[name='username']`).val() === '') {
      let toast = myApp.toast('', `<div>证件号码不能为空！</div>`, options);
      toast.show();
      return;
    }
    if($(`input[name='password']`).val() === '') {
      let toast = myApp.toast('', `<div>登陆密码不能为空！</div>`, options);
      toast.show();
      return;
    }

    // if(!btnActivation.hasClass(('btn--activated'))) {
    //   btnActivation.removeClass('btn--activate');
    //   btnActivation.addClass('btn--waiting');
    // }
    LoginStore.postUserLogin({
      data: {
        action: 'UserLogin',
        cid: sessionStorage.getItem('cid'),
        company_type: sessionStorage.getItem('company_type'),
        username: $(`input[name='username']`).val(),
        password: $(`input[name='password']`).val(),
      }
    }, (res) => {
      if(res['result'] === 'NumNG') {
        myApp.alert('账号或密码错误！', '提示');
      } else if(res.result === 'InterNG') {
        myApp.alert('网络故障。', '提示');
      }else if(res.result === 'RoleNG') {
        myApp.alert('该用户目前暂无任何角色，无法登录。', '提示');
      } else {
        for(let key in res) {
          if(key !== 'result') {
            sessionStorage.setItem(key, res[key]);
          }
        }
        this.name = $(`input[name='username']`).val();
        this.passWd = $(`input[name='password']`).val();
        this.res = res;
        if(sessionStorage.getItem('phone') !== '') {
          $$('#registerForm').fadeOut('slow', function() {
            $$('#registerFormYzm').fadeIn();
          });
        } else {
          this.btnHrefHome($(`input[name='username']`).val(), $(`input[name='password']`).val(), res);
        }
      }
      // btnActivation.removeClass('btn--waiting');
      // btnActivation.addClass('btn--activate');
    });
  }
  btnHrefHome(name, passWd, res) {
    let btnActivation = $('.btnActivation');
    if(!btnActivation.hasClass(('btn--activated'))) {
      btnActivation.removeClass('btn--activate');
      btnActivation.addClass('btn--waiting');
    }
    setTimeout(() => {
      btnActivation.removeClass('btn--waiting');
      btnActivation.addClass('btn--activate');
      let cookieName = new Cookie('name');
      let cookiePassWd = new Cookie('pas');
      let cookieCid = new Cookie('cid');
      let cookieCompanyType = new Cookie('company_type');
      cookieName.setCookie(name, 30);
      cookiePassWd.setCookie(passWd, 30);
      cookieCid.setCookie(res.cid, 30);
      cookieCompanyType.setCookie(res['companyType'], 30);

      if(sessionStorage.getItem('company_type') === '1') {
        window.location.href = `${Constant.Href_Route}fund.html`
      } else {
        window.location.href = `${Constant.Href_Route}stockRight.html`
      }
    }, 1200);
  }
};
