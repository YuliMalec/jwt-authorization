import { makeAutoObservable } from "mobx";
import { IUser } from "../models/response/Iuser";
import Authservise from "../services/Authservise";
import axios from "axios";
import { AuthResponse } from "../models/response/authResponse";
import { API_URL } from "../http";

export default class Store{
    user ={}as IUser;
isAuth = false;
isLoading = false;
    constructor(){
      makeAutoObservable(this)
    }

    setAuth(bool:boolean){
        this.isAuth = bool;
    }
    setUsers(user:IUser){
this.user = user;
    }
    setLoading(bool:boolean){
        this.isLoading = bool;
    }
    
    async login(email:string,password:string){
        try{
const response =await Authservise.login(email,password)

localStorage.setItem('token',response.data.accessToken)
console.log(response)
this.setAuth(true)
this.setUsers(response.data.user)
        }catch(e){
console.log(e)
        }
    }
    async registration(email:string,password:string){
        try{
const response =await Authservise.registration(email,password)
console.log(response)
localStorage.setItem('token',response.data.accessToken)
this.setAuth(true)
this.setUsers(response.data.user)
        }catch(e){
console.log(e)
        }
    }
    async logaut(){
        try{
const response =await Authservise.logaut()
console.log(response)
localStorage.removeItem('token')
this.setAuth(false)
this.setUsers({}as IUser)
        }catch(e){
console.log(e)
        }
    }
    async checkAuth (){
        this.setLoading(true);
        try{
const response = await axios.get<AuthResponse>(`${API_URL}/refresh`,{withCredentials:true})
console.log(response)
localStorage.setItem('token',response.data.accessToken)
this.setAuth(true)
this.setUsers(response.data.user)
        }catch(e){
            console.log(e)
        }finally{
            this.setLoading(false)
        }
    }
}