/**
 * 投诉及建议逻辑
 */

'use strict';
import './complaint.less';
import complaintTpl from './complaint.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';
import complaintStore from '../../store/complaint_store';
import '../../components/toast/toast.css';
import '../../components/toast/toast';

export default class Complaint extends widget {
  init(page) {
    $('.view').attr('data-page', 'complaint');
    let pageLeg = $('.complaint-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _complaintTpl = Tool.renderTpl(complaintTpl);
    $('.complaint-page').html('').append($(_complaintTpl));

    $('.comHrefFund').on('click', () => { window.location.href = `${Constant.Href_Route}fund.html?tab3=active`; });
    $('.framework7-root').on('click', '.complaint', () => { this.comTouSu(); });
  }
  /*
   投诉
   */
  comTouSu() {
    complaintStore.postTouSuJianYi({
      data: {
        action: 'TouSuJianYi',
        name: sessionStorage.getItem('cid'),
        idCard: sessionStorage.getItem('companyUser'),
        content: $('#comPlaText').val(),
        cId: sessionStorage.getItem('cid'),
      }
    }, (res) => {
      let options = {
        onHide: function () {
        },
        duration: 2000
      };

      if(res.result === 'OK') {
        let toast = myApp.toast('', `<div>感谢您的建议</div>`, options);
        toast.show();
      } else {
        let toast = myApp.toast('', `<div>接口报错</div>`, options);
        toast.show();
      }
    })
  }
};
