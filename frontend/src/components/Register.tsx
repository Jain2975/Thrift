import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserAPI } from "../services/userServices";


function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const navigate = useNavigate();


const handleRegister = async (e: React.FormEvent) => {
e.preventDefault();


try {
await registerUserAPI(name, email, password);
navigate("/login");
} catch (err: any) {
setError(err.response?.data?.error || "Registration failed");
}
};


return (
<div className="min-h-screen flex items-center justify-center bg-blue-50">
<form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-96">
<h2 className="text-2xl font-bold mb-6">Register</h2>


{error && <p className="text-red-500 mb-3">{error}</p>}


<input
type="text"
placeholder="Name"
className="w-full border p-2 mb-4 rounded"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>


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


<button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
Register
</button>
</form>
</div>
);
}


export default Register;