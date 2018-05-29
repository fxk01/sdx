/**
 * 投诉及建议逻辑
 */

'use strict';
import './complaint.less';
import complaintTpl from './complaint.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';

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
  }
};
