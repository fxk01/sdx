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
    function validator(target, validator, errorMsg) {
      let options = {
        onHide: function () {
        },
        duration: 2000
      };
      return new Proxy(target, {
        _validator: validator,
        set(target, key, value, proxy) {
          let errMsg = errorMsg;
          if (value === '') {
            let toast = myApp.toast('', `<div>${errMsg[key]}不能为空！</div>`, options);
            toast.show();
            throw new TypeError(`${errMsg[key]}不能为空！`);
          }
          let va = this._validator[key];
          if (!va(value)) {
            return Reflect.set(target, key, value, proxy)
          } else {
            let toast = myApp.toast('', `<div>${errMsg[key]}格式不正确</div>`, options);
            toast.show();
            throw new TypeError(`${errMsg[key]}格式不正确`);
          }
        }
      })
    }
    const validators = {
      name(value) {
        return value.length > 30
      },
      passWd(value) {
        return value.length > 30
      },
    };
    const errorMsg = {
      name: '证件号码',
      passWd: '登录密码',
    };
    const vaLi = validator({}, validators, errorMsg);
    let validatorNext = function* () {
      yield vaLi.name = $(`input[name='username']`).val();
      yield vaLi.passWd = $(`input[name='password']`).val();
    };
    let _validator = validatorNext();
    _validator.next();
    !vaLi.name || _validator.next();
    !vaLi.passWd || _validator.next();
    // if(!btnActivation.hasClass(('btn--activated'))) {
    //   btnActivation.removeClass('btn--activate');
    //   btnActivation.addClass('btn--waiting');
    // }
    LoginStore.postUserLogin({
      data: {
        action: 'UserLogin',
        cid: sessionStorage.getItem('cid'),
        company_type: sessionStorage.getItem('company_type'),
        username: vaLi.name,
        password: vaLi.passWd,
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
        this.name = vaLi.name;
        this.passWd = vaLi.passWd;
        this.res = res;
        if(sessionStorage.getItem('phone') !== '') {
          $$('#registerForm').fadeOut('slow', function() {
            $$('#registerFormYzm').fadeIn();
          });
        } else {
          this.btnHrefHome(vaLi.name, vaLi.passWd, res);
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
      if(sessionStorage.getItem('company_type') === '1') {
        window.location.href = `${Constant.Href_Route}fund.html`
      } else {
        window.location.href = `${Constant.Href_Route}stockRight.html`
      }
      btnActivation.removeClass('btn--waiting');
      btnActivation.addClass('btn--activate');
      let cookieName = new Cookie('name');
      let cookiePassWd = new Cookie('pas');
      let cookieCid = new Cookie('cid');
      let cookieCompanyType = new Cookie('company_type');
      cookieName.setCookie(name, 3);
      cookiePassWd.setCookie(passWd, 3);
      cookieCid.setCookie(res.cid, 3);
      cookieCompanyType.setCookie(res['companyType'], 3);
    }, 1200);
  }
};
