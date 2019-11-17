import React from 'react';
import PropTypes from 'prop-types';
import { Link/*, hashHistory*/ } from 'react-router';

import {PageHead} from '../component/Header';
import {NoRecord} from '../component/Record';
import Loading from '../component/Loading';

import {PAGEST, ACTST, REQUEST, convertMoney, addLoginParams, formatTime } from '../util/utils.js';

import CONFIG from '../util/CONFIG.js';

import './TopupPhone.less';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();

//Page
export default class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageLoad: false,//page 载入 加载中...

            tel: '',
            telTip: '',
            isUse: false, //是否 可选 充值包
            isp: '', //for service服务端
            topupData: {}, //充值包数据
            tempData: {}, //all data
            active: '', //is choiced

            page_token: '' //for service secure
        }

        this.changeVal = this.changeVal.bind(this);
        this.checkNum = this.checkNum.bind(this);
    }

    componentWillMount() {
        let _this = this;
        //滚动到顶部
        win.scrollTo(0, 0);        

        // page 统计
        // PAGEST({
        //     id: '',
        //     type:'ph'
        // });        

        // 请求数据
        REQUEST({
            url: `${CONFIG.BASEURL}/Cellzones_Api_Getzone/getFeeConfig?token=${window.ground.getUserInfo().getToken()}`,
            type: 'post',
            postParams: {
                deviceid: window.ground.getDeviceInfo().getDeviceId(),
                guid: getUserInfo.getGuid(),
            },
            callback: 'getTopupPhone'
        });      
        
        window.getTopupPhone = function(get){
            var getData = JSON.parse(decodeURIComponent(get));
            if (getData.code == 200) {
                var data = getData.data;
                _this.setState({
                    tempData: data.phonefee, //all phonefee
                    topupData: data.phonefee.CU,
                    page_token: data.page_token,
                    pageLoad: false
                })   
            }
        }   
       
    }
    changeVal(e) {
        let val = e.target.value;
        console.log(val,val.length)
        
        if (isNaN(val)) {
            this.setState({
                telTip: '只能输入数字',
            });
    
        } else {
            this.setState({
                tel: val,
                telTip: '',
                isUse: false,
                active:''
            }, () => {
                if (this.state.tel.length === 11) {
                    this.refs.inputTel.blur();
                }
            });
   
        }
      
    }

    checkNum() {
        let _this = this;
        let reg = /^((\+)?86|((\+)?86)?)0?1[34578]\d{9}$/;

        window.tipCallback = function() {}
        
        // this.setState({
        //     isUse: true,
        // });
        if (reg.test(this.state.tel)) {
            REQUEST({
                url: `${CONFIG.BASEURL}/Cellzones_Api_Getzone?token=${window.ground.getUserInfo().getToken()}`,
                type: 'get',
                getParams: {
                    number: this.state.tel
                },
                callback: 'getLocation'
            });  
            window.getLocation = function(get) {
                let getData = JSON.parse(decodeURIComponent(get));
                if (getData.code == 200) {
                    let data = getData.data;
                    let isp = data.carrier;
                    // let isp = data.isp.toLocaleLowerCase();
                    //避免归属地返回null
                    if (data.provider && isp) {
                        _this.setState({
                            telTip: data.provider,
                            isUse: true,
                            isp: isp,
                            topupData: _this.state.tempData[isp],
                            isUse: true, //改状态为可选
                        });
                    } else {
                        window.ground.defaultAlert('',`手机号格式不正确`, '确认', '', 'tipCallback');
                        _this.refs.inputTel.focus();
                    }
                } else {
                    window.ground.defaultAlert('',getData.msg, '确认', '', 'tipCallback');
                }
            }
        } else {
            window.ground.defaultAlert('',`手机号格式不正确`, '确认', '', 'tipCallback');
        }       
    }
    
    handleClick(index, cell_fee, fee) {
        let _this = this;
        if (!this.state.isUse) {
            return;
        }
        this.setState({
            active: index
        });
        window.ground.defaultAlert('',`确认充值${cell_fee}话费？`, '取消', '确认', 'topupCallback');
        window.topupCallback = function(data) {
            if (data === 'left') {
console.log('cancel')
            } else {
                let re_cell_fee = cell_fee.substring(0,cell_fee.length-1);
// let a={
//     phone: _this.state.tel,
//     fee: fee,
//     cell_fee: re_cell_fee,
//     operator: _this.state.isp
// }                
// console.log(a);
                //topup
                REQUEST({
                    url: `${CONFIG.BASEURL}/Cellzones_Api_Addcellfee/do?token=${window.ground.getUserInfo().getToken()}&page_token=${_this.state.page_token}&deviceid=${window.ground.getUserInfo().getDeviceId()}&os=${window.ground.getUserInfo().getOs()}`,
                    type: 'enpost',
                    postParams: {
                        guid: window.ground.getUserInfo().getGuid(),
                        phone: _this.state.tel,
                        fee: fee,
                        cell_fee: re_cell_fee,
                        carrier: _this.state.isp,
                        // page_token: _this.state.page_token
                    },
                    callback: 'sendData'
                });  
                window.sendData = function(get) {
                    let getData = JSON.parse(decodeURIComponent(get));
                    if (getData.code == 200) {
                        window.ground.defaultAlert('','约三个工作日审核后到账', '确认', '', 'tipCallback');
                        _this.context.router.push({
                            pathname: '/'
                        });
                    } else if (getData.code == 4104) {
                        window.ground.defaultAlert('','当前余额不足', '确认', '', 'tipCallback');
                    } else {
                        window.ground.defaultAlert('',getData.msg, '确认', '', 'tipCallback');
                    }
                    window.tipCallback = function() {}
                    
                }
              
            }
        }
    }

    switchTopup(path) {
        // hashHistory.replace({pathname: path});
        this.context.router.replace(path);
    }

    render() { 
        if(this.state.pageLoad) {
             return (
                <Loading />
            );
        } 
        return (
            <div className="topup">                
                <PageHead pageTitle={'充值中心-充话费'} />

                <label className="tel-wrap">
                    <input type="tel" ref="inputTel" className="input-tel" placeholder="请输入手机号码" 
                        value={this.state.tel} 
                        onChange={this.changeVal} 
                        onBlur={this.checkNum}
                    />
                    <span className="tel-tip">{this.state.telTip}</span>
                </label>

                <h3 className="section-tt">充话费</h3>
                <ul className="topup-list clearfix">
                    {
                        Object.keys(this.state.topupData).map( (key,index) => {
                            return (        
                                <li className={'topup-item ' + (index === this.state.active ? 'active' : '') + (this.state.isUse ? ' is-use' : '')}  
                                    onClick={this.handleClick.bind(this,index,key,this.state.topupData[key]['count_fee'])}
                                    key={key}
                                >
                                    <div>
                                        {key}
                                        <h3 className="topup-info">售价：{convertMoney(this.state.topupData[key]['count_fee'])}元</h3>
                                    </div>
                                </li>              
                            )
                        })
                    }
                
                    {/*
                   <li className="topup-item">
                        <h3 className="topop-tt">10元</h3>
                        <h4 className="topup-info">售价：10.00元</h4>
                    </li> */}
                </ul>
                
                <h3 className="section-tt">充流量</h3>
                <a className="topup-taba" onClick={this.switchTopup.bind(this,'/topupdata')}>选流量包</a>
                {/* <Link activeClassName="active" className="topup-taba" to="/topupdata">选流量包</Link> */}
            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}