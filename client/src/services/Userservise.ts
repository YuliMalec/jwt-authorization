import $api from "../http";
import {AxiosResponse} from 'axios'

import { IUser } from "../models/response/Iuser";


export default class Userservise{
 static fetchUsers():Promise<AxiosResponse<IUser[]>>{
    return $api.get<IUser[]>('/users')
 }
}