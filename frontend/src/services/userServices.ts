import api from "../api/axios";

export const registerUserAPI = async (name: string , email: string ,passwrod: string) =>{
    const res=await api.post("/user/register",{name,email,passwrod});
    return res.data;

}

export const loginUserAPI = async (email: string,passwrod: string) =>{
    const res=await api.post("/user/login",{email,passwrod});
    return res.data;
}

