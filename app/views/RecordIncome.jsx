import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import {PageHead} from '../component/Header';
import {NoRecord} from '../component/Record';
import Loading from '../component/Loading';

import {PAGEST, ACTST, REQUEST, convertMoney, addLoginParams, formatTime, scrollMore } from '../util/utils.js';
import Headerhis from '../component/Headerhis';

import CONFIG from '../util/CONFIG.js';

import './RecordIncome.less';
import classnames from 'classnames';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();

//record item
class RecordItem extends React.Component {
    constructor(props) {
        super(props);  
    }
  
    render() {  
        return (        
            <li>
                <div className="record-item">
                    <div className="record-dec-wrap">
                        <h3 className="record-tt">{this.props.recordItem.desc}</h3>
                        <p className="subscript">{formatTime(this.props.recordItem.ctime)}</p>
                    </div>
                    <div className="record-num-wrap">
                        <p className="state">{convertMoney(this.props.recordItem.fee,2)} 元</p>
                        <p className="subscript">{convertMoney(this.props.recordItem.current_total_income,2)}</p>
                    </div>
                </div>
            </li>                  
        )
    }
}

class RecordList extends React.Component {
    constructor(props) {
        super(props);       
    }

    render() { 
        return (
            <ul className="record-list">
                {this.props.data.map((el, index)=> {                    
                    return (<RecordItem key = {index} recordItem = {el} />)
                })}
            </ul>
        )       
    }
}


//Page
export default class Page extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageLoad: true,//page 载入 加载中...

            recordData: [], //收入记录数据
            noData: [],
            page: 1, //当前页数
            size: 16, //每页条数
            isloadAll: false, //是否加载完毕
            isPost: false  //是否发送数据中
        }

        this.handleScroll = this.handleScroll.bind(this);        
    }

    componentWillMount() {
        let _this = this;
        //滚动到顶部
        win.scrollTo(0, 0);        

        // page 统计
        PAGEST({
            id: 'allearn',
            type:'ph'
        });        

        // 请求数据
        REQUEST({
            url: `${CONFIG.BASEURL}/Payment_Api_Myincomerecord/index?token=${window.ground.getUserInfo().getToken()}`,
            type: 'enpost',
            postParams: {
                deviceid: window.ground.getDeviceInfo().getDeviceId(),
                guid: getUserInfo.getGuid(),
                page: this.state.page,
                size: this.state.size
            },
            callback: 'getRecordFirst'
        });      
        
        win.getRecordFirst = function(get){
           
            var getData = JSON.parse(decodeURIComponent(get));
            var data = getData.data;

            _this.setState({
               recordData: data,
               pageLoad: false
            })    

            //没有更多页, 不再触发滚动加载
            if(data.length < _this.state.size) {
                _this.setState({
                    isloadAll: true,
                    isPost: true
                })  
                
            }
        }   

        //noData
        const NoData=<h3 className="no-tt no-income">
            <span className="font-fc">暂无收益</span>
            丰富个人主页，有机会获得打赏和红包哦~
        </h3>;
        this.setState({
            noData: NoData
        });
    
       
    }
 
    handleScroll() {      
        let _this = this;
        
        //滚动加载更多
        scrollMore.apply(_this,[getMoreRecordData,_this.state.isPost]);
      
        function getMoreRecordData() {
            _this.setState({           
                isPost: true             
            })
            // 发送数据
            // (page+1) 没有小括号加密数据发不出去
            REQUEST({
                url: `${CONFIG.BASEURL}/Payment_Api_Myincomerecord/index?token=${window.ground.getUserInfo().getToken()}&guid=${window.ground.getUserInfo().getGuid()}`,
                type: 'enpost',
                postParams: {
                    deviceid: window.ground.getDeviceInfo().getDeviceId(),
                    page: (_this.state.page+1),
                    size: _this.state.size
                },
                callback: 'getMoreRecord'
            })

            win.getMoreRecord = function(post) {
                var postData = JSON.parse(decodeURIComponent(post));
                var data = postData.data;  
                     
                if(!data.length) {
                    //没有更多页   
                    _this.setState({
                        isloadAll: true,
                        isPost: true
                    })      
                } else if(data.length < _this.state.size) {
                    //不足一页不再请求
                    var data = _this.state.recordData.concat(data);
                    _this.setState({
                        page: _this.state.page+1,
                        size: _this.state.size,
                        recordData: data,
                        isloadAll: true,
                        isPost: true
                    })   
                } else {
                    var data = _this.state.recordData.concat(data);
                    _this.setState({
                        page: _this.state.page+1,
                        size: _this.state.size,
                        recordData: data,
                        isPost: false
                    })   
                }
                                       
            }
        }

    }

    
    render() { 
        if(this.state.pageLoad) {
             return (
                <Loading />
            );
        }        
        return (
            <div className="record" onTouchMove={this.handleScroll}>                
                {/* <PageHead pageTitle={'收入记录'} /> */}

                <Headerhis />

                {this.state.recordData.length ?
                <div className="record-cont">
                    <RecordList data={this.state.recordData} />
                    <div className={this.state.isPost ? 'more-txt' : 'none'}>
                        {this.state.isloadAll ? '没有更多了！' : '加载中...'}
                    </div> 
                </div>
                :
                <NoRecord noData={this.state.noData} />
                } 

            </div>
        );
    }

}

Page.contextTypes = {
    router: PropTypes.object.isRequired
}