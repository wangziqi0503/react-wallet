const win = window;
const grounds = win.grounds;


/**
 * 分 转 元
 * @param {*} number
 * @param {*} fixed 几位小数点
 */
export function convertMoney(number, fixed) {
  if (typeof number != 'number') {
    number = parseInt(number);
  }

  number /= 100; // 转成 分

  // 保留小数点
  if (fixed) {
    number = number.toFixed(fixed);
  } else {
    number += '';
  }

  var reg = number.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g; //千分符的正则

  number = number.replace(reg, '$1,');

  return number;
}

/**
 * 两数值比较返回最小值
 */
export function getMin(n1, n2) {
  if (n1 >= n2) {
    return n2;
  } else {
    return n1;
  }

}

/**
 * 客户端请求
 * @export
 * @param {any} options
 */
export function REQUEST(params) {
  if (!params.getParams) params.getParams = '';
  if (!params.postParams) params.postParams = '';
  if (!params.standards) params.standards = true;

  grounds.requestBridge(
    params.url,
    JSON.stringify(params.postParams),
    JSON.stringify(params.getParams),
    params.type,
    params.standards,
    params.callback
  );
}

/**
 * 页面统计
 * @export
 * @param {any} params
 */
export function PAGEST(params) {
  grounds.pageStat(JSON.stringify(params));
}

/**
 * 行为统计
 * @export
 * @param {any} params
 */
export function ACTST(params) {
  grounds.actionStat(JSON.stringify(params));
}


/**
 * 添加 URL 鉴权参数
 * @export
 * @param {any} url 
 * @returns 
 */
export function addLoginParams(url) {
  let getUserInfo = window.ground.getUserInfo();
  let deviceInfo = window.ground.getDeviceInfo();
  let guid = getUserInfo.getGuid();
  let token = getUserInfo.getToken();
  let os = deviceInfo.getOs();
  let deviceid = deviceInfo.getDeviceId();
  let av = deviceInfo.getAv();
  let gv = deviceInfo.getGv();
  let proid = deviceInfo.getProid();
  let uid = deviceInfo.getUid();
  let vt = deviceInfo.getUid();
  let screen = deviceInfo.getScreen();
  let publishid = deviceInfo.getPublishid();

  return `${url}?loginid=${guid}&os=${os}&guid=${guid}&token=${token}&deviceid=${deviceid}&dnmode=day&proid=${proid}&gv=${gv}&av=${av}&uid=${uid}&vt=${vt}&screen=${screen}&publishid=${publishid}&nw=wifi&token=${token}&dontclearhistory=1`;
}


/**
 * android telesign 验证
 * @export
 */

export function doAndroidVerify(callback) {
  const win = window;
  const ground = win.ground;

  ground.defaultAlert('', '您绑定的手机号未通过安全验证，请完成安全验证。', '暂不验证', '安全验证', 'doSafeVerifyCallback');

  win.doSafeVerifyCallback = function (data) {
    if (data == 'right') {
      ground.startSecureVerify('doTrySafeVerifyCallback');
    }

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
      callback && callback();
    } else {
      win.ground.defaultAlert('', '验证失败，请确认当前登录账户绑定的手机号为您现在使用的号码，并且手机信号正常。', '稍后再试', '重新验证',
        'doAgainSafeVerifyCallback');
    }
  }

  // 重新再次验证
  window.doAgainSafeVerifyCallback = function (data) {
    if (data == 'right') {
      window.ground.startSecureVerify('doTrySafeVerifyCallback');
    }
  }
}

/**
 * 时间戳格式化 => 年-月-日 时:分:秒
 * @timestr 时间戳 秒
 */
export function formatTime(timestr) {
  var oTime = new Date(timestr * 1000);
  var formatTime = '';
  var min = oTime.getMinutes();
  var sec = oTime.getSeconds();
  min = min < 10 ? '0'+min : min;
  sec = sec < 10 ? '0'+sec : sec;
  
  // 格式化数字 => 不足2位 前补0
  function formatNum(num) {
    return num = num < 10 ? '0'+num : num;
  }

  formatTime += oTime.getFullYear() + 
    '-' + formatNum( oTime.getMonth() +1 ) + 
    '-' + formatNum( oTime.getDate() ) + 
    ' ' + formatNum( oTime.getHours() ) +
    ':' + formatNum( oTime.getMinutes() ) +
    ':' + formatNum( oTime.getSeconds() ); 
  return formatTime;  
  
}

/**
 * 下拉到页面底部加载更多
 */
export function scrollMore(callback,isPost) {
  let winH = window.innerHeight;
  // let documetH = document.body.clientHeight; // =scrollH
  let scrollH =  document.body.scrollHeight;
  let scrollTop = document.body.scrollTop || 
      document.documentElement.scrollTop || 
      window.pageYOffset;
  let scrollBottom = scrollH - scrollTop;

  if(scrollBottom >= winH && scrollBottom <= winH +50 && !isPost) {
  // if(scrollBottom >= winH && scrollBottom <= winH +50) {
      //加载更多
      callback();
  }
}

/**
 * 双字节的替换成两个单字节的然后再获得长度
 * @export
 * @param {any} str
 * @returns
 */
export function getStringLength(str) {
  if (str == null) return 0;

  if (typeof str != 'string'){
    str += '';
  }

  return str.replace(/[^\x00-\xff]/g, '01').length;
  // return [...str].length;
}

/**
 * 获取 hash 参数
 * @param {*string} key
 */
export function getHashQueryString(key) {
    let hash = window.location.hash;
    let reg = new RegExp('[\?\&]' + key + '=([^\&]+)', 'i');
    let result = hash.match(reg);

    if (result == null || result.length < 1) {
        return '';
    }

    return result[1];
}