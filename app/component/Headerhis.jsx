import React from 'react';
import {Link} from 'react-router';

import {PAGEST, ACTST, REQUEST} from '../util/utils.js';
import './Header.less';
import CONFIG from '../util/CONFIG.js';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();
const getProid = window.ground.getDeviceInfo().getProid();
let isIfengnews, isKtt;
isIfengnews = getProid == 'ifengnews' ? true : false;
isKtt = getProid == 'ifengnewsgold' ? true : false;

// Page
export default class Page extends React.Component{
    constructor(props) {        
        super(props);
        this.handClickBack = this.handClickBack.bind(this)
    }
 
    componentWillMount(){
         // 滚动到顶部
        window.scrollTo(0, 0);
    }

    handClickBack(){
        javascript:window.history.back();

        return false
    }

    render() {
        return (
            <div className="header his">
                <div className="goback" onClick={this.handClickBack}></div>
                <Link activeClassName="active" to="/recordincome">{isKtt ? '收支记录' : '收入记录'}</Link>
                <Link activeClassName="active" to="/recordwithdraw">提现记录</Link>
            </div>
        );
    }
}

//只有标题页面 header
export class PageHead extends React.Component {
    constructor(props) {
        super(props);
        this.handClickBack = this.handClickBack.bind(this)
    }

    handClickBack(){
        javascript:window.history.back();

        return false
    }


    render() {
        return (
            <div className="head">
                <div className="goback" onClick={this.handClickBack}></div>
                <h1 className="head-tt">{this.props.pageTitle}</h1>
            </div>
        )
    }
}