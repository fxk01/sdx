/**
 * 证劵产品逻辑
 */

'use strict';
import './fund.less';
import fundTpl from './fund.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget'
import FundStore from '../../store/fund_store';
import CountUp from '../../components/countUp';
import fundProducts from '../../components/fund-products/fund-products.html'
import fundInfoList from '../../components/fund-infoList/fund-infoList.html';
import userFdInformation from '../../components/user-fd-information/user-fd-information.html';
import userFdInformation2 from '../../components/user-fd-infomation2/user-fd-information2.html';
import fundAsset from '../../components/fund-asset/fund-asset.html';
import highCharts from 'highcharts';
import Constant from '../../utils/constant';
import $$ from 'jquery';
import Cookie from '../../../src/components/cookie';

export default class Fund extends widget {
  constructor() {
    super();
    this.show = false;
    this.showGood = false;
  }

  init(page) {
    let self = this;
    if(sessionStorage.getItem('cid')) {
      if(sessionStorage.getItem('idCard') === undefined || sessionStorage.getItem('idCard') === null) {
        window.location.href = `${Constant.Href_Route}login.html`;
      }
    } else {
      window.location.href = `${Constant.Href_Route}main.html`;
    }
    $('.view').attr('data-page', 'fund');
    let pageLeg = $('.fund-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    this.apTpl();

    this.fundHomeData();
    this.fundListContent();

    FundStore.messageGetProduct({
      data: {
        action: 'Message',
        method: 'getProductMessage',
        cid: sessionStorage.getItem('cid'),
        idCard: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      if(res.msgSize > 0) {
        $$('.sysMsg').show().html(res.msgSize);
      } else {
        $$('.sysMsg').hide();
      }
    });

    $('.showHdAssets').on('click', (e) => { this.showAssets(e); });
    $('.showFundGoods').on('click', (e) => { this.showGoods(e); });
    $$('.framework7-root').on('click', '.infoListGoods .accordion-item', function() { let itemSelf = $(this); self.openData(itemSelf); });
    $('.pullFundHome').on('refresh', () => { this.fundHomeData(); });
    $('.pullFund').on('refresh', () => {
      this.fundListContent().then(function(str) {
        if(str) {
          myApp.pullToRefreshDone();
        }
      });
    });
    $$('.framework7-root').on('click', '.questionHref, .retestQuestion', function() {let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}questionnaire.html?val=${_val}&xz=${$$(this).attr('data-xz')}` });
    $$('.framework7-root').on('click', '.questionHref2, .retestQuestion2', function() { let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}questionnaire.html?tab3=active&val=${_val}&xz=${$$(this).attr('data-xz')}` });
    $$('.framework7-root').on('click', '.hrefYgCp', () => { window.location.href = `${Constant.Href_Route}purchasedProducts.html`; });
    $$('.framework7-root').on('click', '.hrefJyJl', () => { window.location.href = `${Constant.Href_Route}record.html`; });
    $$('.framework7-root').on('click', '.hrefJbXx', () => { window.location.href = `${Constant.Href_Route}userInformation.html`; });
    $$('.framework7-root').on('click', '.hrefXgMm', () => { window.location.href = `${Constant.Href_Route}modifyPassword.html`; });
    $$('.framework7-root').on('click', '.hrefTsJy', () => { window.location.href = `${Constant.Href_Route}complaint.html`; });
    $$('.framework7-root').on('click', '.hrefZxZm', () => { window.location.href = `${Constant.Href_Route}certificate.html`; });
    $$('.framework7-root').on('click', '.hrefLoginOut', () => { self.loginOut(); });
    $$('.framework7-root').on('click', '.fund-ld', () => {
      let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}smallBell.html?val=${_val}&xz=${$$(this).attr('data-xz')}`
    });
    $$('.framework7-root').on('click', '.fund-ld2', () => {
      let _val = $$(this).attr('data-val'); window.location.href = `${Constant.Href_Route}smallBell.html?tab3=active&val=${_val}&xz=${$$(this).attr('data-xz')}`
    });
    $$('.framework7-root').on('click', '.toolbar-inner .tab-link', function() {
      let stateObject = {};
      let title = '';
      let newUrl;
      let href = $$(this).attr('href');
      if(href === '#tab2') {
        newUrl = `${Constant.Href_Route}fund.html?tab2=active`;
        history.pushState(stateObject, title, newUrl);
      } else if(href === '#tab1') {
        newUrl = `${Constant.Href_Route}fund.html`;
        history.pushState(stateObject, title, newUrl);
      } else {
        newUrl = `${Constant.Href_Route}fund.html?tab3=active`;
        history.pushState(stateObject, title, newUrl);
      }
    });
    $$('.framework7-root').on('click', '#noTestFund', function() {
      let _val = $$(this).attr('data-val');
      window.location.href = `${Constant.Href_Route}questionnaire.html?val=${_val}&xz=${$$(this).attr('data-xz')}`
    });
  }
  apTpl() {
    let _idCard = sessionStorage.getItem('idCard');
    myApp.closeModal('.modal-main');
    let _fundTpl = Tool.renderTpl(fundTpl);
    $('.fund-page').html('').append($(_fundTpl));
    $('.userFundInformation').append(userFdInformation);
    $('.userFundInformation2').append(userFdInformation2);
    $('.fundUser').text(sessionStorage.getItem('companyUser'));
    $('.fundIdCard').text(_idCard.substr(0,2) + '**************' + _idCard.substr(_idCard.length-2, 2));

    if(Tool.parseURL('tab2')) {
      $('.tab').removeClass('active');
      $('#tab2').addClass('active');
    }
    if(Tool.parseURL('tab3')) {
      $('.tab').removeClass('active');
      $('#tab3').addClass('active');
    }
  }
  /*
   退出
   */
  loginOut() {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('companyUser');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cardType');
    sessionStorage.removeItem('idCard');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('qTime');
    sessionStorage.removeItem('qScore');
    sessionStorage.removeItem('userType');
    new Cookie('name').delCookie();
    new Cookie('pas').delCookie();
    window.location.href = `${Constant.Href_Route}login.html`;
  }
  /*
   基金产品首页内容
   */
  fundHomeData() {
    Promise.all([this.postRiskTolerance(), this.postAssetsChart(), this.postAssetProfile()]).then(([ret1, ret2, ret3]) => {
      if(ret3 === 'c') {
        myApp.pullToRefreshDone();
      }
    });
  }
  /*
   获取风险承受能力
   */
  postRiskTolerance() {
    return new Promise((resolve) => {
      let assessmentResultDom = $('.assessmentResult');
      let gradeDom = $('.grade');
      let insertAnswerDateDom = $('.insertAnswerDate');
      let insertAnswerBetweenDaysDom = $('.insertAnswerBetweenDays');
      FundStore.postGetAnswer({
        data: {
          action: 'GetAnswer',
          cid: sessionStorage.getItem('cid'),
          accountId: sessionStorage.getItem('userId'),
          grade: sessionStorage.getItem('qScore'),
          topicType: sessionStorage.getItem('company_type'),
        }
      }, (res) => {
        if(sessionStorage.getItem('qScore') === '-1') {
          assessmentResultDom.text('未测评');
          gradeDom.text('未测评。').css({
            'font-weight': 'bold'
          });
          insertAnswerDateDom.html('-');
          insertAnswerBetweenDaysDom.html('-');
        } else {
          assessmentResultDom.text(res['assessment']);
          gradeDom.text(sessionStorage.getItem('qScore') + '分，');
          insertAnswerDateDom.html(sessionStorage.getItem('qTime').substring(0, 11).replace(/\//g, '.'));
          insertAnswerBetweenDaysDom.html(sessionStorage.getItem('betweenDays') + '天');
          if(sessionStorage.getItem('betweenDays') < 0) {
            insertAnswerBetweenDaysDom.html('已到期');
          }
          if(sessionStorage.getItem('betweenDays') < 0 && sessionStorage.getItem('sfwzytzz') !== '1') {
            window.myApp.alert('<span class="bcztdq2">为了您正常访问基金产品信息，请重新测评风险承受能力。</span>', '<div><img src="images/gq.png" style="margin-left: -0.26666667rem;"></div><span class="bcztdq">您的风险调查问卷结果已到期!</span>', function() {
              window.location.href = `${Constant.Href_Route}questionnaire.html?val=cxCs&xz=`
            });
          }
        }
        sessionStorage.setItem('riskTolerance', res.assessment);
        resolve('a');
      })
    })
  }
  /*
   获取用户产品
   */
  postAssetsChart() {
    return new Promise((resolve) => {
      FundStore.postRgUserChanPin({
        data: {
          action: 'GetRgUserChanPin',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
        }
      }, (res) => {
        if(res['result'] === 'OK') {
          this.yhZiChan(res['chanpinList']).then((r1) => {
            resolve(r1);
          });
        } else {
          alert('接口错误！');
        }
      });
    });
  }
  /*
   获取资产概况&资产走势
   */
  yhZiChan(cp) {
    return new Promise((resolve) => {
      FundStore.postYonghuZichan({
        data: {
          action: 'yonghuZichan',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
          ids: cp,
        }
      }, (res) => {
        let _arrXDate = [];
        let _arrData = [];
        let json = res.zichan;
        // json.capital = this.formatNumber(json['capital'], 2);
        // json.profit = this.formatNumber(json['profit'], 2);
        let echoTpl = Tool.renderTpl(fundAsset, json);
        $('.sdx-fund-sec').html('').append($(echoTpl));
        let options = {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
        };
        new CountUp('myTargetElement', 0, json['capital'], 0, 2.5, options).start();
        new CountUp('myTargetElementSyE', 0, json['profit'], 0, 2.5, options).start();
        new CountUp('myTargetElementSyL', 0, json['returnRate'], 0, 2.5, options).start();
        for(let i = 0; i < res.zichan['zoushi'].length; i++) {
          _arrData.push(res.zichan['zoushi'][i].capital);
          _arrXDate.push(res.zichan['zoushi'][i].date.substring(0, 10).replace(/\//g, "."))
        }
        highCharts.chart('containerTrend', {
          chart: {
            // type: 'area',
            plotBackgroundColor: '#ffe2d6',
          },
          title: {
            text: ' '
          },
          credits: {
            enabled: false
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 150,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: (highCharts.theme && highCharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          xAxis: {
            lineWidth: 0,
            tickWidth: 0,
            tickInterval: res.zichan['zoushi'].length - 1,
            categories: _arrXDate,
            plotBands: [{
              from: 4.5,
              to: 6.5,
            }]
          },
          yAxis: {
            title: {
              text: ' '
            }
          },
          tooltip: {
            shared: true,
            valueSuffix: ''
          },
          plotOptions: {
            areaspline: {
              fillOpacity: 0.5
            }
          },
          series: [{
            name: '资金',
            data: _arrData,
            turboThreshold: 0,
            color: '#ff1919',
          }]
        });
        resolve('b');
      });
    })
  }
  /*
   获取已购产品
   */
  postAssetProfile() {
    return new Promise((resolve) => {
      FundStore.postYonghuChanpin({
        data: {
          action: 'yonghuChanpin',
          cid: sessionStorage.getItem('cid'),
          idCard: sessionStorage.getItem('idCard'),
          company_type: sessionStorage.getItem('company_type'),
        }
      }, (res) => {
        if(res.chanpin.length === 0) {
          $('.stockLeg0').show();
        }
        for(let i = 0; i < res['chanpin'].length; i++) {
          res['chanpin'][i]['chicang_profit'] = this.formatNumber(res['chanpin'][i]['chicang_profit'], 2);
          res['chanpin'][i]['chicang_profit_ratio'] = this.formatNumber(res['chanpin'][i]['chicang_profit_ratio'], 2) + '%';
          res['chanpin'][i]['return_rate'] = this.formatNumber(res['chanpin'][i]['return_rate'], 2);
          res['chanpin'][i]['profit'] = this.formatNumber(res['chanpin'][i]['profit'], 2);
          res['chanpin'][i]['shares'] = this.formatNumber(res['chanpin'][i]['shares'], 2);
          res['chanpin'][i]['capital'] = this.formatNumber(res['chanpin'][i]['capital'], 2);
          res['chanpin'][i]['unit_net_worth_now'] = this.formatUnitNetWorth(res['chanpin'][i]['unit_net_worth_now']);
          res['chanpin'][i]['total_unit_net_worth'] = this.formatUnitNetWorth(res['chanpin'][i]['total_unit_net_worth']);
        }
        let echoFundProductsTpl = Tool.renderTpl(fundProducts, res);
        $('.tab1BlockItem').html('').append($(echoFundProductsTpl));
        resolve('c');
      })
    })
  }
  /*
   获取基金产品列表
   */
  fundListContent() {
    return new Promise((resolve) => {
      FundStore.postChanpinList({
        data: {
          action: 'ChanpinList',
          company_type: sessionStorage.getItem('company_type'),
          cid: sessionStorage.getItem('cid'),
          qScore: sessionStorage.getItem('qScore'),
          typeJudge: sessionStorage.getItem('userType') === '个人' ? 1 : 2,
          sfwzytzz: sessionStorage.getItem('sfwzytzz'),
          idCard: sessionStorage.getItem('idCard'),
        }
      }, (res) => {
        if(res['error_code'] === 1 && res.result === 'NG') {
          $('#noTestFund').show();
        } else {
          let json = res;
          for(let i = 0; i < json['chanpin_list'].length; i++) {
            json['chanpin_list'][i].found = ((json['chanpin_list'][i].total_unit_net_worth - 1) * 100).toFixed(1);
          }
          let echoFundInfoListTpl = Tool.renderTpl(fundInfoList, json);
          $('.fundTab2Accordion').html('').append($(echoFundInfoListTpl));
        }
        resolve(true);
      });
    });
  }
  /*
   显示隐藏资产
   */
  showAssets(e) {
    if(this.show) {
      $('.showMoney').show();
      $('.hideMoney').hide();
      e.target.src = `${Constant.SERVER_URL}dist/images/home_openeye.png`;
      this.show = false;
    } else {
      $('.showMoney').hide();
      $('.hideMoney').show();
      e.target.src = `${Constant.SERVER_URL}dist/images/home_closeeye.png`;
      this.show = true;
    }
  }
  /*
   显示隐藏资产已购产品信息
   */
  showGoods(e) {
    if(this.showGood) {
      $('.showGoodField').show();
      $('.hideGoods').hide();
      e.target.src = `${Constant.SERVER_URL}dist/images/home_openeye.png`;
      this.showGood = false;
    } else {
      $('.showGoodField').hide();
      $('.hideGoods').show();
      e.target.src = `${Constant.SERVER_URL}dist/images/home_closeeye.png`;
      this.showGood = true;
    }
  }
  /*
   设置openData及跳转
   */
  openData(itemSelf) {
    sessionStorage.setItem('chanPinId', itemSelf.attr('data-chanpinid'));
    window.location.href = `${Constant.Href_Route}fundDetail.html?code=${itemSelf.attr('data-chanpincode')}`;
  }
};
