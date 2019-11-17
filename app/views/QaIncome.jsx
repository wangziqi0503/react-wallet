import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {PageHead} from '../component/Header';

import { PAGEST, ACTST, REQUEST, addLoginParams } from '../util/utils.js';

import './QaCoin.less';
// import classnames from 'classnames';

const win = window;
const ground = win.ground;

class QaItem extends React.Component {
    constructor(props) {
        super(props);    
    
    }
  
    render() {     
        return (
            <dl>
                <dt className = "qa-question"> 
                    {this.props.qaItem.qaQuestion} 
                </dt>
                <dd className = "qa-answer" >
                    {this.props.qaItem.qaAnswer} 
                </dd>
            </dl>
        )
    }
}

class QaList extends React.Component {
    constructor(props) {
        super(props);       
    }
    
    render() { 
        return (
            <div className="qa-list">
                {this.props.data.map((el, index)=> {                    
                    return (<QaItem key = {index} qaItem = {el} />)
                })}
            </div>
        )       
    }
}

//Page
export default class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qaList : []
        }
        this.handleFeedback=this.handleFeedback.bind(this);
    }

    componentWillMount() {
        let _this = this;
        //滚动到顶部
        win.scrollTo(0, 0);        

        // page 统计
        // PAGEST({
        //     id: '',
        //     type:''
        // });

       
        // 凤凰币常见问题列表
        const QACOIN= [
            {               
                qaQuestion: "我的收益是什么？",
                qaAnswer: "我的收益指的是个人用户在凤凰新闻客户端上，丰富个人主页动态后，接收到的来自他人的打赏；或他人为了与您进行私信交流时，需要给予的费用。"
                
            },
            {                
                qaQuestion: "提现问题？",
                qaAnswer: 
                    <div>
                        <p>1、提现到哪儿？</p>
                        <p>目前客户端仅支持提现到支付宝账号。</p>
                        <p>2、提现到账时间</p>
                        <p>正常工作日申请后3个工作日内，相关人员审核通过后即可到账，节假日会延迟。</p>                        
                        <p>3、提现门槛</p>
                        <p>余额最少15元，且首次提现不得超过15元。以后每周只能提现一次，每次最高100元。</p>
                    </div>
            },       
            {               
                qaQuestion: "其他问题？",
                qaAnswer: 
                    <div>                        
                        <p>如有其他问题，可以点击 <a onClick={_this.handleFeedback}>直接反馈</a> 和客服沟通，我们会第一时间为您解决问题。</p>
                    </div>
            }
        ]
         
        this.setState({
            qaList: QACOIN
        })        
       
    }
    // 跳转 反馈页面
    handleFeedback() {        
        window.ground.goTo(JSON.stringify({
			type: 'subject_detail',
			url: 'https://api.iclient.ifeng.com/feedback'
		}));        
    }  
    render() { 
        return (
            <div className="qa-ios-recharge">
                <PageHead pageTitle={'常见问题 - 收益'} />
                {/* <div className="head">
                    <h1 className="head-tt">常见问题 - 收益</h1>
                </div>    */}
                <QaList data={this.state.qaList} />
            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}