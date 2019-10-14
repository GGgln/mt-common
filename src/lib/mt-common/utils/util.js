
// 格式化个位数
function format(num) {
  num = num > 9 ? num : '0' + num;
  return num
}


// 窗口变化方法
function resizeWindow(callback) {
  window.onresize = () => {
    return (() => {
      callback()
    })()
  }
}

function deepClone(obj) {
  let _obj = JSON.stringify(obj),
    objClone = JSON.parse(_obj);
  return objClone
}

function formatTime(date) {
  let getDate;
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (date instanceof Date) {
    getDate = new Date(date);
  } else {
    if (String(date).indexOf('-') != -1) {
      if (isiOS) {
        getDate = new Date(date.replace(/-/g, '/'));
      } else {
        getDate = new Date(date);
      }
    } else {
      getDate = new Date(parseInt(date));
    }
  }
  // let date = new Date(time);
  let Y = getDate.getFullYear();
  let M = (+getDate.getMonth() + 1) < 10 ? `0${+getDate.getMonth() + 1}` : +getDate.getMonth() + 1;
  let D = getDate.getDate() < 10 ? `0${getDate.getDate()}` : getDate.getDate();
  let H = getDate.getHours() < 10 ? `0${getDate.getHours()}` : getDate.getHours();
  let m = getDate.getMinutes() < 10 ? `0${getDate.getMinutes()}` : getDate.getMinutes();
  let s = getDate.getSeconds() < 10 ? `0${getDate.getSeconds()}` : getDate.getSeconds();
  let timeToS = `${Y}-${M}-${D} ${H}:${m}:${s}`
  let timeToH = `${Y}-${M}-${D} ${H}:${m}`
  let day = `${Y}-${M}-${D}`
  return {
    Y,
    M,
    D,
    H,
    m,
    s,
    timeToH,
    timeToS,
    day
  };
}

// 判断是否是空对象
function isEmptyObject(e) {
  var t;
  for (t in e) return !1;
  return !0;
}
export default {
  format,
  resizeWindow,
  deepClone,
  formatTime,
  isEmptyObject
}// 导出文件
