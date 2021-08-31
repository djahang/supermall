export function debounce(func,deley=50){    //防抖动，防抖函数（参数一是函数，参数二是设置的时间,默认50毫秒）
  let timer = null
  return function (...args){
    // console.log(timer+'222')
    if (timer) clearTimeout(timer)    //timer被清空，计时重新开始
    timer = setTimeout(()=>{
      func.apply(this,args)
    },deley)
    // console.log(timer+'111')
  }
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};
