
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({children}){
  const [user,setUser] = useState(null);

  function login(username,password){
    if(username==='mayorsbetaguest' && password==='iamlucky321'){
      setUser({username});
      return true;
    }
    return false;
  }

  function logout(){
    setUser(null);
  }

  return <AuthContext.Provider value={{user,login,logout}}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth(){ return useContext(AuthContext); }
