import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: '',
  timeout: 30000 // 请求超时时间
})

Axios.interceptors.request.use(config => {
  let user = sessionStorage.getItem('userInfo')
  if(user){
      config.headers['userId'] = user.userId;
     //  config.headers['userName'] = URLEncoder.encode(user.userName, "UTF-8");
      return config;
  } else{
      router.push('/login')
  }
 // if (config.url.indexOf('login') == -1) {
 //     var uuid = sessionStorage.getItem("uuid");
 //     if (!uuid) {
 //         router.push('/login');
 //         return;
 //     }
 //     config.headers['uuid'] = uuid;
 // }


}, error => {  //请求错误处理

 Promise.reject(error)
});

// respone拦截器
service.interceptors.response.use(
  response => {
    //  code为非0是抛错 可结合自己业务进行修改
    const res = response.data
    console.log('HTTP >>>>> ', response.request.responseURL, response.request.status, response.data)
    if (res.code !== '0') {
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(new Error(error))
  }
)

export default service
