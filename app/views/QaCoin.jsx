import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {PageHead} from '../component/Header';
import CONFIG from '../util/CONFIG.js';

import { PAGEST, ACTST, REQUEST, addLoginParams } from '../util/utils.js';

import './QaCoin.less';
import classnames from 'classnames';

const win = window;
const ground = win.ground;

class QaItem extends React.Component {
    constructor(props) {
        super(props);    

        this.state = {
            active: true
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState({
            active: !this.state.active
        })
    }

    render() { 
        let onlyIos = this.props.qaItem.hasOwnProperty('onlyIos') ? true : false;
        let android = window.ground.getDeviceInfo().getOs().indexOf('android') > -1;
        let androidHideClass = classnames({
            none: android && onlyIos
        });   

        let qaContClass = classnames({
            'qa-answer': true,
            none: !this.state.active
        });

        return (
            <dl className = {androidHideClass} >
                <dt className = "qa-question" onClick = {this.handleClick} > 
                    {this.props.qaItem.qaQuestion} 
                </dt>
                <dd className = {qaContClass} >
                    {this.props.qaItem.qaAnswer} 
                </dd>
            </dl>
        )
    }
}

// class QaList extends React.Component {
//     constructor(props) {
//         super(props);       
//     }
    
//     render() { 
//         return (
//             <div className="qa-list">
//                 {this.props.data.map((el, index)=> {                    
//                     return (<QaItem key = {index} qaItem = {el} />)
//                 })}
//             </div>
//         )       
//     }
// }

//Page
export default class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            qaList : []
        }
        // this.handleFeedback=this.handleFeedback.bind(this);
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
        const QACOIN = [
            {               
                qaQuestion: "什么是账户余额？",
                qaAnswer: "账户余额是凤凰新闻平台的虚拟货币，用户可用于支付凤凰新闻内的各种商品，账户余额只能消费，不能提现或转让。"
                
            },
            {                
                qaQuestion: "充值到账户的余额会不会过期？",
                qaAnswer: "在凤凰新闻平台充值的虚拟币不会过期，会一直存在账号中，您可以随时使用。"
            },
            {               
                onlyIos: true,//只有ios显示
                qaQuestion: "为什么我无法充值？",
                qaAnswer:
                    <div>
                        <p>1、请确保您的手机网络正常</p>
                        <p>2、请确保您充值使用的Apple  ID 和下载凤凰新闻的Apple ID  是同一个</p>
                        <p>3、检查APP购买的访问限制是否打开：</p>
                        <p>（步骤：设置-通用-限制），如下图</p>
                        <img src={`${CONFIG.IMGURL}qa/pro_01.png`} />
                        <p>4、IOS 平台用户可参考                           
                            <Link to="qaiosrecharge">充值流程说明</Link>
                        </p>
                    </div>
            },
            {               
                qaQuestion: "为什么提示扣款成功，我的账户里却没有资金？",
                qaAnswer: 
                    <div>
                        <p>1、请检查您当前的账户和充值的账户是否一致，您可对照查看用户名或播放历史等信息；</p>
                        <p>2、尝试退出APP，在打开进入凤凰新闻个人中心；</p>
                        <p>（步骤：我的-我的账户-充值）</p>
                        <p>3、如果一小时仍没有到账，可以点击 <a onClick={this.handleFeedback}>直接反馈</a> 和客服沟通，我们会第一时间为您解决问题。</p>
                    </div>
            }
        ]
         
        this.setState({
            qaList: QACOIN
        })        
       
    }

       
    handleFeedback = () => {
        window.ground.goTo(JSON.stringify({
			type: 'subject_detail',
			url: 'https://api.iclient.ifeng.com/feedback'
		})); 
    }
    // handleFeedback() {
       
    //     window.ground.goTo(JSON.stringify({
	// 		type: 'subject_detail',
	// 		url: 'https://api.iclient.ifeng.com/feedback'
	// 	}));         
    // }  
    render() { 
        return (
            <div className="qacoin">
                <PageHead pageTitle={'常见问题'} />
                {/* <div className="head">
                    <h1 className="head-tt">常见问题</h1>
                </div> */}
                {/* <QaList data={this.state.qaList} /> */}
                <div className="qa-list">
                    {this.state.qaList.map((el, index)=> {                    
                        return (<QaItem key = {index} qaItem = {el}/>)
                    })}
                </div>
            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}