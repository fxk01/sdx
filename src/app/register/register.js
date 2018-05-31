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
import regThreeTpl from '../../components/regThree-tpl/regThree-tpl.html';
import '../../components/regThree-tpl/regThree-tpl.less';
import regFourTpl from '../../components/regFour-tpl/regFour-tpl.html';
import '../../components/regFour-tpl/regFour-tpl.less';
import '../../components/bootstrap-fileinput/bootstrap-fileinput.css';
import '../../components/bootstrap-fileinput/bootstrap-fileinput';
import '../../components/toast/toast.css';
import '../../components/toast/toast';

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
    this.optionsFile = {
      duration: 2000
    };

    $$('.framework7-root').on('click', '.registerHrefFund', () => { window.location.href = `${Constant.Href_Route}login.html`; });
    $$('.framework7-root').on('click', '.sdx-reg-yYzh', () => { window.location.href = `${Constant.Href_Route}login.html`; });
    $$('.framework7-root').on('click', '.sdx-ps-ulTzzLx li', function() { let that = $(this); self.stInvestor(that); });
    $$('.framework7-root').on('click', '.onRadioOnly', function() { let that = $$(this); self.threeRadio(that); });
    $$('.framework7-root').on('click', '.sdx-ps-bc', function() { self.validOne(); });
    $$('.framework7-root').on('click', '.sdx-reg-two', function() { self.validTwo(); });
    $$('.framework7-root').on('click', '.sdx-reg-Three', function() { self.validThree(); });
    $$('.framework7-root').on('click', '.sdx-ps-yzm', function() { self.postYzm(); });
    $$('.framework7-root').on('click', '.onRadio_gr2', function() { let that = $$(this); self.threeRadioGr2(that); });
    $$('.framework7-root').on('click', '#uploadSubmitGr', function() { self.dwIdNumGr(); });
    $$('.framework7-root').on('click', '#uploadSubmitGr2', function() { self.dwIdNumGrFm(); });
    $$('.framework7-root').on('click', '.sdx-zcGrSc', function() { $('#whole').click(); });
    $$('.framework7-root').on('change', '#whole', function() { let that = $$(this); self.previewImg(that); });
    $$('.framework7-root').on('click', '.sdx-reg-gb, .sdx-reg-gb2, .sdx-reg-zczmGrGb', function() { let that = $$(this); self.deletePreviewImg(that); });
    $$('.framework7-root').on('click', '.sdx-reg-Four', function() { self.fourOver(); });
    $$('.framework7-root').on('click', '.addImgRen', function() { $$(this).parent().find('.upload_input').click(); });
    $$('.framework7-root').on('change', '.upload_input', function() { let that = $$(this); self.selectUploadIt(that); });
    $$('.framework7-root').on('click', '.deleteGr1, .deleteGr2', function() { let that = $$(this); self.deletePreviewImg(that); });
    $$('.framework7-root').on('click', '.skip', function() { self.fifthSteps(); });
  }
  /*
   上传身份证正面
   */
  selectUploadIt(file) {
    let self = this;
    //H5渲染
    function html5Reader(file, pic, addImg, deleteImg) {
      let _type = file.attr('data-ideType');
      let files = file[0].files[0];
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onload = function(e){
        pic.attr('src', this.result);
      };

      if(_type === '1') {
        let dataFormGr1 = new FormData($('#uploadFormGr1')[0]);
        dataFormGr1.append('id', 'WU_FILE_1');
        dataFormGr1.append('name', files.name);
        dataFormGr1.append('type', files.type);
        dataFormGr1.append('lastModifiedDate', files.lastModifiedDate);
        dataFormGr1.append('size', files.size);

        $$.ajax({
          url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=21321gghgh&type=1&identification_type=${_type}`,
          type: 'post',
          data: dataFormGr1,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function (data) {
            if(JSON.parse(data).result === 'OK') {
              self.UserZcZczm();
              let toast = myApp.toast('', `<div>上传成功！</div>`, this.optionsFile);
              toast.show();
            }
          },
          error: function () {
            let toast = myApp.toast('', `<div>上传失败！</div>`, this.optionsFile);
            toast.show();
          }
        });
      } else {
        let dataFormGr2 = new FormData($('#uploadFormGr2')[0]);
        dataFormGr2.append("id", 'WU_FILE_1');
        dataFormGr2.append("name", file.name);
        dataFormGr2.append("type", file.type);
        dataFormGr2.append("lastModifiedDate", file.lastModifiedDate);
        dataFormGr2.append("size", file.size);

        $$.ajax({
          url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=21321gghgh&type=1&identification_type=${_type}`,
          type: 'post',
          data: dataFormGr2,
          async: false,
          cache: false,
          contentType: false,
          processData: false,
          success: function (data) {
            if(JSON.parse(data).result === 'OK') {
              self.UserZcZczm();
              let toast = myApp.toast('', `<div>上传成功！</div>`, this.optionsFile);
              toast.show();
            }
          },
          error: function () {
            let toast = myApp.toast('', `<div>删除成功</div>`, this.optionsFile);
            toast.show();
          }
        });
      }

      addImg.hide();
      deleteImg.show();
    }

    let pic = file.parent().find(".preview");
    let addImg = file.parent().find(".addImg");
    let deleteImg = file.parent().find(".delete");
    let ext = file.val().substring(file.val().lastIndexOf(".")+1).toLowerCase();

    if(ext !== 'png' && ext !== 'jpg' && ext !== 'jpeg'){
      if (ext !== '') {
        alert("图片的格式必须为png或者jpg或者jpeg格式！");
      }
      return;
    }

    let isIE = navigator.userAgent.match(/MSIE/) !== null,
      isIE6 = navigator.userAgent.match(/MSIE 6.0/) !== null,
      isIE10 = navigator.userAgent.match(/MSIE 10.0/) !== null;
    if(isIE && !isIE10) {
      file.select();
      let reallocalpath = document.selection.createRange().text;
      if (isIE6) {
        pic.attr("src",reallocalpath);
      }else{
        pic.css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")");
        pic.attr('src','data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
      }
      addImg.hide();
      deleteImg.show();
    }else {
      html5Reader(file, pic, addImg, deleteImg);
    }
  }
  /*
   fourOver下一步
   */
  fourOver() {
    const pre = $$('#preview').attr('src');
    const pre2 = $$('#preview2').attr('src');
    const img1 = $$('#img1').attr('src');
    if(pre === undefined || pre === '' || pre2 === undefined || pre2 === '') {
      let toast = myApp.toast('', `<div>身份证正反面必传！</div>`, this.optionsFile);
      toast.show();
      return false;
    }
    if(img1 === undefined) {
      let toast = myApp.toast('', `<div>资产证明必传！</div>`, this.optionsFile);
      toast.show();
      return false;
    }

    regStore.postCompanyLogBack({
      data: {
        action: 'companyLogBack',
        method: 'addAuditingLog',
        cid: sessionStorage.getItem('cid'),
        id_card: $('input[name="id_card"]').val(),
      }
    }, (res) => {
      if(res.result === 'NG') {
        let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
        toast.show();
      } else {
        this.fifthSteps(res);
      }
    });
  }
  /*
   第五步
   */
  fifthSteps(json) {
    let num = 5;
    let self = this;
    function registerSuccessPinTimeout() {
      if(num > 0) {
        $$('.Countdown').html(num + 's');
        num--;
        setTimeout(registerSuccessPinTimeout, 1000);
      }else {
        self.onAutoLogin();
      }
    }
    $('.regFour').hide();
    $('.regFive').show();
    setTimeout(registerSuccessPinTimeout, 1000);
    $$('.riskType').text(window.assessment);
  }
  /*
   跳转登陆
   */
  onAutoLogin() {
    regStore.postCompanyLogBack({
      data: {
        action: 'UserLogin',
        cid: sessionStorage.getItem('cid'),
        username: $('input[name="id_card"]').val(),
        password: $('input[name="password"]').val(),
      }
    }, (res) => {
      if(res.result === 'NG') {
        let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
        toast.show();
      } else {
        for(let key in res) {
          if(key !== 'result') {
            sessionStorage.setItem(key, res[key]);
          }
        }
        this.fundStockHref('?tab2=');
      }
    });
  }
  /*
   删除图片
   */
  deletePreviewImg(self) {
    if(self.attr('data-type') === '2') {
      $('.sdx-reg-zczmGrGb').hide();
      $('#img1').removeAttr('src');

      $$('.zczmGr_'+window.zCzmGr+'').html('').append('<form style="display: initial;" id="uploadFormZcZmGr'+window.zCzmGr+'" enctype=\'multipart/form-data\'><span class="sdx-zcGrSc">上传<input type="file" name="file" id="whole" apture="camera"></span></form>');
      console.log($$('.sdx-regFour-dw'))
    }
    let id = self.attr('data-id');
    regStore.postdeleteUserZcZczm({
      data: {
        action: 'UserZcZczm',
        method: 'deleteUserZcZczmById',
        zczm_id: id,
      }
    }, (res) => {
      if(res.result === 'OK') {
        if(self.attr('data-type') === '1') {
          self.parent().find('input').val('');
          self.parent().find('img.preview').attr("src","");
          self.parent().find('img.preview').css("filter","");
          self.hide();
          self.parent().find('.addImg').show();
        }
        let toast = myApp.toast('', `<div>删除成功</div>`, this.optionsFile);
        toast.show();
      } else {
        let toast = myApp.toast('', `<div>删除失败</div>`, this.optionsFile);
        toast.show();
      }
    })
  }
  /*
   回显资产证明文件
   */
  previewImg(file) {
    let self = this;
    if (window.FileReader) {
      let reader = new FileReader();
    } else {
      alert('您的设备不支持图片预览功能，如需该功能请升级您的设备！');
    }
    let preDiv = document.getElementById('wholeImg');
    if (file[0].files.length > 0) {
      let reader = new FileReader();
      reader.onload = function(e) {
        let img = document.getElementById('img1');
        img.setAttribute('src',e.target.result);
      };
      reader.readAsDataURL(file[0].files[0]);

      let files = $$('#whole')[0].files;
      let data = new FormData($$('#uploadFormZcZmGr'+window.zCzmGr+'')[0]);
      data.append('id', 'WU_FILE_1');
      data.append('name', files[0].name);
      data.append('type', files[0].type);
      data.append('lastModifiedDate', files[0].lastModifiedDate);
      data.append('size', files[0].size);
      $$.ajax({
        url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=21321gghgh&type=2&identification_type=${window.zCzmGr}`,
        type: 'POST',
        data: data,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
          if(JSON.parse(data).result === 'OK') {
            self.UserZcZczm();
            $('.sdx-reg-zczmGrGb').css({
              display: 'inline-block'
            });
            let toast = myApp.toast('', `<div>上传成功</div>`, this.optionsFile);
            toast.show();
          }
        },
        error: function (data) {
          let toast = myApp.toast('', `<div>${data.status}</div>`, this.optionsFile);
          toast.show();
        }
      });

      $$('.sdx-regFour-dw').text('');
    }
  }
  /*
   上传身份证正面
   */
  dwIdNumGr() {
    let self = this;
    let sfz1Leg = $('.thumbnailSfz1').children().length;
    let files = $$('.fileGr')[0].files;
    if(files.length === 0) {
      let toast = myApp.toast('', `<div>请上传身份证正面</div>`, this.optionsFile);
      toast.show();
      return false;
    }
    let data = new FormData($$('#uploadForm')[0]);
    data.append('id', 'WU_FILE_1');
    data.append('name', files[0].name);
    data.append('type', files[0].type);
    data.append('lastModifiedDate', files[0].lastModifiedDate);
    data.append('size', files[0].size);
    $$.ajax({
      url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=21321gghgh&type=1&identification_type=1`,
      type: 'POST',
      data: data,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        if(JSON.parse(data).result === 'OK') {
          self.UserZcZczm();
          let toast = myApp.toast('', `<div>上传成功</div>`, this.optionsFile);
          toast.show();
        }
      },
      error: function (data) {
        let toast = myApp.toast('', `<div>${data.status}</div>`, this.optionsFile);
        toast.show();
      }
    });
  }
  /*
   回显zczczm
   */
  UserZcZczm() {
    regStore.postUserZcZczm({
      data: {
        action: 'UserZcZczm',
        method: 'selectUserZcZczmByIdCard',
        cid: sessionStorage.getItem('cid'),
        id_card: '21321gghgh',
      }
    }, (res) => {
      let json = res['userZcZczmList'];
      for(let i = 0; i <json.length; i++) {
        if(json[i].type === '1' && json[i]['identification_type'] === 1) {
          $$('.deleteGr1').attr('data-id', json[i].id)
        }
        if(json[i].type === '1' && json[i]['identification_type'] === 2) {
          $$('.deleteGr2').attr('data-id', json[i].id)
        }
        if(json[i].type === '2') {
          $$('.sdx-reg-zczmGrGb').attr('data-id', json[i].id);
          $$('.sdx-reg-zczmGrGb').attr('data-type', json[i].type);
        }
      }
    })
  }
  /*
   上传身份证反面
   */
  dwIdNumGrFm() {
    let self = this;
    let files = $$('.fileGr2')[0].files;
    if(files.length === 0) {
      let toast = myApp.toast('', `<div>请上传身份证反面</div>`, this.optionsFile);
      toast.show();
      return false;
    }
    let data = new FormData($$('#uploadForm2')[0]);
    data.append('id', 'WU_FILE_1');
    data.append('name', files[0].name);
    data.append('type', files[0].type);
    data.append('lastModifiedDate', files[0].lastModifiedDate);
    data.append('size', files[0].size);
    $$.ajax({
      url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=21321gghgh&type=1&identification_type=2`,
      type: 'POST',
      data: data,
      async: false,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        if(JSON.parse(data).result === 'OK') {
          self.UserZcZczm();
          let toast = myApp.toast('', `<div>上传成功</div>`, this.optionsFile);
          toast.show();
        }
      },
      error: function (data) {
        let toast = myApp.toast('', `<div>${data.status}</div>`, this.optionsFile);
        toast.show();
      }
    });
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
    window.topicType = window.regType === 'gr' ? 1 : 2;
    that.append(`<div class="sdx-ps-gg"><img src="${Constant.SERVER_URL}dist/images/gougou.png"></div>`);
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

    let _regFourTpl = Tool.renderTpl(regFourTpl, {
      user_type: window.regType,
    });
    $('.regFourTpl').append($(_regFourTpl));

    myApp.picker({
      input: '#B_jg_jglx',
      cols: [
        {
          textAlign: 'center',
          values: [
            '证券公司',
            '证券公司子公司',
            '银行',
            '信托公司',
            '基金管理公司',
            '基金管理公司子公司',
            '保险公司',
            '私募基金管理人',
            '期货公司',
            '期货公司子公司',
            '财务公司',
            '其他境内金融机构',
            '机关法人',
            '事业单位法人',
            '社会团体法人',
            '非金融机构企业法人',
            '非金融类非法人机构',
            '境外代理人',
            '境外金融机构',
            '外国战略投资者',
            '境外非金融机构',
            '其它',
          ]
        }
      ],
      toolbarCloseText: '完成',
      closeByOutsideClick: false,
      onClose: function (p) {

      },
    });

    myApp.picker({
      input: '#B_jg_frzjlx',
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
      toolbarCloseText: '完成',
      closeByOutsideClick: false,
      onClose: function (p) {

      },
    });

    myApp.picker({
      input: '#B_jbrzjlx',
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
      toolbarCloseText: '完成',
      closeByOutsideClick: false,
      onClose: function (p) {

      },
    });

    this.pickerZjLx();
    $$('.onRadio').unbind('click').click(function(e) { let that = $$(this); self.onRadio(that); });
  }
  /*
   资产证明个人
   */
  threeRadioGr2(self) {
    window.zCzmGr = self.attr('data-val');
    if($$('#img1').attr('src') === undefined) {
      self.find('.onSelect_gr2').addClass('onSelectScale1');
      self.parent('li').siblings().find('.onSelect_gr2').removeClass('onSelectScale1');
      self.siblings('.sdx-regFour-dw').html('').append('<form style="display: initial;" id="uploadFormZcZmGr'+window.zCzmGr+'" enctype=\'multipart/form-data\'><span class="sdx-zcGrSc">上传<input type="file" name="file" id="whole" apture="camera"></span></form>');
      self.parent('li').siblings().find('.sdx-zcGrSc').remove();
    } else {
      let toast = myApp.toast('', `<div>资产证明已存在，请删除后在上传</div>`, this.optionsFile);
      toast.show();
      return false;
    }
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
   threeRadio
   */
  threeRadio(self) {
    self.find('.onSelect').addClass('onSelectScale0Only');
    self.parent('li').siblings().find('.onSelect').removeClass('onSelectScale0Only');
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
   第一步验证
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
                $('input[name="B_gr_name"]').val($('input[name="name"]').val());
                $('input[name="B_gr_card_type"]').val($('input[name="card_type"]').val());
                $('input[name="id_card"]').val($('.id_cardOne').val());
                $('input[name="B_gr_phone"]').val($('input[name="phone"]').val());
              }
            });
          }
        } catch (e) {
          console.log(e.message);
        }
      });
    }

    if(window.regType === 'jg') {
      validator = new Validator('example_oneJg', [
        {
          name: 'name',
          display: '机构名称不能为空',
          rules: 'required'
        }, {
          name: 'card_type',
          display: '机构证件类型不能为空',
          rules: 'required'
        }, {
          name: 'id_card',
          display: '机构证件编号不能为空',
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
          name: 'user_name',
          display: '真实姓名不能为空',
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
                $('input[name="B_jg_jgmc"]').val($('input[name="name"]').val());
                $('input[name="B_jg_jgzjlx"]').val($('input[name="card_type"]').val());
                $('.id_card2').val($('input[name="id_card"]').val());
                $('input[name="B_jbrxm"]').val($('input[name="user_name"]').val());
                $('input[name="B_jbrphone"]').val($('input[name="phone"]').val());
              }
            });
          }
        } catch (e) {
          console.log(e.message);
        }
      });
    }

    if(window.regType === 'cp') {
      validator = new Validator('example_oneCp', [
        {
          name: 'name',
          display: '产品名称不能为空',
          rules: 'required'
        }, {
          name: 'card_type',
          display: '产品备案编号不能为空',
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
          name: 'user_name',
          display: '真实姓名不能为空',
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
                $('input[name="B_cp_cpmc"]').val($('input[name="name"]').val());
                $('input[name="id_card"]').val($('input[name="card_type"]').val());
                $('input[name="B_jbrxm"]').val($('input[name="user_name"]').val());
              }
            });
          }
        } catch (e) {
          console.log(e.message);
        }
      });
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
              delete hash['null'];
              regStore.postRegister({
                data: {
                  action: 'Register',
                  cid: sessionStorage.getItem('cid'),
                  registerUserType: window.regType,
                  user_type: '个人',
                  id_card: $('input[name="id_card"]').val(),
                  card_type_A: $('input[name="B_gr_card_type"]').val(),
                  name_A: $('input[name="B_gr_name"]').val(),
                  jbr_name_A: $('input[name="B_gr_name"]').val(),
                  phone_A: $('input[name="phone"]').val(),
                  password_A: $('input[name="password"]').val(),
                  B_sfwzytzz: 2,
                  ...hash,
                }
              }, (res) => {
                if(res.result === 'NG') {
                  let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
                  toast.show();
                } else {
                  $('.regThree').show();
                  $('.regTwo').hide();
                  self.echoTopicList();
                }
              });
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
          return false;
        }
        if(sfwsjsyr_JgDom.parents('.textAraNone').length === 0 && sfwsjsyr_JgDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          return false;
        }
        if(sfczsjkzgx_JgDom.parents('.textAraNone').length === 0 && sfczsjkzgx_JgDom[0].value.length < 1) {
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
              delete hash['null'];
              regStore.postRegister({
                data: {
                  action: 'Register',
                  cid: sessionStorage.getItem('cid'),
                  registerUserType: window.regType,
                  user_type: '机构',
                  id_card: $('input[name="id_card"]').val(),
                  card_type_A: $('input[name="B_jg_jgzjlx"]').val(),
                  name_A: $('input[name="B_jg_jgmc"]').val(),
                  jbr_name_A: $('input[name="B_jbrxm"]').val(),
                  phone_A: $('input[name="phone"]').val(),
                  password_A: $('input[name="password"]').val(),
                  B_sfwzytzz: 2,
                  ...hash,
                }
              }, (res) => {
                if(res.result === 'NG') {
                  let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
                  toast.show();
                } else {
                  $('.regThree').show();
                  $('.regTwo').hide();
                  self.echoTopicList();
                }
              });
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
          return false;
        }
        if(sfwsjsyr_cpDom.parents('.textAraNone').length === 0 && sfwsjsyr_cpDom[0].value.length < 1) {
          let toast = myApp.toast('', `<div>交易的实际受益人必填</div>`, options);
          toast.show();
          return false;
        }
        if(sfczsjkzgx_cpDom.parents('.textAraNone').length === 0 && sfczsjkzgx_cpDom[0].value.length < 1) {
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
              delete hash['null'];
              regStore.postRegister({
                data: {
                  action: 'Register',
                  cid: sessionStorage.getItem('cid'),
                  registerUserType: window.regType,
                  user_type: '产品',
                  id_card: $('input[name="id_card"]').val(),
                  card_type_A: $('input[name="id_card"]').val(),
                  name_A: $('input[name="name"]').val(),
                  jbr_name_A: $('input[name="user_name"]').val(),
                  phone_A: $('input[name="phone"]').val(),
                  password_A: $('input[name="password"]').val(),
                  B_sfwzytzz: 2,
                  ...hash,
                }
              }, (res) => {
                if(res.result === 'NG') {
                  let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
                  toast.show();
                } else {
                  $('.regThree').show();
                  $('.regTwo').hide();
                  self.echoTopicList();
                }
              });
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
   第三步问卷回显
   */
  echoTopicList() {
    regStore.postRegister({
      data: {
        action: 'TopicList',
        cid: sessionStorage.getItem('cid'),
        topicType: window.topicType,
      }
    }, (res) => {
      if(res.result === 'NG') {
        let toast = myApp.toast('', `<div>${res['error_message']}</div>`, options);
        toast.show();
      } else {
        let _regThreeTpl = Tool.renderTpl(regThreeTpl, res);
        $('.regThreeTpl').append($(_regThreeTpl));
      }
    });
  }
  /*
   validThree
   */
  validThree() {
    let options = {
      duration: 2000,
    };
    let onlyLeg = $$('.onSelectScale0Only').length;
    let _graDeArr = [];
    let _answerList = [];
    let sum = 0;
    for(let k = 0; k < onlyLeg; k++) {
      _graDeArr.push(parseInt($$('.onSelectScale0Only')[k].getAttribute('data-grade')));
      _answerList.push(`${$$('.onSelectScale0Only')[k].getAttribute('data-grouping')+-+$$('.onSelectScale0Only')[k].getAttribute('data-grade')}`);
    }
    let i = _graDeArr.length;
    while (i--) {
      sum += parseInt(_graDeArr[i]);
    }
    regStore.postRetest({
      data: {
        action: 'Retest',
        C_grade: sum,
        C_answerList: _answerList.join(';'),
        C_topicType: window.topicType,
        cid: sessionStorage.getItem('cid'),
        id_card: $('input[name="id_card"]').val(),
      }
    }, (res) => {
      console.log(res);
      if(res.result === 'NG') {
        let toast = myApp.toast('', `<div>${res.error_message}</div>`, options);
        toast.show();
      } else {
        $('.regThree').hide();
        $('.regFour').show();
        window.assessment = res.assessment;
      }
    });
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
