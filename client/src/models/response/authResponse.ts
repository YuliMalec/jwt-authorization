import {IUser} from './Iuser'
export interface AuthResponse{
    accessToken:string,
    refreshToken:string,
    user:IUser
}