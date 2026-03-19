// "use client";
// import { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function Login() {
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const router = useRouter();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             // 1. Send data to your backend
//             const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
//             // 2. Save the "Key" (Token) so the Navbar knows you are logged in
//             localStorage.setItem('token', res.data.token);
            
//             alert("ACCESS GRANTED. WELCOME BACK.");
            
//             // 3. Send the user to the home page
//             router.push('/');
//             window.location.reload(); // Refresh to update the Navbar button
//         } catch (err) {
//             alert(err.response?.data?.message || "LOGIN FAILED. TRY AGAIN.");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
//             <h2 className="text-4xl font-bold mb-8 text-red-600 tracking-tighter uppercase">Identify Yourself</h2>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md border border-red-900/50 p-8 bg-zinc-900/50 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.2)]">
//                 <input className="bg-black border-b-2 border-red-900 p-3 focus:border-red-600 outline-none transition-all" 
//                     type="email" placeholder="EMAIL" 
//                     onChange={(e) => setFormData({...formData, email: e.target.value})} required />
//                 <input className="bg-black border-b-2 border-red-900 p-3 focus:border-red-600 outline-none transition-all" 
//                     type="password" placeholder="PASSWORD" 
//                     onChange={(e) => setFormData({...formData, password: e.target.value})} required />
//                 <button className="bg-red-600 hover:bg-red-700 text-white font-black py-3 mt-4 rounded transition-all active:scale-95" 
//                     type="submit">LOGIN</button>
//             </form>
//         </div>
//     );
// }


"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            alert("ACCESS GRANTED. WELCOME BACK.");
            router.push('/');
            // Small timeout to ensure the token is saved before refresh
            setTimeout(() => window.location.reload(), 100);
        } catch (err) {
            alert(err.response?.data?.message || "LOGIN FAILED. TRY AGAIN.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <h2 className="text-4xl font-bold mb-8 text-red-600 tracking-tighter uppercase" style={{ fontFamily: 'Creepster, cursive' }}>
                Identify Yourself
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-md border border-red-900/30 p-8 bg-zinc-900/40 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                <input className="bg-black border-b border-red-900 p-3 focus:border-red-600 outline-none transition-all text-white placeholder-zinc-700" 
                    type="email" placeholder="EMAIL" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input className="bg-black border-b border-red-900 p-3 focus:border-red-600 outline-none transition-all text-white placeholder-zinc-700" 
                    type="password" placeholder="PASSWORD" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                
                <button className="bg-red-600 hover:bg-red-700 text-white font-black py-3 mt-4 rounded shadow-[0_0_15px_#cc0000] transition-all active:scale-95 uppercase tracking-widest" 
                    type="submit" style={{ fontFamily: 'Creepster, cursive' }}>
                    Login
                </button>

                <p className="mt-4 text-center text-zinc-500 font-mono text-xs tracking-widest uppercase">
                    New Recruit?{" "}
                    <Link href="/signup" className="text-red-600 hover:text-red-400 underline transition-colors">
                        Join the Ranks
                    </Link>
                </p>
            </form>
        </div>
    );
}