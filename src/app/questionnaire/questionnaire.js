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

export default class Questionnaire extends widget {
  init() {
    $('.view').attr('data-page', 'questionnaire');
    let pageLeg = $('.questionnaire-page').length;
    if(pageLeg === 0) {
      window.location.reload();
    }
    let _questionnaireTpl = Tool.renderTpl(questionnaireTpl);
    $('.questionnaire-page').append($(_questionnaireTpl));

    this.postTopicListDownload();
    $('.framework7-root').on('click', '.questionHrefFund', () => { mainView.router.loadPage('page/fund.html'); });
  }
  /*
   获取风险调查问卷列表
   */
  postTopicListDownload() {
    questionStore.postTopicList({
      data: {
        action: 'TopicList',
        cid: sessionStorage.getItem('cid'),
        topicType: sessionStorage.getItem('userType') === '个人' ? 1 : 2,
        uid: sessionStorage.getItem('userId'),
      }
    }, (res) => {
      let json  = res;
      json.answer = json.answer.replace(/\w+[-]/g, '').split(';');
      for(let i = 0; i < json.topiclist.length; i++) {
        json.topiclist[i].gradeFs = parseInt(json.answer[i]);
      }
      let _questionDwTpl = Tool.renderTpl(questionDwTpl, json);
      $('.dwTopicList').append($(_questionDwTpl));
    })
  }
};
