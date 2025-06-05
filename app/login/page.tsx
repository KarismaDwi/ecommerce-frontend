'use client';

import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const LoginCard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Update the handleLogin function:
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
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('role', data.role);
    localStorage.setItem('user_id', data.user_id); // Add this line
    
    if (data.role === 'admin') {
  router.push('./admin/dashboard');
} else if (data.role === 'karyawan') {
  router.push('./karyawan/dashboard');
} else {
  router.push('./profile');
}
  } else {
    setError(data.message || 'Login gagal');
  }
};

  const handleRegisterRedirect = () => {
    router.push('/register');  
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-[url('../public/bekron.jpeg')] bg-cover p-5">
      <div className="w-full max-w-md bg-nude bg-opacity-65 rounded-xl p-8 text-gray-700 z-10">
        <h2 className="text-xl font-semibold mb-6">Login</h2>

        {error && <div className="text-red-500 text-xs mb-4">{error}</div>}

        <div className="flex items-center bg-white p-2 rounded-md mb-4">
          <FaEnvelope className="mr-2 text-dusty text-sm" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center bg-white p-2 rounded-md mb-4">
          <FaLock className="mr-2 text-dusty text-sm" />
          <input
            type="password"
            placeholder="Kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
        
        <div className="text-right text-s text-gray-600">
        <span className="text-sm">Belum punya akun? </span>
        <button
          onClick={handleRegisterRedirect}
          className="text-right text-s font-bold text-tomat mb-6 cursor-pointer hover:underline"
        >
          Register
        </button>
        </div>

        <button
          onClick={handleLogin}
          className="bg-dusty text-white font-semibold w-full py-2 rounded-full hover:bg-dusty/80 transition"
        >
          Selesai →
        </button>
      </div>
    </div>
  );
}

export default LoginCard;