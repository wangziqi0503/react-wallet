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
            isUse: false, //是否可选充值包
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
            callback: 'getTopup'
        });      
        
        window.getTopup = function(get){
            var getData = JSON.parse(decodeURIComponent(get));
            if (getData.code == 200) {
                var data = getData.data;
                _this.setState({
                    tempData: data.network, //all network
                    topupData: data.network.CU,
                    page_token: data.page_token,
                    pageLoad: false
                })   
            } else {
                window.tipCallback = function() {}
                window.ground.defaultAlert('',getData.msg, '确认', '', 'tipCallback');
            }
            
        }   

    
       
    }
    changeVal(e) {
        let val = e.target.value;
        
        if (isNaN(val)) {
            this.setState({
                telTip: '只能输入数字'
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

        //服务端可能返回null
        // {
        //     "code": 200,
        //     "msg": "OK",
        //     "data": {
        //         "province": null,
        //         "catname": "",
        //         "provider": null,
        //         "number": "17700000000",
        //         "isp": "unknown",
        //         "carrier": "unknown"
        //     }
        // }

        //改状态 可选
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
                if (getData.code ==200) {
                    let data = getData.data;
                    let isp = data.carrier;
                    // let isp = data.isp.toLocaleLowerCase();
                    //避免归属地返回null
                    if (data.provider && isp) {
                        _this.setState({
                            telTip: data.provider,
                            isp: isp,
                            topupData: _this.state.tempData[isp],
                            isUse: true, //改状态为可选
                        });
                    } else {
                        window.ground.defaultAlert('',`手机号格式不正确`, '确认', '', 'tipCallback');
                        _this.refs.inputTel.focus();
                    }
                } else {
                    window.ground.defaultAlert('',data.msg, '确认', '', 'tipCallback');
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
        window.ground.defaultAlert('',`确认充值${cell_fee}流量？`, '取消', '确认', 'topupCallback');
        window.topupCallback = function(data) {
            if (data === 'left') {
                console.log('cancel')
            } else {
                let re_cell_fee;
                if (cell_fee.indexOf('G') !== -1) {
                    re_cell_fee = cell_fee.substring(0,cell_fee.length-1) * 1024;
                } else {
                    re_cell_fee = cell_fee.substring(0,cell_fee.length-1);
                }
// let a={
//     phone: _this.state.tel,
//     fee: fee,
//     cell_fee: re_cell_fee,
//     operator: _this.state.isp,
//     page_token: _this.state.page_token
    
// }                
// console.log(a)
                //topup
                REQUEST({
                    url: `${CONFIG.BASEURL}/Cellzones_Api_AddCellNetwork/do?token=${window.ground.getUserInfo().getToken()}&page_token=${_this.state.page_token}&deviceid=${window.ground.getUserInfo().getDeviceId()}&os=${window.ground.getUserInfo().getOs()}`,
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
                    window.tipCallback = function() {}
                    
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
                    
                }
              
            }
        }
    }

    switchTopup(path) {
        console.log('hashHistory==',hashHistory)
        console.log('this.context.router==',this.context.router)
        // hashHistory.replace({pathname: path})
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
                <PageHead pageTitle={'充值中心-充流量'} />

                <label className="tel-wrap">
                    <input type="tel" ref="inputTel" className="input-tel" placeholder="请输入手机号码" 
                        value={this.state.tel} 
                        onChange={this.changeVal} 
                        onBlur={this.checkNum}
                    />
                    <span className="tel-tip">{this.state.telTip}</span>
                </label>

                <h3 className="section-tt">充流量</h3>
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
                </ul>
                
                <h3 className="section-tt">充话费</h3>
                <a className="topup-taba" onClick={this.switchTopup.bind(this,'/topupphone')}>选择金额</a>
                {/* <Link activeClassName="active" className="topup-taba replace" to="/topupphone">选择金额</Link> */}
            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}