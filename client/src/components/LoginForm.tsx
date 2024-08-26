import React,{FC} from 'react'
import { Context } from '..'
import {observer} from 'mobx-react-lite'

const LoginForm :FC= ()=>{
    const [email,setEmail] = React.useState<string>('')
    const [password,setPassword] = React.useState<string>('')
    const {store} = React.useContext(Context)
  return (
    <div>
        <input 
        onChange={(e)=>setEmail(e.target.value)}
        type='text'
         placeholder='email'
          value={email}/>
        <input type='password'
        onChange={(e)=>setPassword(e.target.value)}
         placeholder='password'
          value={password}/>
          <button onClick={()=>store.login(email,password)}>Login</button>
          <button onClick={()=>store.registration(email,password)}>Registration</button>
    </div>
  )
}
export default observer(LoginForm);

