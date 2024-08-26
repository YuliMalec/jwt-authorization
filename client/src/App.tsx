import React from 'react';
import LoginForm from './components/LoginForm';
import { Context } from '.';
import {observer} from 'mobx-react-lite'
import { IUser } from './models/response/Iuser';
import Userservise from './services/Userservise';

function App() {
  const {store}= React.useContext(Context);
  const [users,setUsers] = React.useState<IUser[]>([])



  React.useEffect(()=>{
if(localStorage.getItem('token')){
  store.checkAuth()
}
  },[])


   async function getUsers(){
    try{
    const response = await Userservise.fetchUsers()
    console.log(response)
    setUsers(response.data)
    }catch(e){
      console.log(e)
    }
   }
  if(store.isLoading){
    return <div>Loading...</div>
  }

  if(!store.isAuth){
    return <><h1>Log in.</h1><LoginForm/>
    <button onClick={getUsers}>Get users</button>
    </>
  }
  return (
    <div className="App">
      <h1>User is authorized {store.user.email}.</h1>
      <h2>{store.user.isActivated ? 'Account verift by mail.':'Verify your account!!!'}</h2>
   <button onClick={()=>store.logaut()}>Logout</button>
   <div><button onClick={getUsers}>Get users</button></div>
   {users.map(user=>{
    return <div key={user.email}>{user.email}</div>
   })}
    </div>
  );
}

export default observer(App);
