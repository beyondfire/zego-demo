import axios from 'axios'

const TIME_OUT = 10000
export const service = axios.create({
    timeout: TIME_OUT // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(config => {
  console.log(config);

  return config
}, error => {
  console.error('加载超时')
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  console.log(response);

  return response
}, error => {
  console.error('加载失败')
  console.error('服务器开小差了，请稍后再试')
  return Promise.reject(error)
})
