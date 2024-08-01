
import axios from 'axios';
import { parseCookies } from 'nookies';

export const apiUrl =  "https://api.nerdola.com.br/" 
// export const apiUrl =  "http://localhost:3000/" 

const api = axios.create({
    baseURL: apiUrl,
    headers: { 'Content-Type': 'application/json' },
});

api?.interceptors?.request.use(async function (config) {
    const cookies = parseCookies()
    config.headers['Authorization'] = `Bearer ${cookies.token || 'empty'}`;
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

    if(status == 401 && window.location.href != "/login"){
        window.location.pathname = "/login"
    }

    return Promise.reject(error);
});

export default api