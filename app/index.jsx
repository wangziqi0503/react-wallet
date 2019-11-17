import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRedirect, hashHistory } from 'react-router';

// import { HashRouter, MemoryRouter, Route, Control } from 'react-keeper'

// 引入 听云
if (__PROD__) {
   require('./util/tingyun.js');
}

import Income from './views/Income'; // 钱包首页
import Coin from './views/Coin'; // 凤凰币
import CoinIos from './views/CoinIos'; //凤凰币for ios 审核

import PayMent from './views/PayMent'; //凤凰币充值
import PayResult from './views/PayResult';//凤凰币充值结果

import Withdraw from './views/Withdraw'; // 提现
import WithdrawWx from './views/WithdrawWx'; // 微信提现

import TopupPhone from './views/TopupPhone'; //充话费
import TopupData from './views/TopupData'; //充流量

import RecordIncome from './views/RecordIncome'; //收入记录
import RecordWithdraw from './views/RecordWithdraw'; //提现记录
import RecordRecharge from './views/RecordRecharge'; //充值记录
import RecordConsume from './views/RecordConsume'; //消费记录

import DetailWithdraw from './views/DetailWithdraw'; //提现详情

import QaCoin from './views/QaCoin'; //常见问题-凤凰币
import QaIosRecharge from './views/QaIosRecharge'; //常见问题-凤凰币-ios充值流程
import QaIncome from './views/QaIncome'; //常见问题-收益

import {adaptSize} from './util/rem.js';
adaptSize(); // rem js init

// 隐藏分享按钮
try {
    window.ground.setShareVisibility(0);
} catch(e){console.log(e)}


ReactDOM.render(
	(<Router history={hashHistory}>
        <Route path="/" component={Income} />
        <Route path="/coin" component={Coin} />
        <Route path="/coinios" component={CoinIos} />

        <Route path="/payment" component={PayMent} />
        <Route path="/payresult" component={PayResult} />

        <Route path="/withdraw" component={Withdraw} />
        {/* <Route path="/withdraw_wx" component={WithdrawWx} /> */}

        <Route path="/topupphone" component={TopupPhone} />
        <Route path="/topupdata" component={TopupData} />

        <Route path="/recordincome" component={RecordIncome} />
        <Route path="/recordwithdraw" component={RecordWithdraw} />
        <Route path="/recordrecharge" component={RecordRecharge} />
        <Route path="/recordConsume" component={RecordConsume} />

        <Route path="/detailwithdraw" component={DetailWithdraw} />        

        <Route path='/qacoin' component={QaCoin} />
        <Route path='/qaiosrecharge' component={QaIosRecharge} />
        <Route path='/qaincome' component={QaIncome} />        

     </Router>
    ),
	document.querySelector("#myApp")
);

if (__DEV__) {
    if (module.hot) {
        console.log('module hot: %o', module);
        module.hot.accept();
    }
}