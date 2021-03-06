/**
 * 基金产品公告列表
 */

'use strict';
import './questionnaire.less';
import questionnaireTpl from './questionnaire.tpl.html';
import Tool from '../../utils/tool';
import widget from '../../utils/widget';
import questionStore from '../../store/question_store';
import questionDwTpl from '../../components/questionDw-list/questionDw-list.html';
import '../../components/questionDw-list/questionDw-list.less';
import $$ from 'jquery';
import '../../components/toast/toast.css';
import '../../components/toast/toast';

export default class Questionnaire extends widget {
  init() {
    $('.view').attr('data-page', 'questionnaire');
    let pageLeg = $('.questionnaire-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _questionnaireTpl = Tool.renderTpl(questionnaireTpl);
    $('.questionnaire-page').append($(_questionnaireTpl));

    if(Tool.parseURL('xz') === 'xz') {
      $$('.dwTopicList').css({
        'height': 'auto',
        'overflow-y': 'initial',
      });
    }
    this.postTopicListDownload();
    $('.framework7-root').on('click', '.questionHrefFund', () => { const parameter = `?tab3=${Tool.parseURL('tab3') === undefined ? '' : Tool.parseURL('tab3')}`; this.fundStockHref(parameter); });
  }
  /*
   获取风险调查问卷列表
   */
  postTopicListDownload() {
    if(Tool.parseURL('val') === 'cxCs') {
      $('.xz').hide();
      $('.xyb').show();
    }
    let self = this;
    questionStore.postTopicList({
      data: {
        action: 'TopicList',
        cid: sessionStorage.getItem('cid'),
        topicType: sessionStorage.getItem('userType') === '个人' ? 1 : 2,
        uid: sessionStorage.getItem('userId'),
      }
    }, (res) => {
      let json  = res;
      window.topic = json.topiclist.length;
      if(json.answer !== null) {
        json.answer = json.answer.replace(/\w+[-]/g, '').split(';');
        for(let i = 0; i < json.topiclist.length; i++) {
          json.topiclist[i].gradeFs = parseInt(json.answer[i]);
        }
      }
      let _questionDwTpl = Tool.renderTpl(questionDwTpl, json);
      $('.dwTopicList').html('').append($(_questionDwTpl));

      if(sessionStorage.getItem('qScore') === '-1') {
        $('.sdx-queDw-fs').html('未测评').css({
          'font-size': '1rem',
        });
      } else {
        $('.sdx-queDw-fs').html(sessionStorage.getItem('qScore'));
      }
      $('.sdx-queDw-fslx').html(sessionStorage.getItem('riskTolerance'));

      if(Tool.parseURL('val') === 'cxCs') {
        $$('.framework7-root').on('click', '.onRadio', function() { let that = $$(this); self.retestQuestion(that); });
        $$('.framework7-root').on('click', '.xyb', function() { self.retestQuestionRetest(); });
      } else {
        $('.onRadio').css({
          border: '2px solid #888888',
        });
        $('.onSelect').css({
          background: '#888888'
        });
      }
    })
  }
  /*
   重新测试
   */
  retestQuestion(self) {
    self.find('.onSelect').addClass('onSelectScale1');
    self.parent('li').siblings().find('.onSelect').removeClass('onSelectScale1');
  }
  /*
   重新测试保存
   */
  retestQuestionRetest() {
    let self = this;
    let options = {
      onHide: function () {
      },
      duration: 2000
    };
    let leg = $$('.onSelectScale1').length;
    let arr = [];
    let _graDeArr = [];
    let sum = 0;
    for(let i = 0; i < leg; i++) {
      _graDeArr.push(parseInt($$('.onSelectScale1')[i].getAttribute('data-grade')));
      arr.push($$('.onSelectScale1')[i].getAttribute('data-list'));
    }
    let j = _graDeArr.length;
    while (j--) {
      sum += parseInt(_graDeArr[j]);
    }
    if(arr.length < window.topic) {
      let options = {
        onHide: function () {
        },
        duration: 2000
      };
      let toast = myApp.toast('', `<div>请把问卷填写完整！</div>`, options);
      toast.show();
      return false;
    } else {
      myApp.showIndicator();
    }
    questionStore.postTopicList({
      data: {
        action: 'Retest',
        C_grade: sum,
        C_answerList: arr.join(';'),
        C_topicType: sessionStorage.getItem('userType') === '个人' ? 1 : 2,
        cid: sessionStorage.getItem('cid'),
        id_card: sessionStorage.getItem('idCard'),
      }
    }, (res) => {
      if(res.result === 'OK') {
        myApp.hideIndicator();
        myApp.alert(`<div><p style="font-size: 14px;">您的风险评估结果为：<span>${res.assessment}</span></p><p>您的风险问卷调查得分为<span>${res.grade}</span>分。</p></div>`, '提示', function() {
          const parameter = `?tab3=${Tool.parseURL('tab3') === undefined ? '' : Tool.parseURL('tab3')}`; self.fundStockHref(parameter);
        });
        sessionStorage.setItem('betweenDays', res.betweenDays);
        sessionStorage.setItem('qTime', res.qTime.substring(0, 11).replace(/\//g, '.'));
        sessionStorage.setItem('qScore', res.grade);
        sessionStorage.setItem('riskTolerance', res.assessment);
        this.postTopicListDownload();
      } else {
        let toast = myApp.toast('', `<div>${res.error_message}</div>`, options);
        toast.show();
      }
    })
  }
};
