import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
//import ChartJS from 'chart.js';
import CountUp from 'react-countup';

import {PAGEST, ACTST, REQUEST, convertMoney, addLoginParams, getStringLength} from '../util/utils.js';
import {rem2px} from '../util/rem.js';
import Header from '../component/Header';
import Loading from '../component/Loading';
// import AnimNum from '../component/AnimNum';//animation num

import UMAnalytics from '../util/UMAnalytics.js'; //友盟

import {clickShare} from '../util/share.js';

import CONFIG from '../util/CONFIG.js';

import './Income.less';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();
const getProid = window.ground.getDeviceInfo().getProid();
let isIfengnews, isKtt;
isIfengnews = getProid == 'ifengnews' ? true : false;
isKtt = getProid == 'ifengnewsgold' ? true : false;

const bannerDaily = `${CONFIG.IMGURL}banner-daily.png`;
const bannerPlan = `${CONFIG.IMGURL}banner-ifengplan.png`;


/**
 * 表格
 * @class Chart
 * @extends {React.Component}
 */

class Chartjs {
    constructor(id, config) {
        this.id = id;
        this.config = config;
        this.init();
    }

    init() {
        this.initWidget();
        this.initRect();

        //this.drawAxis();
    }

    /**
     *
     * @memberof Chartjs
     */
    initWidget() {
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        let pixelTatio = window.devicePixelRatio;

        // 解决 锯齿问题
        if (pixelTatio) {
            this.canvas.style.width = this.width + 'px';
            this.canvas.style.height = this.height + 'px';
            this.canvas.width = this.width * pixelTatio;
            this.canvas.height = this.height * pixelTatio;
            this.ctx.scale(pixelTatio, pixelTatio);
        }
    }

    /**
     * init rect
     * @memberof Chartjs
     */
    initRect() {
        this.padding = 10; // 初始化内边距
        this.paddingLeft = 20; // 打印绘制文字高度
        this.paddingBottom = 20; // 底部绘制高度

        // 原点
        this.origin = {
            x: this.paddingLeft + 0.5,
            y: this.height - this.paddingBottom + 0.5
        }

        // Y 轴起点坐标
        this.axisY = {
            x: this.paddingLeft + 0.5,
            y: this.padding + 0.5
        }

        // X 轴起点坐标
        this.axisX = {
            x: this.width - this.padding + 0.5,
            y: this.height - this.paddingBottom + 0.5
        }

        console.log('axisY: %o', this.axisY);
        console.log('axisX: %o', this.axisX);
        console.log('origin: %o', this.origin);

        this.YArray = [];
        this.XArray = [];
        this.YLength = 6; // Y 周 5份
        // Y 轴坐标系
        for (let i = 1; i < this.YLength; i++) {
            let len = (this.origin.y - this.axisY.y)/this.YLength;

            this.YArray.push({
                x: this.axisY.x,
                y: this.origin.y - len * i
            });
        }

        // X 轴 坐标系
        this.Xlength = 4;
        for (let i = 1; i < this.Xlength; i++) {
            let len = (this.origin.y - this.axisY.y)/this.Xlength;

            this.XArray.push({
                //x: this.axisY.x,
                //y: this.origin.y - len * i
                x: this.origin.x - len * i,
                y: this.axisY.y
            });
        }
    }

    // 绘制坐标轴
    drawAxis() {
        this.drawAxisY();
        this.drawAxisX();
    }

    // Y 轴
    drawAxisY() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.axisY.x, this.axisY.y);
        this.ctx.lineTo(this.origin.x, this.origin.y);
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();

        this.darwAxisYMark(); // 渲染 Y 刻度
    }

    // X 轴
    drawAxisX() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, this.origin.y);
        this.ctx.lineTo(this.axisX.x, this.axisX.y);
        this.ctx.strokeStyle = '#cccccc';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        this.ctx.closePath();
    }

    // Y 轴 刻度
    darwAxisYMark() {
        let _this = this;
        this.YArray.map((item, index)=> {
            // 画横线
            this.ctx.beginPath();
            this.ctx.moveTo(item.x, item.y);
            this.ctx.lineTo(this.axisX.x, item.y);
            this.ctx.strokeStyle = '#ddd';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.closePath();

            // 画 小刻度
            this.ctx.beginPath();
            this.ctx.moveTo(item.x, item.y);
            this.ctx.lineTo(item.x - 3, item.y);
            this.ctx.strokeStyle = '#333333';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.closePath();

            // 加文字
            this.ctx.font = '10px arial';
            this.ctx.fillStyle = '#ccc';
            this.ctx.fillText('50', item.x - 20, item.y + 4);
        });
    }
}


