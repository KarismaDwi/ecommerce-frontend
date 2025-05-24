'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const MyProfile = () => {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:7000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setForm({
        username: response.data.username || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login'); // redirect ke halaman login
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:7000/api/edit/${profile.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
      fetchProfile(); // refresh profile
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">My Profile</h1>

        {isEditing ? (
          <div className="space-y-4 text-gray-700">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-between mt-4">
              <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-gray-700">
            <div>
              <span className="font-semibold">Username:</span> {profile.username}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {profile.phone}
            </div>
            <div>
              <span className="font-semibold">Address:</span> {profile.address}
            </div>
            <div>
              <span className="font-semibold">Role:</span> {profile.role}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
