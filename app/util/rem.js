// 计算 REM
function getFontSize() {
  var clientWidth = document.documentElement.clientWidth,
    fontSize = 10 * 10;

  if (!clientWidth) return;

  if (clientWidth < 1080) {
    fontSize = 100 * (clientWidth / 750);
  } else {
    fontSize = 100 * (1080 / 750);
  }

  return fontSize;
}

export function adaptSize() {
  var doc = document;
  var _root = doc.documentElement;
  var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var resizeCallback = function () {
    _root.style.fontSize = getFontSize() + 'px';
  };

  if (!doc.addEventListener) {
    return;
  }

  var ua = navigator.userAgent;
  if (/Android/i.test(ua)) {
    _root.className += ' android';
  }

  if (/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i.test(ua)) {
    _root.className += ' ios';
  }

  window.addEventListener(resizeEvent, resizeCallback, false);
  doc.addEventListener('DOMContentLoaded', resizeCallback, false);
}

// 计算 REM 后 PX 值
export function rem2px(number) {
  return Number((number * getFontSize()).toFixed(3));
}