class Chart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canvasWidth: document.documentElement.clientWidth - rem2px(.4),
            canvasHeight: rem2px(4.15)
        }
    }

    componentDidMount() {
        new Chartjs('chart', {
            x: ['10月12', '13', '14', '15', '16'],
            y: [50, 60, 70, 80, 90]
        });
    }

    render() {
        return (
            <div className="chart">
                <p>近四周收入</p>
                <canvas id="chart" width={this.state.canvasWidth} height={this.state.canvasHeight}>Your browser does not support the HTML5 canvas tag</canvas>
            </div>
        );
    }
}


// class Chart extends React.Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             canvasWidth: document.documentElement.clientWidth - rem2px(.4),
//             canvasHeight: rem2px(4.15)
//         }
//     }

//     componentDidMount() {
//         var ctx = document.getElementById('chart');
//         var myChart = new ChartJS(ctx, {
//             type: 'line',
//             data: {
//                 labels: this.props.x,
//                 datasets: [
//                     {
//                         label: '收益',
//                         data: this.props.y,
//                         lineTension: 0, // 折线直角
//                         fill: false,
//                         borderWidth: 2,
//                         pointRadius: 4,
//                         borderColor: 'rgb(254, 92, 93)',
//                         pointHoverRadius: 6,
//                         pointBackgroundColor: 'rgb(254, 92, 93)',
//                         pointBorderColor: 'rgb(254, 92, 93)',
//                         borderJoinStyle: 'round'
//                     },
//                     {
//                         label: '',
//                         data: [15, 15, 15, 15, 15],
//                         lineTension: 0, // 折线直角
//                         fill: false,
//                         borderWidth: 2,
//                         pointRadius: 0,
//                         borderColor: 'rgb(254, 92, 93)',
//                         pointHoverRadius: 6,
//                         pointBackgroundColor: 'rgb(254, 92, 93)',
//                         pointBorderColor: 'rgb(254, 92, 93)',
//                         borderJoinStyle: 'round',
//                         borderDash: [2, 2]
//                     }
//                 ]
//             },
//             options: {
//                 scales: {
//                     yAxes: [
//                         {
//                             ticks: {
//                                 min: 0
//                                 // forces step size to be 5 units
//                                 // stepSize: 15
//                             }
//                         },

//                     ]
//                 },
//                 legend: {
//                     display: false
//                 },                
//                 event: ['click']
//             }
//         });
//     }

//     render() {
//         return (
//             <div className="chart">
//                 <p>近四周收入</p>

//                 <canvas id="chart" width={this.state.canvasWidth} height={this.state.canvasHeight}>Your browser does not support the HTML5 canvas tag</canvas>
//             </div>
//         );
//     }
// }



/**
 * 画圆
 * @class PanitRound
 * @extends {React.Component}
 */
