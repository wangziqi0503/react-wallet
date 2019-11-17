import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { PAGEST, ACTST, REQUEST, addLoginParams, convertMoney, getMin } from '../util/utils.js';
import CONFIG from '../util/CONFIG.js';
import './Withdraw.less';
import classnames from 'classnames';

const win = window;
const ground = win.ground;
const getUserInfo = ground.getUserInfo();
const deviceInfo = ground.getDeviceInfo();
const deviceid = deviceInfo.getDeviceId();

// Page
export default class Page extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: 0,
			step: 500, //step 提现增减幅度,单位分
			topNum: 0,
            
			aliCount: '',
            aliName: '',
			
			income: 0,
			incomeLast: 0,
            teleSignClass: true,
            
            isBindWx: false,

			isPost: false, //确认提现 发送状态标识
			confirmText: '绑定微信',

			isDisabled: ''
		}
	}

	componentWillMount() {
		let _this = this;
		// 滚动到顶部
		win.scrollTo(0, 0);

		// page 统计
		// PAGEST({
		// 	id: 'withdraw',
		// 	type: 'ph'
		// });
		// 请求数据
		REQUEST({
			url: `${CONFIG.BASEURL}/Payment_Api_WithdrawHome/index?token=${window.ground.getUserInfo().getToken()}`,
			type: 'get',
			getParams: {
				guid: getUserInfo.getGuid()
			},
			callback: 'getWithdraw'
		});

		// 数据回调
		win.getWithdraw = function (get) {
            let getData = JSON.parse(decodeURIComponent(get));
console.log('data====',getData)
			let data = getData.data;
            let lastWithdrawData = data.lastWithdrawData;
            
			let aliCount = '';
            let aliName = '';
            
			let income = data.income;
			let max = data.max;
			let topLine = getMin(max, Math.floor(income / _this.state.step) * _this.state.step);
            let isDisabled = '';
            
			if (!!lastWithdrawData.account && !!lastWithdrawData.account) {
				aliCount = lastWithdrawData.account;
				aliName = lastWithdrawData.actual_name;
				isDisabled = true;
			}
			// income 余额
			// lastWithdrawData 提现记录信息
			// isTeleSign 验证

			// aliCount 支付宝账号
			// aliName 支付宝姓名            

			_this.setState({
				aliCount: aliCount,
				aliName: aliName,
				isDisabled: isDisabled,
				max: data.max,//最高金额
				limit: data.limit,// 最小金额
				incomeLast: data.income, //扣除提现金额后的余额
				income: data.income,//用户余额
				topNum: topLine,
				os: deviceInfo.getOs(),
				pageToken: data.pageToken,
				isTeleSign: data.isTeleSign
			});
		};
	}
	//help
	handleHelp() {	
		this.context.router.push({
			pathname: 'qaincome'
		});	
	}
	//金额减去
	handleClickMinus() {
		if (this.state.value > 0) {
			this.setState({
				value: this.state.value - this.state.step <= 0 ? 0 : (this.state.value - this.state.step),
				incomeLast: this.state.income - this.state.value + this.state.step
			});
		}
	}
	//金额增加
	handleClickPlus() {
		if (this.state.incomeLast < this.state.step) return; //for容错，避免初始余额小于step
		if (this.state.value >= this.state.topNum) {
			this.setState({
				value: this.state.topNum,
				incomeLast: this.state.income - this.state.value
			});
		} else {
			this.setState({
				value: Number(this.state.value) + this.state.step,
				incomeLast: this.state.income - this.state.value - this.state.step
			});
		}
	}
	//支付宝账号相关
	handleAliCount() {
		this.setState({
			aliCount: this.refs.aliId.value
		})
	}
	handleAliName() {
		this.setState({
			aliName: this.refs.aliName.value.replace(/[^\u4E00-\u9FA5]/g,'')
		})
	}
	//confirm
	handleConfirm() {
		let _this = this;
		//行为统计
		// ACTST({
		// 	id: 'withdraw',
		// 	type: 'btndraw'
		// });
		win.tipsCallback = function () { };
		win.goHome = function () {
			_this.context.router.push({
				pathname: '/'
			});
        }

        if (this.state.confirmText === '绑定微信') {
            // ground.getWechatOpenId(); //wait

			ground.defaultAlert('', `请输入提现金额`, '知道了', '', 'bindwx');
            window.bindwx = function () {
                _this.setState({
                    isBindWx: true
                });
            }
            return;
        }
		if (!this.state.value) {
			ground.defaultAlert('', `请输入提现金额`, '知道了', '', 'tipsCallback');
			return;
		}

		//android telesign 验证
		if (ground.getDeviceInfo().getOs().indexOf('android') != -1 && this.state.isTeleSign == 0) {
			doAndroidVerify();
		}
		//android telesign 验证核心功能
		function doAndroidVerify(callback) {
			const win = window;
			const ground = win.ground;

			ground.defaultAlert('', '现在进行安全验证可以加速提现流程，\n 验证过程中如遇电话挂断即可；\n 您也可以跳过安全验证，进入审核流程。', '暂不验证', '立即验证', 'doSafeVerifyCallback');

			win.doSafeVerifyCallback = function (data) {
				if (data == 'right') {
					ground.startSecureVerify('doTrySafeVerifyCallback');
				} else {
					//高危提现-未进行安全验证		
					_this.setState({
						teleSignClass: true,
						isTeleSign: 3
					});
					confirmWithdraw();
				}
				//		    else {
				//              未验证不予提现	
				//		    	_this.setState({
				//					teleSignClass:false
				//				})
				//		    }
			}

			/**
			 * data: {
			 *  result: true/false,
			 *  code: 10001/10003/10005
			 * }
			 *  code: - 10001 [超过单日最大限制次数] 
					  - 10003 [设备不匹配，手机号不一样] 
					  - 10005 [安卓设备版本过低，低于4.0.3]
					  - 10007 [用户等待时间过长，验证超时]
			 */
			win.doTrySafeVerifyCallback = function (get) {
				let data = JSON.parse(decodeURIComponent(get));

				if (data.result) {
					// 验证成功提现
					_this.setState({
						teleSignClass: true,
						isTeleSign: 1
					});
					confirmWithdraw();
					//		      callback && callback();

				} else {
					win.ground.defaultAlert('', '验证失败，请确认当前登录账户绑定的手机号为您现在使用的号码，并且手机信号正常。', '稍后再试', '重新验证',
						'doAgainSafeVerifyCallback');
					_this.setState({
						teleSignClass: false
					})
				}
			}

			// 重新再次验证
			window.doAgainSafeVerifyCallback = function (data) {
				if (data == 'right') {
					window.ground.startSecureVerify('doTrySafeVerifyCallback');
				} else {
					// 高危提现 - 验证未通过
					_this.setState({
						teleSignClass: true,
						isTeleSign: 2
					});
					confirmWithdraw();
				}
			}
		}
		//end Android teleSign 验证	


		confirmWithdraw();
		function confirmWithdraw() {
			//避免ios没有传入ieTeleSign,判断条件增加若为ios不管有没有isTeleSign字段均予提现
			if ((_this.state.isTeleSign || ground.getDeviceInfo().getOs().indexOf('ios') != -1) && !_this.state.isPost) {
				_this.setState({
					isPost: true,
					confirmText: '数据发送中...'
				});

				// 发送数据
				REQUEST({
					url: `${CONFIG.BASEURL}/Payment_Api_Withdrawnew/addOrder?token=${window.ground.getUserInfo().getToken()}&guid=${window.ground.getUserInfo().getGuid()}`,
					//	           type: 'get',
					type: 'enpost',
					postParams: {
						deviceid: window.ground.getDeviceInfo().getDeviceId(),
						actual_num: _this.state.value,
						ali_id: _this.state.aliCount,
						ali_name: _this.state.aliName,
						page_token: _this.state.pageToken,
						// isTeleSign: this.state.isTeleSign
					},
					callback: 'goWithdraw'
				})
			} else {
				_this.setState({
					isPost: false,
					confirmText: '确认提现'
				});
				return;
			}
		}

		//确认提现callback
		win.goWithdraw = function (post) {
			let data = JSON.parse(decodeURIComponent(post));
			if (data.code == 200) {
				ground.defaultAlert('', data.msg, '确定', '', 'goHome');
			} else {
				ground.defaultAlert('', data.msg, '确定', '', 'tipsCallback');
			}
			_this.setState({
				isPost: false,
				confirmText: '确认提现'
			});
		}

	}
	renderMain() {
        let isDisabled;
        if (!this.state.isBindWx) {
            isDisabled = false;
        } else {
            isDisabled = !this.state.value || !this.state.teleSignClass;
            this.state.confirmText = '确认提现';
        }
		let disabledMinusClass = classnames({
			'opt-l': true,
			disabled: this.state.value == 0
		});
		let disabledPlusClass = classnames({
			'opt-r': true,
			disabled: this.state.value == this.state.topNum
		});
		let submitBtnDisClass = classnames({
			confirm: true,
			// disabled: isDisabled
			disabled: isDisabled
		});

		return (
			<div>
				<div className="withdraw-head">
					<h1 className="head-tt">提现到支付宝</h1>
					<span className="withdraw-help" onClick={this.handleHelp.bind(this)}></span>
				</div>

				<div className="main">
					<div className="main-tt">提现金额</div>
					<div className="main-cont">
						<span className={disabledMinusClass} onClick={this.handleClickMinus.bind(this)}></span>
						<div className="opt-num" ref="inputNum">{convertMoney(this.state.value)}</div>
						<span className={disabledPlusClass} onClick={this.handleClickPlus.bind(this)}></span>
					</div>
					<div className="main-ft">
						<span>余额  ￥{convertMoney(this.state.incomeLast, 2)} </span>
					</div>
				</div>
				<p className="main-tip">
					每月可提现3次，单次最多可提现{convertMoney(this.state.max)}元
                </p>

                <p className="wx-withdraw-wrap">
                {
                    this.state.isBindWx ? `已绑定微信：hzpdsz136628957` : '您还未绑定微信，无法提现' 
                }
                </p>
		
				<label className="confirm-wrap">
					<input
						className={submitBtnDisClass}
						type="button"
						name="confirm"
						value={this.state.confirmText}
						onClick={this.handleConfirm.bind(this)}
					/>
				</label>
				<p className="main-tip">*审核后到账，大约三个工作日</p>
			</div>
		);
	}
	render() {
		return (
			<div className="withdraw">
				{this.renderMain()}
			</div>
		);
	}
}


Page.contextTypes = {
	router: PropTypes.object.isRequired
};
