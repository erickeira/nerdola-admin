
import axios from 'axios';
const apiUrl =  "http://localhost:3000/" 

const api = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
});

api?.interceptors?.request.use(async function (config) {
    const token =  "c58b32597c0e60fd388a83694f1f59a7d0137405a6dcbd73457d6de0fbc77e6f4deadb068b449f37"
    config.headers['Authorization'] = `Bearer ${token || 'empty'}`;
    return config;
  }, function (error) {
      console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

api?.interceptors?.response.use(function (response) {
    let { data , headers }  = response
    return response;    
}, async function (error) {
    let data  = error?.response?.data
    let status = error?.response?.status

    return Promise.reject(error);
});

export default api