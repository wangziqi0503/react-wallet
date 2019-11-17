import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {PAGEST, ACTST, REQUEST, addLoginParams, convertMoney} from '../util/utils.js';
import Header from '../component/Header';
import {PageHead} from '../component/Header';

import CONFIG from '../util/CONFIG.js';
import './PayMent.less';
import {storeWithExpiration} from "../util/store";

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();
const getParams = {
    deviceid: ground.getDeviceInfo().getDeviceId(),
    token:ground.getUserInfo().getToken(),
    guid:ground.getUserInfo().getGuid(),
    os:ground.getUserInfo().getOs(),
    phone:ground.getUserInfo().getPhoneNum(),
    gv:ground.getDeviceInfo().getGv()
}



//Page
export default class Page extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            isLogin:false,
            isWxPay:true,
            isMobilePay:false,
            isInput:false,
            money:'',
            moneyArr:[],
            wxData:[],
            mobileData:[],
            moneyNum:0,
            apco:'',
            sin:'',
            loadending:false
        }

        this.params = `?guid=${getParams.guid}&token=${getParams.token}&deviceid=${getParams.deviceid}&os=${getParams.os}`

    }

    componentWillMount() {

        let _this = this
        let urlwx = `${CONFIG.BASEURL}/Payment_Home_Product/home`;
        let urlmobile = `${CONFIG.BASEURL}/Payment_Home_Product/home?pay_type=chinamobile`;
        window.grounds.pageStat(JSON.stringify({
            id: 'mypurse_fhb_topup',
            type:'other'
        }));



        if (window.ground.userIsLogin()) {
            this.setState({
                isLogin: true
            })
        }

        REQUEST({
            url: urlwx,
            type: 'get',
            callback: 'getDataWx'
        });

        REQUEST({
            url: urlmobile,
            type: 'get',
            callback: 'getDataMobile'
        });

        window.getDataWx = function(get){
            var getData = JSON.parse(decodeURIComponent(get));

            if (getData.code == 200) {
                var data = getData.data.productList;
                _this.setState({
                    wxData:data
                },() =>{
                    _this.getDataFun(_this.state.wxData)
                    }
                )

            }
        }

        window.getDataMobile = function(get){
            var getData = JSON.parse(decodeURIComponent(get));

            if (getData.code == 200) {
                var data = getData.data.productList;
                _this.setState({
                    mobileData:data
                })

            }
        }




        //微信支付后回调结果页
        window.payMentCallback = function(paymentstatus){

            //线上地址
            // window.location.href=`${CONFIG.BASEURL}/payment_home_result/index${_this.params}&status=${paymentstatus}`;
            //测试地址
            window.location.href=`https://share.iclient.ifeng.com/wallet#/payresult?status=${paymentstatus}`;

        }

    }

    //获取数据
    getDataFun(payMethod){
        this.setState({
            loadending:false
        })

        let num = 0;let apco = ''; let sin = '';

        payMethod.map((item,index) =>{
            if(payMethod[index].default){
                payMethod[index].isCur = true;
                num = payMethod[index].fee;
            }else{
                payMethod[index].isCur = false;
            }

            if(payMethod[index].apco && payMethod[index].apco != ''){

                apco = payMethod[0].apco;
                sin = payMethod[0].sin;
            }


        })

        this.setState({
            moneyArr:payMethod,
            moneyNum:num,
            apco:apco,
            sin:sin,
            loadending:true
        })

    }

    handClose(){
       this.setState({
           isLogin:true
       })

    }

    //选择支付方式
    handClickPay(payMethod){

        if(payMethod == 'wx'){
            if(this.state.isWxPay) return false;
            this.setState({
                isWxPay:true,
                isMobilePay:false
            })

            this.getDataFun(this.state.wxData)
        }else{
            if(this.state.isMobilePay) return false;
            this.setState({
                isWxPay:false,
                isMobilePay:true

            })

            this.getDataFun(this.state.mobileData)
        }

    }

    //选择充值面额
    handClickMoney(items,index){
        this.setState({
            isInput:false,
            money:''
        })

        let num = this.state.moneyArr[index].fee;

        const _index = index;

        const data = this.state.moneyArr.map((el,index)=>{
            el.isCur = false
            this.state.moneyArr[_index].isCur = true
            return el
        })



        this.setState({
            moneyArr:data,
            moneyNum:num

        })


        if(this.state.isMobilePay){

            this.setState({
                apco:this.state.moneyArr[index].apco,
                sin:this.state.moneyArr[index].sin

            })

        }

    }

    //其他金额输入
    handClickInput(){

        const data = this.state.moneyArr.map((el,index)=>{
            el.isCur = false;
            return el;
        })
        this.setState({
            moneyArr:data
        })

        if(!this.state.isInput){
            this.setState({
                isInput:true,
                moneyNum:0
            })
        }


    }


    changeVal(e) {

        let val = e.target.value;


        this.setState({
            money:parseInt(val),
            moneyNum:parseInt(val+'00')
        })


    }


    //进行支付
    payMoney(){
        var _this = this

            if(this.state.isWxPay){
                if (! ground.isWeiXinPaySupported()) {
                    alert('不支持微信支付');
                    return false;
                }

                if (! ground.userIsLogin()) {
                    alert('请登录');
                    return false;
                }

                if (this.state.moneyNum == 0) {
                    alert('请输入正确金额');
                    return false;
                }
                this.setState({
                    moneyInput:parseInt(this.state.money+'00')
                })


                // 请求数据
                REQUEST({
                    type: 'post',
                    url: `${CONFIG.BASEURL}/payment_api_wxp/prepare${this.params}`,
                    postParams:{
                        trade_type:'APP',
                        total_fee:this.state.moneyNum
                    },
                    callback: 'postWx'
                });

                window.postWx = function(get) {

                    var getData = JSON.parse(decodeURIComponent(get));

                    if (getData && getData!='') {

                        var data = getData;

                        ground.accessWeiXinPayBy(data.appid, data.partnerid, data.prepayid, data.noncestr, data.timestamp, data.package, data.sign);

                    }

                }

            }else if(this.state.isMobilePay){

                if (! ground.userIsLogin()) {
                    alert('请登录');
                    return false;
                }

                if (this.state.moneyNum == 0) {
                    alert('请输入正确金额');
                    return false;
                }

                if(!getParams.phone){
                    // window.location.href = 'https://share.iclient.ifeng.com/register_binding#/handle/mobile';

                    window.ground.userBind();
                    return false;
                }


                //请求数据
                REQUEST({
                    type: 'post',
                    url: `${CONFIG.BASEURL}/Payment_Api_Chinamobile/prepare${this.params}`,
                    postParams:{
                        trade_type:'APP',
                        total_fee:this.state.moneyNum,
                        apco:this.state.apco,
                        sin:this.state.sin,
                        phone:getParams.phone

                    },
                    callback: 'postMobile'
                });



                window.postMobile = function(get) {

                    var getData = JSON.parse(decodeURIComponent(get));

                    if (getData && getData!='') {

                        let data = getData;

                        window.location.href = data.call_url

                    }

                }

            }


    }



    render(){

        let android = window.ground.getDeviceInfo().getOs().indexOf('android') > -1;


        const {state:{isLogin,isWxPay,isMobilePay,isInput,money,moneyArr,moneyArrMobile,loadending},handClose,handClickPay,handClickInput,changeVal,handClickMoney,payMoney,payMentCallback} = this;

        return (
            <div className="payment">
                <PageHead pageTitle={'余额充值'} pageUrl={'/qacoin'} goUrl ={'/coin'}  onoff = {true}/>

                {android?<div className="androidpay recharge">


                        {/*<div className="brief">*/}
                            {/*<h3>请选择充值金额</h3>*/}
                            {/*<p>当前余额不足，还差<span>2</span>元人民币</p>*/}
                        {/*</div>*/}

                    <div className="money">
                            <ul>

                                {moneyArr.map((items,index) => {

                                    return (
                                        <li key={index} className={items.isCur?'cur':''} onClick={handClickMoney.bind(this,items,index)}>{`${items.fee/100}元`}</li>
                                    )
                                })}



                                {isWxPay && loadending?<li className={isInput?'other cur':'other'} onClick = {handClickInput.bind(this)}>{!isInput?<p>其他金额</p>:
               <input type="number" ref="moneyInput"
                       value={money}
                       onChange={changeVal.bind(this)}

                      autoFocus
               />
                                   }<span>元</span></li>:null}


                            </ul>
                        </div>
                    {loadending?<div className="pay-s">
                            <h3>选择支付方式</h3>
                            <div className='wxselect' onClick={handClickPay.bind(this,'wx')}>
                                <img src="https://p0.ifengimg.com/29b92e35b2b20708/2016/52/wxg-icon.png" alt="" />
                                <div className="wxinfo">
                                    <h4>微信支付</h4>
                                    <p>亿万用户的选择，更快更安全</p>
                                </div>
                                {/*如果高亮 添加class名称 wx-icon-cur*/}
                                <div className={isWxPay ? 'wx-icon-cur':'wx-icon'}></div>
                            </div>
                            <div className='mobileSelect' onClick={handClickPay.bind(this,'mobile')}>
                                <img src="https://p2.ifengimg.com/a/2018/0808/mobileLogo.jpg" alt="" />
                                <div className="wxinfo">
                                    <h4>中国移动话费支付</h4>
                                    <p>中国移动用户可使用手机话费进行支付</p>
                                </div>
                                {/*如果高亮 添加class名称 wx-icon-cur*/}
                                <div className={isMobilePay ? 'wx-icon-cur':'wx-icon'}></div>
                            </div>
                        </div>:null}
                        {/*如果高亮 添加class名称 paybtn-cur*/}
                    {loadending?<div className = 'paybtn paybtn-cur' onClick={payMoney.bind(this)}>
                            <button type="text">立即支付</button>
                        </div>:null}
                    </div>
                :<div className="iospay recharge">
                        <div className="brief">
                            <h3>请选择充值金额</h3>
                            <p>当前余额不足，还差<span></span>凤凰币</p>
                        </div>
                        <div className="money">
                            <ul>
                                <li>
                                    <span className="big_rmb">凤凰币</span>
                                    <span>&yen;&nbsp;</span>
                                </li>
                            </ul>
                        </div>
                        <div className="info">
                            <h3>支付须知：</h3>
                            {/*<p>1. 苹果公司规定，虚拟商品必须用苹果系统充值购买，充值*/}
                            {/*<p>金额不可自定义，且不用用于安卓、网页等其他平台；</p>*/}
                            <p>1、您正在购买凤凰新闻客户端付费内容，购买成功后有权消费该专辑的所有内容。</p>
                            <p>2、凤凰币充值成功以后，不支持退款或者转让，不可提现。
                            </p>
                            <p>3、苹果绑定支付宝账号可参考<a href="https://fm.ifeng.com/fm/read/fmd/api/client_processForNews_100.html">苹果支付教程</a>。
                            </p>
                            <p>4、凤凰币不是金币，参与活动赚取金币的方式请去百万红包活动页【金币计划】查看。              <span className="goGold" onClick={()=> window.location.href=`https://share.iclient.ifeng.com/goldOrigin${this.params}`}>点击赚取活动金币</span>
                            </p>
                        </div>
                        {!isLogin? <div className="layer">
                            <div className="layerbg" id="layerbg"></div>
                            <div className="layerinfo">
                                <div className="rocket-icon">
                                    <img src="http://p0.ifengimg.com/a/2018/0807/rocket-icon.png" alt="" />
                                </div>
                                <div className="brief">
                                    <h3>您尚未登录</h3>
                                    <p>
                                        未登录状态下充值会有以下限制： <br/>
                                        1. 充值的金额及购买记录无法转移到其他帐号，仅限本设备可用 <br/>
                                        2. App卸载后充值的金额无法找回 <br/>
                                        3. 充值后无法享受优惠券礼包 <br/>
                                    </p>
                                </div>
                                <div className="close" onClick={handClose.bind(this)}></div>
                                <div className="land">立即登录</div>
                            </div>
                        </div>:null}
                        <div className="paybtn-cur">
                            <button type="text" className="">立即支付</button>
                        </div>
                    </div>}
            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
};