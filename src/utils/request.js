import axios from "axios";
import { ElMessage } from "element-plus";


export const service = axios.create({
  baseURL: '/api',// 请求的前缀
  timeout: 5000, // 请求超时时间
});

//请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 从本地存储中获取token
    const token = localStorage.getItem("token");
    if (token) {
      // 如果token存在，将其添加到请求头中
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

//响应拦截器
service.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const { data, config } = response;
    //处理业务状态码
    if (data.code === '200') {
      // 业务状态码为200，说明请求成功
      // 可以直接返回完整数据
      return data.data;
    } else {
      // 业务状态码不为200，说明请求失败
      // 可以根据业务状态码进行不同的处理
      if (data.code === '-1') {
        if (!config.url?.includes('/login')) {
          // 非登录请求，说明token过期或失效
          // 可以跳转到登录页重新登录
          ElMessage.error(data.msg || '登录过期，请重新登录');
          //清除登录信息
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          // 可以跳转到登录页重新登录
          window.location.href = "/auth/login";
        } else {
          // 其他业务状态码，说明请求失败
          // 可以根据业务状态码进行不同的处理
          ElMessage.error(data.msg || '登录过期，请重新登录');
          return Promise.reject('网络请求失败');
        }
      }
    }
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
