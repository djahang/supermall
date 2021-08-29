export function debounce(func,deley){    //防抖动，防抖函数（参数一是函数，参数二是设置的时间）
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
