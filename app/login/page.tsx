'use client';

import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError('');

    const response = await fetch('http://localhost:7000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login berhasil:', data);

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') {
        router.push('./dashboard');
      } else if (data.role === 'user') {
        router.push('/');
      }
    } else {
      setError(data.message || 'Login failed, please try again');
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');  // <<< ini buat pindah ke halaman register
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#D58A94] to-[#e6c3ca]">
      <div className="relative bg-white w-[350px] rounded-xl p-8 text-gray-700 z-10">
        <h2 className="text-xl font-semibold mb-6">Login</h2>

        {error && <div className="text-red-500 text-xs mb-4">{error}</div>}

        <div className="flex items-center bg-[#D58A94]/10 p-2 rounded-md mb-4">
          <FaEnvelope className="mr-2 text-[#D58A94] text-sm" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center bg-[#D58A94]/10 p-2 rounded-md mb-4">
          <FaLock className="mr-2 text-[#D58A94] text-sm" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div
          onClick={handleRegisterRedirect}
          className="text-right text-xs text-gray-400 mb-6 cursor-pointer hover:underline"
        >
          Register
        </div>

        <button
          onClick={handleLogin}
          className="bg-[#D58A94] text-white font-semibold w-full py-2 rounded-full hover:bg-[#D58A94]/80 transition"
        >
          Done →
        </button>
      </div>
    </div>
  );
}
