import $api from "../http";
import {AxiosResponse} from 'axios'
import { AuthResponse } from "../models/response/authResponse";


export default class Authservise{
    static async login(email:string,password:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/login',{email,password})
       
    }
    static async registration(email:string,password:string):Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/registration',{email,password})
       
    }
    static async logaut():Promise<void>{
        return $api.post('/logaut')
       
    }
    
}