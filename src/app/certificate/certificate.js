/**
 * 资信证明业务逻辑
 */

'use strict';
import './certificate.less';
import certificateTpl from './certificate.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import regFourTpl from '../../components/regFour-tpl/regFour-tpl.html';
import '../../components/regFour-tpl/regFour-tpl.less';
import '../../components/bootstrap-fileinput/bootstrap-fileinput.css';
import '../../components/bootstrap-fileinput/bootstrap-fileinput';
import '../../components/toast/toast.css';
import '../../components/toast/toast';
import cateStore from '../../store/certificate_store';
import $$ from 'jquery';
import Constant from '../../utils/constant';

export default class Certificate extends widget {
  init(page) {
    let self = this;
    $('.view').attr('data-page', 'certificate');
    let pageLeg = $('.certificate-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _certificateTpl = Tool.renderTpl(certificateTpl);
    $('.certificate-page').html('').append($(_certificateTpl));
    this.fourTpl();
    this.selectCard();

    $('.zxHrefFund').on('click', () => { this.fundStockHref('?tab3=active'); });
    $$('.framework7-root').on('click', '#uploadSubmitGr', function() { this.dwIdNumGr(); });
    $$('.framework7-root').on('click', '#uploadSubmitGr2', function() { this.dwIdNumGrFm(); });
    $$('.framework7-root').on('click', '.addImgRen', function() { $$(this).parent().find('.upload_input').click(); });
    $$('.framework7-root').on('change', '.upload_input', function() { let that = $$(this); self.selectUploadIt(that); });
    $$('.framework7-root').on('click', '.deleteGr1, .deleteGr2', function() { let that = $$(this); self.deletePreviewImg(that); });
  }
  fourTpl() {
    let user_type = '';
    if(sessionStorage.getItem('userType') === '个人') {
      user_type = 'gr';
    }
    if(sessionStorage.getItem('userType') === '机构') {
      user_type = 'jg';
    }
    if(sessionStorage.getItem('userType') === '产品') {
      user_type = 'cp';
    }
    let _regFourTpl = Tool.renderTpl(regFourTpl, {
      user_type: user_type,
    });
    $('.regFourTpl').append($(_regFourTpl));
  }
  selectCard() {
    cateStore.selectUserZcZczmByIdCard({
      data: {
        action: 'UserZcZczm',
        method: 'selectUserZcZczmByIdCard',
        cid: sessionStorage.getItem('cid'),
        id_card: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      let json = res['userZcZczmList'];
      if(sessionStorage.getItem('userType') === '个人') {
        for(let i = 0; i <json.length; i++) {
          if(json[i]['identification_type'] !== 0) {
            if(json[i].type === '1' && json[i]['identification_type'] === 1) {
              $$('.deleteGr1').attr('data-id', json[i].id);
              $$('#preview').attr('src', Constant.SERVER_URL + json[i].path);
              $('.addImgRen1').hide();
              if(json[i].status !== 1) {
                $('.deleteGr1').show();
              }
            }
            if(json[i].type === '1' && json[i]['identification_type'] === 2) {
              $$('.deleteGr2').attr('data-id', json[i].id);
              $$('#preview2').attr('src', Constant.SERVER_URL + json[i].path);
              $('.addImgRen2').hide();
              if(json[i].status !== 1) {
                $('.deleteGr2').show();
              }
            }
            if(json[i].type === '2') {
              $('.grAssets').html(json[i]['file_name']);
            }
            if(json[i].type === '3') {
              $('.grTransaction').html(json[i]['file_name']);
            }
            if(json[i].type === '4') {
              $('.grOther').html(json[i]['file_name']);
            }
          }
        }
      }

      if(sessionStorage.getItem('userType') === '机构') {
        for(let i = 0; i <json.length; i++) {
          if(json[i]['identification_type'] !== 0) {
            if(json[i].type === '1' && json[i]['identification_type'] === 1) {
              $$('.deleteGr1').attr('data-id', json[i].id);
              $$('#preview').attr('src', Constant.SERVER_URL + json[i].path);
              $('.addImgRenJg1').hide();
              if(json[i].status !== 1) {
                $('.deleteGr1').show();
              }
            }
            if(json[i].type === '2') {
              $('.jgAssets').append(`<li>${json[i]['file_name']}</li>`);
            }
            if(json[i].type === '3') {
              $('.jgTransaction').html(json[i]['file_name']);
            }
            if(json[i].type === '4') {
              $('.jgOther').html(json[i]['file_name']);
            }
          }
        }
      }

      if(sessionStorage.getItem('userType') === '产品') {
        for(let i = 0; i <json.length; i++) {
          if(json[i]['identification_type'] !== 0) {
            if(json[i].type === '1' && json[i]['identification_type'] === 1) {
              $$('.deleteGr1').attr('data-id', json[i].id);
              $$('#preview').attr('src', Constant.SERVER_URL + json[i].path);
              $('.addImgRenCp1').hide();
              if(json[i].status !== 1) {
                $('.deleteGr1').show();
              }
            }
            if(json[i].type === '1' && json[i]['identification_type'] === 2) {
              $$('.deleteGr2').attr('data-id', json[i].id);
              $$('#preview2').attr('src', Constant.SERVER_URL + json[i].path);
              $('.addImgRen2').hide();
              if(json[i].status !== 1) {
                $('.deleteGr2').show();
              }
            }
            if(json[i].type === '2') {
              $('.cpAssets').append(`<li>${json[i]['file_name']}</li>`);
            }
            if(json[i].type === '3') {
              $('.cpOther').html(json[i]['file_name']);
            }
          }
        }
      }
    });
  }
  /*
  回显zczczm
  */
  UserZcZczm() {
    cateStore.selectUserZcZczmByIdCard({
      data: {
        action: 'UserZcZczm',
        method: 'selectUserZcZczmByIdCard',
        cid: sessionStorage.getItem('cid'),
        id_card: sessionStorage.getItem('idCard'),
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
          url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=${sessionStorage.getItem('idCard')}&type=1&identification_type=${_type}`,
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
          url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=${sessionStorage.getItem('idCard')}&type=1&identification_type=${_type}`,
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
      url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=${sessionStorage.getItem('idCard')}&type=1&identification_type=1`,
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
      url: Constant.SERVER_URL + `upload?action=uploadFile&cid=${sessionStorage.getItem('cid')}&id_card=${sessionStorage.getItem('idCard')}&type=1&identification_type=2`,
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
    cateStore.postdeleteUserZcZczm({
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
};
