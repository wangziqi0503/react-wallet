import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loading from '../component/Loading';

import {PAGEST, ACTST, REQUEST, convertMoney, addLoginParams, formatTime } from '../util/utils.js';

import CONFIG from '../util/CONFIG.js';

import './DetailWithdraw.less';
import classnames from 'classnames';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();

//header定义为组件 router 取不到，没有router的情况下可用
//header
// class DetailHead extends React.Component {
//     constructor(props) {
//         super(props);

//         this.handleHelp = this.handleHelp.bind(this);
//     }
//     handleHelp() {
// 		this.context.router.push({
// 			pathname: 'qaincome'
// 		});	
// 	}
//     render() {
//         return (
//             <div className="head">
//                 <h1 className="head-tt">{this.props.pageTitle}</h1>
//                 <span className="qa-help" onClick={this.handleHelp.bind(this)}></span>
//             </div>
//         )
//     }
// }

//Page
export default class Page extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            pageLoad: true,

            orderid: this.props.location.query.orderid,

            fee: 0,
            withdraw_status: 0,
            withdraw_channel: 0,
            inner_trade_no: 0,
            account: 0,
            actual_name: 0,
            create_time: 0,
            update_time: 0,
            outer_order_id: 0
        }
        
        this.handleHelp = this.handleHelp.bind(this);
    }

    componentWillMount() {
        let _this = this;
        //滚动到顶部
        win.scrollTo(0, 0);        

        // page 统计
        // PAGEST({
        //     id: 'hisdraw',
        //     type:'ph'
        // });        

        // 请求数据
        REQUEST({
            url: `${CONFIG.BASEURL}/Payment_Api_Cashrecorddetail/index?token=${window.ground.getUserInfo().getToken()}`,
            type: 'get',
            getParams: {
                guid: getUserInfo.getGuid(),
                orderid: this.state.orderid
            },
            callback: 'getDetail'
        });    

        win.getDetail = function(get){
           
            var getData = JSON.parse(decodeURIComponent(get));
            var data = getData.data;

            _this.setState({
               pageLoad: false,

               fee: data.fee,
               withdraw_status: data.withdraw_status,
               withdraw_channel: data.withdraw_channel,
               inner_trade_no: data.inner_trade_no,
               account: data.account_info.account,
               actual_name: data.account_info.actual_name || data.account_info.cell_fee,
               create_time: data.create_time,
               update_time: data.update_time,
               outer_order_id: data.outer_order_id
            })      
        }   
      
    }

    handleHelp() {
		this.context.router.push({
			pathname: 'qaincome'
		});	
    }
    
    render() {
        if(this.state.pageLoad) {
            return (
               <Loading />
           );
        }  
        
        let checkedClass = classnames({
            suc: this.state.withdraw_status == 3
        });

        //动态内容统一处理
        let withdraw = {
            style: '', //提现方式  
            account: '',//账户名称（支付宝）/ 充值（话费/流量）账号
            name: '',//真实姓名（支付宝） / 充值面额
            unit: '',
            result: '' // 提现结果 文案
        };
        (() => {
            switch (this.state.withdraw_channel) {
                case 'WITHDRAW_ZFB': 
                    withdraw.style = '提现到支付宝';
                    withdraw.account = '账户名称';
                    withdraw.name = '真实姓名';
                    withdraw.unit = '';
                    withdraw.result = '支付宝已入账';
                    return withdraw;

                case 'CELL_MONEY_PAY': 
                    withdraw.style = '充值话费';
                    withdraw.account = '充值账户';
                    withdraw.name = '充值金额';
                    withdraw.unit = '元';
                    withdraw.result = '充值话费已入账';
                    return withdraw;

                case 'CELL_NETWORK_PAY': 
                    withdraw.style = '充值流量';
                    withdraw.account = '充值账户';
                    withdraw.name = '充值流量';

                    Number(this.state.actual_name) && this.state.actual_name >= 1024 ?
                    withdraw.unit = 'G'
                    :
                    withdraw.unit = 'M';
                    
                    withdraw.result = '充值流量已入账';
                    return withdraw;

                default: 
                    withdraw.style = '其他方式';
                    withdraw.account = '账户名称';
                    withdraw.name = '真实姓名';
                    withdraw.unit = '';
                    withdraw.result = '其他方式已入账';
                    return withdraw;
            }
        })()
        
        return (
            <div className="detail">                
                {/* <DetailHead pageTitle={'提现详情'} /> */}
                <div className="head">
                    <h1 className="head-tt">提现详情</h1>
                    <span className="qa-help" onClick={this.handleHelp}></span>
                </div>

                <div className="detail-tt-wrap">
                    <div>
                        <div className="detail-tt">{convertMoney(this.state.fee)} 元</div>
                        <div className="detail-tt-des">
                            {/* 原来页面/php实际返回 状态 
                            { (() => {
                                switch (this.props.recordItem.withdraw_status){
                                    case 1: return '进行中'; //正常流程进行中...
                                    case 3: return '成功';
                                    case 4: return '失败';
                                    default: return '进行中'; //应对异常
                                }
                                })() }
                            */}
                            {/* 与提现记录列表页状态保持一致 */}
                            { (() => {
                                switch (this.state.withdraw_status){                          
                                    case 3: return '成功';
                                    case 4: return '失败';
                                    default: return '审核中';
                                }
                            })() }
                        </div>
                    </div>
                </div>
                <div className="detail-info">
                    <div className="detail-item">
                        <p>提现方式</p>
                        <p>
                            {withdraw.account}
                        </p>
                        <p>
                            {withdraw.name}
                        </p>
                    </div>
                    <div className="detail-item-cont">
                        <p> 
                            {withdraw.style}
                        </p>
                        <p> 
                            {this.state.account}
                        </p>
                        <p> 
                            {
                                this.state.withdraw_channel === 'CELL_NETWORK_PAY' && Number(this.state.actual_name) && Number(this.state.actual_name) >= 1024 ?
                                this.state.actual_name/1024
                                :
                                this.state.actual_name
                            }
                            { withdraw.unit ? withdraw.unit : null }
                        </p>
                    </div>
                </div>

                <div className="main-wrap">
                    <div className="detail-flow">
                        <p className="flow-name">提现进度</p>
                        <ul className="flow-main">
                            <li className="suc">
                                <div className="flow-item">
                                    <span className="flow-step">提交提现申请</span>
                                    <span className="time">{formatTime(this.state.create_time)}</span>
                                </div>
                            </li>
                            <li className="suc">
                                <div className="flow-item">
                                    <span className="flow-step">财务审核</span>
                                    <span className="time">{formatTime(this.state.update_time)}</span>
                                </div>
                                <p className="tip">大致需要三个工作日</p>
                            </li>
                            <li className={checkedClass}>
                                <div className="flow-item">
                                    <span className="flow-step">
                                        {withdraw.result}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>  
                </div>
                
                <div className="detail-tip">
                    <div className="detail-item">
                        <p>创建时间</p>
                        <p>订单号</p>
                        <p>商务订单号</p>
                    </div>
                    <div className="detail-item-cont">
                        <p> 
                            {formatTime(this.state.create_time)}
                        </p>
                        <p> 
                            {this.state.inner_trade_no}
                        </p>
                        <p> 
                            {this.state.outer_order_id ? this.state.outer_order_id : ''}
                        </p>
                    </div>
                </div>
               

            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}