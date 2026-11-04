import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { app } from '../../Firebase/firebase.config';
const auth = getAuth(app);
type AuthState = { login: (email:string,password:string)=>Promise<boolean>; logout:()=>Promise<void>; isAuthenticated:boolean; loading:boolean; user:User|null };
const Context = createContext<AuthState | null>(null);
export function AuthProvider({children}:{children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>onAuthStateChanged(auth,u=>{setUser(u);setLoading(false)}),[]);
 const login=async(email:string,password:string)=>{try{await signInWithEmailAndPassword(auth,email.trim(),password);return true}catch{return false}};
 return <Context.Provider value={{login,logout:()=>signOut(auth),isAuthenticated:!!user,loading,user}}>{children}</Context.Provider>;
}
export const useAuth=()=>{const context=useContext(Context);if(!context)throw new Error('AuthProvider missing');return context};
