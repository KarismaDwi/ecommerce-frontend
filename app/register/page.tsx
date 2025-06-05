"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Reservasi = () => {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    } else if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:7000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // ==== SIMPAN TOKEN DAN ROLE JIKA ADA ====
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.role) localStorage.setItem('role', data.role);
        if (data.user?.id || data.user_id) localStorage.setItem('user_id', data.user?.id || data.user_id);
      }

      // ==== REDIRECT LANGSUNG KE DASHBOARD/HOME ====
      // Ganti '/' sesuai halaman tujuan user yang sudah login
      alert("Pendaftaran berhasil.");
      router.push("/");

    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Pendaftaran gagal silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('../public/bekron.jpeg')] bg-cover p-5">
      <form onSubmit={handleSubmit} className="bg-nude bg-opacity-65 p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Nomor Telpon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="w-1/2">
            <label className="block mb-1 font-semibold">Kata sandi</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Alamat</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
            rows={3}
          />
        </div>

        <input type="hidden" name="role" value={formData.role} />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-gray-400' : 'bg-dusty hover:bg-aduh'} text-white font-bold py-2 px-4 rounded-md transition duration-300`}
        >
          {isLoading ? 'Processing...' : 'Daftar'}
        </button>

        <div className="text-center mt-4">
          <span className="text-sm">Sudah punya akun? </span>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-tomat hover:underline font-bold"
          >
            LOGIN
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reservasi;