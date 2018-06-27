/**
 * 资信证明业务逻辑
 */

'use strict';
import './certificate.less';
import certificateTpl from './certificate.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import regFourTpl from '../../components/regFour-tpl/regFour-tpl.html';

export default class Certificate extends widget {
  init(page) {
    $('.view').attr('data-page', 'certificate');
    let pageLeg = $('.certificate-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _certificateTpl = Tool.renderTpl(certificateTpl);
    $('.certificate-page').html('').append($(_certificateTpl));

    let _regFourTpl = Tool.renderTpl(regFourTpl, {
      user_type: window.regType,
    });
    $('.regFourTpl').append($(_regFourTpl));
    // $('.comHrefFund').on('click', () => { this.fundStockHref('?tab3=active'); });
  }
};