class PanitRound extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            width: rem2px(4.15),
            height: rem2px(4.15)
        }
    }

    componentDidMount() {
        /**
         画圆
         */
        class Paint {
            constructor(percent) {
                let sideLength = rem2px(4.15);
                this.lineWidth = rem2px(0.2);
                this.radius = sideLength/2 - this.lineWidth/1.8;
                this.circleX = sideLength/2;
                this.circleY = sideLength/2;

                this.canvas = document.getElementById('cavnas');
                this.ctx = this.canvas.getContext('2d');
                this.rad = Math.PI*2/100; // 100份
                this.percent = percent; // 百分比
                this.speed = 0; // 速度
                this.pixelTatio = window.devicePixelRatio || 1;

                // 解决 锯齿问题
                if (window.devicePixelRatio) {
                    this.canvas.style.width = sideLength + 'px';
                    this.canvas.style.height = sideLength + 'px';
                    this.canvas.width = sideLength * this.pixelTatio;
                    this.canvas.height = sideLength * this.pixelTatio;
                    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                }

                this.timer = setInterval(()=> {
                    this.init();
                }, 13);
            }

            // 画底圆
            circle() {
                let ctx = this.ctx;

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = '#fe8181';
                ctx.arc(this.circleX, this.circleY, this.radius, 0, 2*Math.PI, false);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            // 画弧线
            sector(n) {
                let ctx = this.ctx;

                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = this.lineWidth;
                ctx.strokeStyle = '#fff';
                ctx.lineCap = 'round';
                ctx.arc(this.circleX, this.circleY, this.radius, -Math.PI/2, -Math.PI/2 + n * this.rad, false);
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }

            // 运动
            init() {
                this.ctx.clearRect(0, 0, this.circleX * 2, this.circleY * 2);
                this.circle();

                if (this.speed > this.percent) {
                    clearInterval(this.timer);
                }

                if (this.percent != 0) {
                    this.sector(this.speed);
                }

                // 控制结束时动画的速度
                if (this.speed / this.percent > 0.90) {
                    this.speed += 1;
                } else if (this.speed / this.percent > 0.80) {
                    this.speed += 1.25;
                } else if (this.speed / this.percent > 0.70) {
                    this.speed += 1.5;
                } else {
                    this.speed += 1.75;
                }

                this.speed += 0.1;

                return this;
            }

            // 刷新
            refresh(percent) {
                clearInterval(this.timer);
                this.percent = percent;

                this.timer = setInterval(()=> {
                    this.init();
                }, 13);

                console.log('refresh');
            }
        }

        this.canvas = new Paint(this.props.percent);
    }

    componentWillUpdate(nextProps, nextState) {
        this.canvas.refresh(nextProps.percent);
    }

    render() {
        console.log('this.props.percent: %o', this.props.percent);
        return (
            <canvas width={this.state.width} height={this.state.height} className="income-round" id="cavnas">Your browser does not support the HTML5 canvas tag
            </canvas>
        );
    }
}

