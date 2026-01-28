import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { loginUserAPI } from "../services/userServices";

function Login(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const {login} = useAuth();

    const handleLogin = async (e: React.FormEvent)=>{
        e.preventDefault();
        
        try{
            const data = await loginUserAPI(email,password);
            login(data.user);
            navigate("/dashboard")

        }catch(err: any){
            setError(err.response?.data?.error || "Login Failed")
        }
    }

    return (
<div className="min-h-screen flex items-center justify-center bg-blue-50">
<form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96">
<h2 className="text-2xl font-bold mb-6">Login</h2>


  {error && <p className="text-red-500 mb-3">{error}</p>}


<input
type="email"
placeholder="Email"
className="w-full border p-2 mb-4 rounded"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>


<input
type="password"
placeholder="Password"
className="w-full border p-2 mb-4 rounded"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>


<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
Login
</button>
</form>
</div>
);
}

export default Login;