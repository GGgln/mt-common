import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL: 'mtCommonApi',
  timeout: 30000 // 请求超时时间
})

// respone拦截器
service.interceptors.response.use(
  response => {
    //  code为非0是抛错 可结合自己业务进行修改
    const res = response.data
    console.log('HTTP >>>>> ', response.request.responseURL, response.request.status, response.data)
    if (res.code !== '0') {
      return Promise.reject('Error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    return Promise.reject(error)
  }
)

export default service
