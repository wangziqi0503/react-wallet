import React from 'react';
import { Link } from 'react-router';

import {PageHead} from '../component/Header';
import CONFIG from '../util/CONFIG.js';

import { PAGEST, ACTST, REQUEST, addLoginParams } from '../util/utils.js';

import './QaIosRecharge.less';

const win = window;
const ground = win.ground;

//Page
export default class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //滚动到顶部
        win.scrollTo(0, 0);

        // page 统计
        // PAGEST({
        //     id: '',
        //     type:''
        // });
       
    }

    render() {
        return (
            <div className="qacoin">
                <PageHead pageTitle={'充值流程说明'} />
             
                <dl className="step-list">
                    <dt className="step-tt" data-index="1">充值前，您需要确认以下信息</dt>
                    <dd className="step-context">
                        <p>（步骤：设置-通用-访问限制），如下图：</p>
                        <img src={`${CONFIG.IMGURL}qa/pro_01.png`} alt=""/>
                    </dd>

                    <dt className="step-tt" data-index="2">打开苹果App Store</dt>
                    <dd className="step-context">
                         <img className="iosapp-img" src={`${CONFIG.IMGURL}qa/pro_02.png`} />
                    </dd>

                    <dt className="step-tt" data-index="3">
                        点击精品推荐页面底部的“绑定银联卡支付”
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_01.jpg`} />
                    </dd>

                    <dt className="step-tt" data-index="4">
                    选择您常用的支付帐户，建议使用支付宝（需要iOS 更新至10.1.1版本）
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_02.jpg`} />
                    </dd>        

                    <dt className="step-tt" data-index="5">
                    绑定完成后，返回精品推荐页，选择“充值”
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_03.jpg`} />
                    </dd>    

                    <dt className="step-tt" data-index="6">
                    选择要充值的金额和付款方式进行充值
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_04.jpg`} />
                    </dd>   

                    <dt className="step-tt" data-index="7">确认Apple Store充值已到账</dt> 

                    <dt className="step-tt" data-index="8">
                    返回“凤凰新闻”APP，在“我的”页面点击“我的账户”
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_05.jpg`} />
                    </dd>     

                    <dt className="step-tt" data-index="9">
                    点击“充值”，进入充值页面
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_06.jpg`} />
                    </dd> 

                    <dt className="step-tt" data-index="10">
                    选择要充值的金额，点击立即支付
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/p_08.jpg`} />
                    </dd>    

                    <dt className="step-tt" data-index="11">
                    按照系统提示，输入AppleID等信息
                    </dt>
                    <dd className="step-context">
                        <img src={`${CONFIG.IMGURL}qa/pro_04.png`} />
                    </dd>      

                    <dt className="step-tt" data-index="12">充值完成后就可以去购买感兴趣的内容啦！</dt>
                </dl>
            </div>
        );
    }

}

// Page.contextTypes = {
//     router: React.PropTypes.object.isRequired
// }