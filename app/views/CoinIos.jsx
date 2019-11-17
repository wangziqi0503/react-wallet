import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {PAGEST, ACTST, REQUEST, addLoginParams, convertMoney} from '../util/utils.js';
// import Header from '../component/Header';

import CONFIG from '../util/CONFIG.js';
import './Coin.less';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();

// Page
export default class Page extends React.Component{
    constructor(props) {        
        super(props);

        this.state = {
            balance: 0           
        }
    }
 
    componentWillMount(){


        let _this = this;
        // 滚动到顶部
        win.scrollTo(0, 0);

        // page 统计
        PAGEST({
            id: 'mypurse_fhb',
            type:'other'
        });

        // 请求数据
        REQUEST({
            url: `${CONFIG.BASEURL}/Payment_Api_Account/index?token=${window.ground.getUserInfo().getToken()}`,
            type: 'get',
            getParams: {
                guid: getUserInfo.getGuid()
            },
            callback: 'getCoinios'
        });

        win.getCoinios = function(get) {
            let getData = JSON.parse(decodeURIComponent(get));
            let data = getData.data;

            _this.setState({
                balance: convertMoney(data.balance)
            });
        }          
        
    }

    render() {
        return (
            <div className="coin">
                {/*
                <Header />
                */}
                <div className="header">    
                    <Link activeClassName="active" to="/coinios">凤凰币</Link> 
                </div>           
                <div className="coin-head">
                    <div className="coin-text">
                        凤凰币：<span>{this.state.balance}</span> 个凤凰币
                    </div>
                    <a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_product/index')} className="coin-btn">充值</a>
                </div>
                <ul className="coin-list">
                    {/*
              		<li>
                        <a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_exchange/index')}>红包余额兑换成凤凰币</a>
                    </li>
                     */}  
                    <li>
                        <a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_record/index')}>充值记录</a>
                    </li>
                    <li>
                        <a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_consume/index')}>消费记录</a>
                    </li>
                </ul>
                <div className="qa-area">
                	<a href="https://fm.ifeng.com/fm/read/fmd/api/client_problemForNews_100.html">常见问题</a>
                </div>

            </div>
        );
    }
}


Page.contextTypes = {
  router: PropTypes.object.isRequired
};
