import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {PAGEST, ACTST, REQUEST, addLoginParams, convertMoney,getHashQueryString} from '../util/utils.js';
import Header from '../component/Header';
import {PageHead} from '../component/Header';

import CONFIG from '../util/CONFIG.js';
import './PayResult.less';
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
    gv:ground.getDeviceInfo().getGv(),
    av:ground.getDeviceInfo().getAv(),
    proid:ground.getDeviceInfo().getProid(),
    publishid:ground.getDeviceInfo().getPublishid(),
    screen:ground.getDeviceInfo().getScreen(),
    uid:ground.getDeviceInfo().getUid()
}



//Page
export default class Page extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status:true,
            bgColor:'#fff'
        }


        if(getParams.guid == undefined || getParams.guid == "undefined" || getParams.guid == '' || getParams.guid == 0){
            this.params = `?uid=${getParams.deviceid}&deviceid=${getParams.deviceid}&os=${getParams.os}&proid=${getParams.proid}&gv=${getParams.gv}`
        }else{
            this.params = `?guid=${getParams.guid}&token=${getParams.token}&deviceid=${getParams.deviceid}&os=${getParams.os}&proid=${getParams.proid}&gv=${getParams.gv}`
        }

    }

    componentWillMount() {
        // let _this = this
        // let url = `${CONFIG.BASEURL}/payment_home_product/balance`;
        //
        // REQUEST({
        //     url: addLoginParams(url),
        //     type: 'get',
        //     callback: 'getPayNum'
        // });
        //
        // window.getPayNum = function(get) {
        //     var getData = JSON.parse(decodeURIComponent(get));
        //     if (getData.code == 200) {
        //         var data = getData.data;
        //
        //         console.log(data)
        //
        //     }
        //
        // }
        if(getHashQueryString('status') == 'success' || getHashQueryString('wabp_result') == '000'){
            return false
        }else{
            this.setState({status:false})
        }


    }




    handClickButton(){
        window.location.href = `https://share.iclient.ifeng.com/wallet#/coin`
    }



    render(){

        const {state:{bgColor,status},getQueryString,handClickButton} = this
        return(
            <div style={{bgColor}}>
                <PageHead pageTitle={status?'充值成功':'充值失败'} pageUrl={'/qacoin'} goUrl = {'https://share.iclient.ifeng.com/wallet/#/payment'} goUrl={'/payment'}/>
                {status?<section className="success">

                    <div className="successIcon">
                        <img src="https://user.iclient.ifeng.com/images/payment/success-icon.png" alt="" />
                    </div>
                    <p className="title">恭喜您，充值成功</p>
                    {/*{getParams.gv < '5.7.3' ?*/}
                    {/*<p className="detail">您当前的账户余额： <span className="money">*/}

                    {/*</span></p>:null*/}
                    {/*}*/}
                    <button value="text" onClick={handClickButton.bind(this)}>确定</button>
                </section>:
                <section className="error">

                    <div className="errorIcon">

                        <img src="https://user.iclient.ifeng.com/images/payment/error-icon.png" alt="" />
                    </div>
                    <p className="title">Sorry，充值失败</p>
                    <p className="detail">网络异常，请您检查网络及支付相关数据</p>

                   <Link to="/qacoin" className="problem" >常见问题</Link>


                </section>
                }
            </div>
        )
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
};