// Page
export default class Page extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            pageLoading: false,
            x: [],
            y: [],
            percent: 0,
            limit: 15,
            fee: 0,
            income: 0,
            withdraw: 0,
            withdrawInt: 0,
            withdrawFloat: 0
        }

        this.shareIncome = this.shareIncome.bind(this);
    }

    componentWillMount(){
        let _this = this;

        // 滚动到顶部
        win.scrollTo(0, 0);

        // page 统计
        PAGEST({
            id: 'mypurse_ic',
            type: 'other'
        });

        if (isKtt) {
            console.log('====',UMAnalytics.onEvent)
            UMAnalytics.onEvent('wallet_page');
        }

        // 请求数据
        REQUEST({
            url: `${CONFIG.BASEURL}/Payment_Api_Account/index?token=${window.ground.getUserInfo().getToken()}`,
            type: 'get',
            getParams: {
                guid: getUserInfo.getGuid()
            },
            callback: 'getWallet'
        });

        // 数据回调
        // 数据中三目运算为避免后台数据返回null，前台页面显示NaN
        win.getWallet = function(get) {
            let getData = JSON.parse(decodeURIComponent(get));
            if (getData.code == 200) {
                let data = getData.data;
                let withdraw = data.withdraw ? convertMoney(data.withdraw, 2).split('.') : '0';
                //          console.log(getLinedata(data.incomeList));

                // balance  凤凰币
                // income  总收益
                // withdraw 可提现金额(余额)
                // fee 已经提现金额
                // limit 最低提现金额限制
                // withdraws 提现次数
                _this.setState({
                    pageLoading: false,
                    // withdraw: convertMoney(data.withdraw),
                    withdraw: data.withdraw / 100,
                    withdrawInt: withdraw[0] || 0,
                    withdrawFloat: withdraw[1] || 0,
                    withdrawTimes:data.withdrawTimes,
                    income: data.income ? convertMoney(data.income,2) : convertMoney(0,2),
                    balance: convertMoney(data.balance),//凤凰币
                    limit: convertMoney(data.limit),
                    fee: convertMoney(data.fee,2),
                    // percent: data.withdraw >= data.limit ? 100 : parseFloat(data.withdraw/data.limit*100),
                    allowWithdraw: data.withdraw >= data.limit, // 允许提现
                    x: [], // 折线图 x 轴
                    y: [] // 折线图 Y 轴
                });

                win.localStorage.setItem('balance', data.balance);
            } else {
                window.tipCallback = function() {}
                window.ground.defaultAlert('',getData.msg, '确认', '', 'tipCallback');
            }

            /**
             * 算折线图 数据
             */
            function getLinedata(incomeList) {
                let x = [];
                let y = [];
                let len = Math.floor(incomeList.length / 4);
                let lenL = 1;

                for (var i = incomeList.length-1; i > -1; i--) {
                    console.log(i);
                    if (incomeList.length <= 5) {
                        x.push(incomeList[i].time);
                        y.push(incomeList[i].money);
                    } else {
                        if (i == incomeList.length-1) {
                            x.push(incomeList[i].time);
                            y.push(incomeList[i].money);
                        } else if (i == incomeList.length - len*lenL) {
                            x.push(incomeList[i].time);
                            y.push(incomeList[i].money);
                            lenL++;
                        }
                    }
                }

                // for (let i = 0; i > incomeList.length; i++) {
                //     console.log('111');
                //     if (incomeList.length <= 5) {
                //         x.push(incomeList[i].time);
                //         y.push(incomeList[i].money);
                //     } else {
                //         if (i == incomeList.length) {
                //             x.push(incomeList[i].time);
                //             y.push(incomeList[i].money);
                //         } else if (i == len*lenL) {
                //             x.push(incomeList[i].time);
                //             y.push(incomeList[i].money);
                //             lenL++;
                //         }
                //     }
                // }

                return {
                    x,
                    y
                }
            }
        };
    }

    componentDidMount() {
        // window.document.addEventListener('DOMContentLoaded',function() {
        // console.log('dom load-')
        // animNum.setOptions({
        //     element: 'aniNum',
        //     left: 0,
        //     data: {
        //         value: 1580.99,

        //     }
        // }).init();
        // });

    }

    //goto withdraw
    handleClickWithdraw() {
        //行为统计
        ACTST({
            type:'rpack_btndraw'
        });
        if (!this.state.allowWithdraw) {
            ground.defaultAlert('', `胜利在望\n满${this.state.limit}元就可以提现啦`, '知道了', '', 'tipsCallback');

            //提现次数 入口限制
            // else if (this.state.withdrawTimes>=3){
            //     ground.defaultAlert('',`本月3次提现次数已用尽`, '知道了', '', 'tipsCallback');
            // }
        } else {
            // 去提现页面
            // location.href = addLoginParams('https://user.iclient.ifeng.com/payment_home_withdraw/index');
            this.context.router.push({
                pathname: 'withdraw'
            });
        }

        win.tipsCallback = function() {};
    }

    //goto topup
    handleClickTopup() {
        win.tipsCallback = function() {};

        // ￥15 this.state.limit 门槛限制
        if (!this.state.allowWithdraw) {
            ground.defaultAlert('', `胜利在望\n满${this.state.limit}元就可以充值啦`, '知道了', '', 'tipsCallback');
        } else {
            this.context.router.push({
                // pathname: 'topupphone'
                pathname: 'topupdata'
            });
        }

        // this.context.router.push({
        //     // pathname: 'topupphone'
        //     pathname: 'topupdata'
        // });
    }
    //goto article
    handleClickTxt() {
        window.ground.dispatch('doc', 'https://api.iclient.ifeng.com/api_vampire_article_detail?aid=sub_40843047', '', '', '');
    }

    shareIncome() {
        ACTST({
            id: 'mypurse_ic',
            type:'popup_incomesmoney'
        });
        // clickShare();
        const totalWidth = 750;
        let userMoney = this.state.income;
        const titleArray = [
            '「赚钱局局长」',
            '「零花钱委员会常委」',
            '「挣钱代表大会代表」',
            '「收徒总局局长」',
            '「运钞大队队长」',
            '「钱庄大掌柜」',
            '「红包银行行长」',
            '「阅读赚钱研究院代言人」',
            '「零用钱科研院高级研究员」',
            '「新闻都知道办公厅主任」'
        ];
        const titleFontSize = 40;
        let titleId = parseInt(Math.random() * titleArray.length);
        let guid = window.grounds.getUserInfo().getGuid();
        let qrUrl = '';

        const numFontSize = 78;
        let numLen = Math.round(getStringLength(userMoney) / 2) * numFontSize;
        let numLeft = (totalWidth - numLen) / 2;
        let numNuitLeft = numLen / 2 + totalWidth / 2 + 10; //货币单位元与数字间隔10
        let titleLeft = (totalWidth - Math.round(getStringLength(titleArray[titleId]) / 2) * titleFontSize) / 2;

        //区分不同客户端师徒计划地址
        // let proid = window.ground.getDeviceInfo().getProid();
        // if (proid === 'ifengnews') {
        //     qrUrl = 'https://share.iclient.ifeng.com/employee2?guid=' + guid;
        // } else {
        //     qrUrl = 'https://share.iclient.ifeng.com/employee2?guid=' + guid + '&sf_from=ktt';
        // }

        qrUrl = 'https://ktt.iclient.ifeng.com/ktt_employee?guid=' + guid + '&sf_from=ktt';

        window.ImageshareCallBack = function() {};
        window.grounds.sharePictureToWeChat(
            JSON.stringify({
                imgUrl: 'https://p1.ifengimg.com/wallet/images/bg_sincome.png',
                imgWidth: totalWidth,
                imgHeight: 1334,
                shareType: 2, //1 分享好友  2 分享朋友圈
                watermark:[
                    //money num
                    {
                        type: 'text',
                        title: userMoney,
                        fontColor: '#b92320',
                        fontSize: numFontSize,
                        top: 480,
                        left: numLeft
                    },
                    {
                        type: 'text',
                        title: '元',
                        fontColor: '#b92320',
                        fontSize: 48,
                        top: 510,
                        left: numNuitLeft
                    },
                    {
                        type: 'text',
                        title: '被超大方的快头条晋升为',
                        fontColor: '#304d12',
                        fontSize: 30,
                        top: 625,
                        left: 210
                    },
                    //title
                    {
                        type: 'text',
                        title: titleArray[titleId],
                        fontColor: '#304d12',
                        fontSize: titleFontSize,
                        top: 678,
                        //    left: (750-titleArray[titleId].length * titleFontSize)/2
                        left: titleLeft
                    },
                    {
                        type: 'text',
                        title: '特发此状 以资鼓励',
                        fontColor: '#b92320',
                        fontSize: 28,
                        top: 740,
                        left: 256
                    },
                    {
                        type: 'qrcode',
                        url: qrUrl,
                        qrCodeSize: 250,
                        top: 800,
                        left: 250
                    },
                    {
                        type: 'text',
                        title: '[长按识别 领1-200元现金]',
                        fontColor: '#304d12',
                        fontSize: 24,
                        top: 1080,
                        left: 231
                    },

                ]
            }), 'ImageshareCallBack');
    }

    renderMain() {



        if (! ground.userIsLogin()) {
            window.ground.userLogin();
            return false;
        }
        if (this.state.pageLoading) {
            return (
                <Loading />
            );
        }

        //关闭端内导航
        window.grounds.setMultiToolBarHidden(true);

        let disabledClass = (!this.state.allowWithdraw || this.state.withdrawTimes >= 3)? 'disabled btn':'btn';
        let ios = window.ground.getDeviceInfo().getOs().indexOf('ios') > -1;
        // let getProid = window.ground.getDeviceInfo().getProid();
        let urlIfengplan, urlDailytask;
        if (isIfengnews) {
            urlIfengplan = 'https://share.iclient.ifeng.com/luckybag#/ifengplan?show_pupil=1';
            urlDailytask = 'https://share.iclient.ifeng.com/luckybag#/dailytask';
        }
        if (isKtt) {
            urlIfengplan = 'https://share.iclient.ifeng.com/luckybag_ktt#/ifengplan?show_pupil=1';
            urlDailytask = 'https://share.iclient.ifeng.com/luckybag_ktt#/daily_rule';
        }

        return (
            <div>
                {
                    isKtt ?
                        <div className="notice-wrap" onClick={this.handleClickTxt.bind(this)}>
                            <h3 className="notice-tt">为什么别人用快头条赚了这么多钱</h3>
                            <a className="notice-link">点击查看</a>
                        </div>
                        :
                        null
                }

                {/* <div className="income-balance">
                    <PanitRound percent={this.state.percent} />

                    <div className="income-text">
                        <p>余额</p>
                        <p><span>￥{this.state.withdrawInt}.</span>{this.state.withdrawFloat}</p>
                        {<a className={disabledClass} onClick={this.handleClickWithdraw.bind(this)}>提现</a>}
                    </div>
                </div>

                <ul className="income-list">
                    <li><Link to="recordincome"><span>{this.state.income}</span>收入记录(元)</Link></li>
                    <li><Link to="recordwithdraw"><span>{this.state.fee}</span>提现记录(元)</Link></li>
                </ul> */}

                <div className="income-wrap">
                    <h3 className="income-tt">账户余额(元)</h3>
                    {/* <em className="income-num">{convertMoney(this.state.withdraw,2)}</em> */}
                    {/* <AnimNum value={this.state.withdraw} width={rem2px(6.9)} height={rem2px(1.9)} font={rem2px(1.2)} /> */}
                    <CountUp
                        className="income-num"
                        start={0}
                        end={this.state.withdraw}
                        duration={0.8}
                        useEasing={true}
                        decimals={2}
                        separator= ","
                    />
                </div>

                <div className="nav-box">
                    <Link className="navitem-wrap" onClick={this.handleClickWithdraw.bind(this)}>
                        <em className="navitem">提现</em>
                    </Link>
                </div>

                {
                    isIfengnews ?
                        <div className="nav-box">
                            <Link className="navitem-wrap" onClick={this.handleClickTopup.bind(this)}>
                                <em className="navitem navitem-recharge">充值中心</em>
                            </Link>
                        </div>
                        :
                        null
                }

                <div className="nav-box">
                    <Link to="/recordincome"  className="navitem-wrap">
                        <em className="navitem navitem-his">历史记录</em>
                        {/* {
                            isKtt ?
                            <em className="navitem-tiptxt">新春双倍奖励到账</em>
                            :
                            null
                        } */}
                    </Link>
                </div>

                {/* ifengnews android + income < 1  => hide
                 涉及品牌元素
                 isIfengnews && !ios || this.state.income < 1 ?
                */}

                {/* {
                    isKtt && this.state.income >= 1 ?
                    <a className="adbox-wrap adbox-income" onClick={this.shareIncome}>
                        <div>
                            <h3 className="adtt">晒收入，赚金币</h3>
                            <p className="adinfo">每天首次分享到朋友圈，有2人点击轻松赚取30金币</p>
                            <em className="addbtn">炫耀一下</em>
                        </div>
                    </a>
                    :
                    null
                } */}

                {/* <a className="adbox-wrap adbox-redbag" href={urlDailytask}>
                    <div>
                        <h3 className="adtt">天天有红包</h3>
                        <p className="adinfo">【师徒计划】、【凤凰令红包】、【好评大赛】，每日领钱到手软</p>
                        <em className="addbtn">立即领取</em>
                    </div>
                </a> */}

                {/* {
                    isKtt ?
                    <a className="adbox-wrap" href={urlIfengplan}>
                        <div>
                            <h3 className="adtt">收徒越多收入越多</h3>
                            <p className="adinfo">邀请朋友下载新闻客户端，看新闻也能轻松赚钱</p>
                            <em className="addbtn">立即领取</em>
                        </div>
                    </a>
                    :
                    null
                } */}


                {/*
                <Chart x={this.state.x} y={this.state.y} />
                {this.state.x.length ? <Chart x={this.state.x} y={this.state.y} /> : null}
                */}
            </div>
        );
    }

    // ['10-1', '10-2', '10-3', '10-4', '10-10']
    // [12.01, 19.33, 30.45, 50, 180.1]

    render() {
        return (
            <div className="income">
                <Header />
                {this.renderMain()}
            </div>
        );

    }
}


Page.contextTypes = {
    router: PropTypes.object.isRequired
};