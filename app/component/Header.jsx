import React from 'react';
import {Link} from 'react-router';

import {PAGEST, ACTST, REQUEST} from '../util/utils.js';
import './Header.less';
import CONFIG from '../util/CONFIG.js';
import classnames from 'classnames';

const getProid = window.ground.getDeviceInfo().getProid();

let isIfengnews, isKtt;
isIfengnews = getProid === 'ifengnews' ? true : false;
isKtt = getProid === 'ifengnewsgold' ? true : false;
let android = window.ground.getDeviceInfo().getOs().indexOf('android') > -1;
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
        if(android){
            window.grounds.finishActivity();
        }else{
            window.grounds.close();
        }


        return false
    }

    render() {
        let coinHide = classnames({
            hide: isKtt && window.ground.getDeviceInfo().getOs().indexOf('ios') > -1
        });
        return (
            <div className="header">
                <div className="goback" onClick={this.handClickBack}></div>
                <Link activeClassName="active" to="/">收入</Link>
                <Link activeClassName="active" to="/coin" className={coinHide}>凤凰币</Link>
            </div>
        );
    }
}

//只有标题(no other entrance)页面 header
export class PageHead extends React.Component {
    constructor(props) {
        super(props);

    }

    handClickBack(){


        javascript:window.history.back();


        return false
    }

    render() {
        return (
            <div className="head" >
                {this.props.goUrl?<Link className="goback" to = {this.props.goUrl}></Link>
                :<div className="goback" onClick={this.handClickBack.bind(this)}></div>
                }
                <h1 className="head-tt">{this.props.pageTitle}</h1>
                {this.props.onoff?<div className="qa-area-head">
                    <Link to = {this.props.pageUrl}>常见问题</Link>
                </div>:null}
            </div>
        )
    }
}