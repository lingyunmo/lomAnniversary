import axios from 'axios'; // 引入 Axios 库，用于处理 HTTP 请求

// 创建 Axios 实例，并设置基础 API 地址
const api = axios.create({
    baseURL: '/api', // 统一配置所有请求的基础路径
});

// 请求拦截器：在请求发送前自动执行
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // 从本地存储中获取用户 Token
    if (!token) return Promise.reject('未登录'); // 如果没有 Token，则拒绝请求
    config.headers.Authorization = `Bearer ${token}`; // 在请求头中添加身份验证信息
    return config; // 继续发送请求
}, error => Promise.reject(error)); // 如果请求拦截发生错误，则返回错误信息

// 响应拦截器：在响应返回后自动执行
api.interceptors.response.use(
    response => response, // 直接返回服务器响应
    error => {
        // 处理 401（未授权）和 403（禁止访问）错误
        if ([401, 403].includes(error.response?.status)) {
            console.warn('未授权访问'); // 在控制台警告用户
        }
        return Promise.reject(error); // 继续抛出错误，以便调用方处理
    }
);

export default api; // 导出封装好的 Axios 实例，供其他模块使用
