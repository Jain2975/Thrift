import { useState,useContext,useEffect,createContext, Children } from "react";

type User={
    id:number;
    name:string;
    email:string;
};

type AuthContextType={
    user: User | null;
    login: (user:User) => void;
    logout: () => void; 
};

const AuthContext=createContext<AuthContextType | null>(null);

export const AuthProvider=({children}: {children: React.ReactNode})=>{
    const [user,setUser]=useState<User | null>(null);

    useEffect(()=>{
        const storedUser=localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[]);

    const login =(user:User)=>{
        setUser(user);
        localStorage.setItem("user",JSON.stringify(user));
    }
    const logout =()=>{
        setUser(null);
        localStorage.removeItem("user");
    }

    return (
        <AuthContext.Provider value={{user,login,logout}} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth= ()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}