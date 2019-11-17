import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {PAGEST, ACTST, REQUEST, addLoginParams, convertMoney} from '../util/utils.js';
import Header from '../component/Header';

import CONFIG from '../util/CONFIG.js';
import './Coin.less';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();
const getParams = {
    deviceid: ground.getDeviceInfo().getDeviceId(),
    token:ground.getUserInfo().getToken(),
    guid:ground.getUserInfo().getGuid(),
    os:ground.getUserInfo().getOs(),
    phone:ground.getUserInfo().getPhoneNum(),
    gv:ground.getDeviceInfo().getGv(),
    av:ground.getDeviceInfo().getAv(),
    proid:ground.getDeviceInfo().getProid(),
    publishid:ground.getDeviceInfo().getPublishid(),
    screen:ground.getDeviceInfo().getScreen(),
    uid:ground.getDeviceInfo().getUid(),
    android:ground.getDeviceInfo().getOs().indexOf('android') > -1
}

// Page
export default class Page extends React.Component{
    constructor(props) {        
        super(props);

        this.state = {
            balance: 0,
            loadending:false
        }
    }
 
    componentWillMount(){

        // 滚动到顶部
        win.scrollTo(0, 0);

        // page 统计
        PAGEST({
            id: 'mypurse_fhb',
            type:'other'
        });
        //请求数据
        let _this = this;


        if(getParams.guid == undefined || getParams.guid == "undefined" || getParams.guid == '' || getParams.guid == 0){
            this.params = `?uid=${getParams.deviceid}&deviceid=${getParams.deviceid}&os=${getParams.os}&proid=${getParams.proid}&gv=${getParams.gv}`
        }else{
            this.params = `?guid=${getParams.guid}&token=${getParams.token}&deviceid=${getParams.deviceid}&os=${getParams.os}&proid=${getParams.proid}&gv=${getParams.gv}`
        }

        let url = `${CONFIG.BASEURL}/api_user_exp/timeline${this.params}`
        REQUEST({
            url: url,
            type: 'get',
            callback: 'getBalance'
        });

        window.getBalance = function(get){
            var getData = JSON.parse(decodeURIComponent(get));
            if (getData.code == 200) {
                var data = getData.data;

                _this.setState({
                    loadending:true,
                    balance: convertMoney(data.user_info.money.balance)
                });
            }else{
                _this.setState({
                    balance: 0
                });
            }

        }


    }

    render() {
        const {state:{loadending}} = this
        return (
            <div className="coin">
                <Header />
                {loadending?<div className="coin-head">
                    <div className="coin-text">
                        凤凰币：<span>{this.state.balance}</span> 个凤凰币
                    </div>
                    {getParams.android?<Link to="payment" className="coin-btn">充值</Link>:<a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_product/index')} className="coin-btn">充值</a>}
                </div>:null}
                {loadending?<ul className="coin-list">
              		<li>
                        {/* <a href={addLoginParams('https://user.iclient.ifeng.com/payment_home_exchange/index')}>红包余额兑换成凤凰币</a> */}
                    </li>
                    <li>
                        <Link to="recordrecharge">充值记录</Link>
                    </li>
                    <li>
                        <Link to="recordconsume">消费记录</Link>                        
                    </li>
                </ul>:null}
                {loadending?<div className="qa-area">
                    <Link to="/qacoin">常见问题</Link>
                </div>:null}

                
            </div>
        );
    }
}


Page.contextTypes = {
  router: PropTypes.object.isRequired
};
