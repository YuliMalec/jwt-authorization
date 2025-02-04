import { config } from 'process';
import axios from "axios";
import { AuthResponse } from "../models/response/authResponse";


export const API_URL='http://localhost:5000/api';

const $api = axios.create({
    withCredentials:true,
    baseURL:API_URL
})

$api.interceptors.request.use((config)=>{
config.headers.Authorization =  `Bearer ${localStorage.getItem('token')}`
return config;
})

$api.interceptors.response.use((config)=>{
    return config;
},async (error)=>{
    const originRequest = error.config
    if(error.response.status == 401 &&  !error.config._isRetry && error.config){
        originRequest._isRetry = true
        try{
          const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true}) 
        localStorage.setItem('token',response.data.accessToken)
        return $api.request(originRequest)  
        }catch(e){
            console.log('Not authorized.')
        }
        
    }
    throw error;
})
export default $api;