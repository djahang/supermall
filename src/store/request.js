import axios from 'axios'
export function request(config){

  //1,定义axios的实例
  const instance = axios.create({
    baseURL:'http://123.207.32.32:8000',
    timeout:8000
  })

  //2,使用拦截器  ininterceptors 拦截器， request请求，response响应
  //2,1   请求拦截
  // instance.interceptors.request.use((res)=>{
  //   //res：请求体的信息配置 ---------- 请求拦截必须返回，返回的是请求信息！！！
  //   console.log(res);
  //   return res
  // },err =>{
  //   console.log(err);
  // })

  //2,1   响应拦截
  instance.interceptors.response.use(res=>{
    // console.log(res);
    //响应拦截必须返回, 返回里面的data数据就行了
    return res.data
  },err=>{
    console.log(err);
  })

  //第四种写法，直接返回axios实例，因为自带promise
  return instance(config)
}
