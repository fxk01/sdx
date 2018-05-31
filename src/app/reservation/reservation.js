/**
 * 交易记录逻辑
 */

'use strict';
import './reservation.less';
import reservationTpl from './reservation.tpl.html';
import Tool from '../../utils/tool';
import reservationStore from '../../store/reservation_store';
import widget from '../../utils/widget';
import Constant from '../../utils/constant';
import '../../components/toast/toast.css';
import '../../components/toast/toast';

export default class Reservation extends widget {
  init() {
    $('.view').attr('data-page', 'reservation');
    let pageLeg = $('.reservation-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _reservationTpl = Tool.renderTpl(reservationTpl, {
      code: Tool.parseURL('code'),
    });
    $('.reservation-page').append($(_reservationTpl));

    this.fundStockName();
    $('.ac-sg').on('click', () => { this.clickSg(); });
    $('.ac-bz').on('click', () => { this.clickBz(); });
    $('.make').on('click', () => { this.yyMake(); });
    $('.reHrefRegFundDe').on('click', () => { this.fundStockDetail(`?code=${Tool.parseURL('code')}`); })
  }
  clickSg() {
    let buttons = [
      {
        text: '申购',
        onClick: function(p) {
          $('.sgText').attr('data-val', 1).text('申购');
        }
      },
      {
        text: '赎回',
        onClick: function() {
          $('.sgText').attr('data-val', 2).text('赎回');
        }
      },
      {
        text: '取消',
        color: 'red',
        onClick: function() {
        }
      },
    ];
    myApp.actions(buttons);
  }
  clickBz() {
    let buttonsBz = [
      {
        text: 'CNY 人民币',
        onClick: function(p) {
          $('.shText').attr('data-val', 1).text('CNY 人民币');
        }
      },
      {
        text: 'USD 美元',
        onClick: function(p) {
          $('.shText').attr('data-val', 2).text('USD 美元');
        }
      },
      {
        text: 'AUD 澳元',
        onClick: function(p) {
          $('.shText').attr('data-val', 3).text('AUD 澳元');
        }
      },
      {
        text: 'HKD 港币',
        onClick: function(p) {
          $('.shText').attr('data-val', 4).text('HKD 港币');
        }
      },
      {
        text: 'CNH 离岸人民币',
        onClick: function() {
          $('.shText').attr('data-val', 5).text('CNH 离岸人民币');
        }
      },
      {
        text: '取消',
        color: 'red',
        onClick: function() {
          $('.shText').attr('data-val', 0).text('请选择币种');
        }
      },
    ];
    myApp.actions(buttonsBz);
  }
  /*
   预约提交
   */
  yyMake() {
    let shText = $('.shText').attr('data-val');
    let nameVal = $('input[name="color"]').val();
    if(shText === '0') {
      myApp.alert('请选择币种', '提示');
      return false;
    }
    if(nameVal < 1) {
      myApp.alert('预约金额不正确', '提示');
      return false;
    }
    reservationStore.postYuYueChanPin({
      data: {
        action: 'YuYueChanPin',
        cid: sessionStorage.getItem('cid'),
        chanpinid: sessionStorage.getItem('chanPinId'),
        userType: sessionStorage.getItem('sfwzytzz'),
        zhanghao : sessionStorage.getItem("idCard"),
        yuyue_money: nameVal,
        yuyue_type: $('.sgText').attr('data-val'),
        userName: sessionStorage.getItem('companyUser'),
        chanpinName: decodeURIComponent(Tool.parseURL('name')),
        yuyue_money_type: shText,
      }
    }, (res) => {
      if(res['result'] === 'OK') {
        let modal = myApp.modal({
          title: `<div style="padding: 0.5rem 0 0.2rem 0;"><img src="${Constant.SERVER_URL}dist/images/yycg.png" style="vertical-align: middle;"><span class="content-popup-text">预约成功</span></div>`,
          text: `<div class="set-column-pText">我们的工作人员会尽快与您联系感谢您的信任与支持</div>`,
          buttons: [
            {
              text: `<div style="width: 100%; height: 2.5rem;"><img src="${Constant.SERVER_URL}dist/images/confirm.png"></div>`,
              onClick: function () {
              }
            },
          ]
        });
        $('.modal ').addClass('modalYy');
      } else {
        let options = {
          onHide: function () {
          },
          duration: 2000
        };

        let toast = myApp.toast('', `<div>预约失败，金额必须是整数</div>`, options);
        toast.show();
      }
    })
  }
};
