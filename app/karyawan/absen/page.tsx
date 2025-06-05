'use client';
import { useEffect, useState } from 'react';
import { FiCheckCircle, FiLogOut, FiLogIn } from 'react-icons/fi';

type Absen = {
  id: number;
  tanggal: string;
  jamMasuk: string;
  jamPulang: string;
  keterangan: string;
};

export default function AbsenKaryawanPage() {
  const [absenList, setAbsenList] = useState<Absen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [today, setToday] = useState<string>('');
  const [todayAbsen, setTodayAbsen] = useState<Absen | null>(null);
  const [message, setMessage] = useState('');

  // Get today string in YYYY-MM-DD
  useEffect(() => {
    const now = new Date();
    setToday(now.toISOString().slice(0, 10));
  }, []);

  // Fetch absen data user
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    setIsLoading(true);
    fetch('http://localhost:7000/api/absen', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then((data: Absen[]) => {
        setAbsenList(data);
        const absenToday = data.find(a => a.tanggal === today);
        setTodayAbsen(absenToday || null);
      })
      .catch(() => setAbsenList([]))
      .finally(() => setIsLoading(false));
  }, [today, message]);

  // Handle check-in
  const handleCheckIn = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;
    setIsLoading(true);
    setMessage('');
    const now = new Date();
    const body = {
      tanggal: today,
      jamMasuk: now.toTimeString().slice(0, 5),
      keterangan: ''
    };
    try {
      const res = await fetch('http://localhost:7000/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || 'Gagal absen masuk');
      } else {
        setMessage('Berhasil absen masuk');
      }
    } catch (err) {
      setMessage('Gagal absen masuk');
    }
    setIsLoading(false);
  };

  // Handle check-out
  const handleCheckOut = async () => {
    if (!todayAbsen) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setIsLoading(true);
    setMessage('');
    const now = new Date();
    const body = {
      jamPulang: now.toTimeString().slice(0, 5)
    };
    try {
      const res = await fetch(`http://localhost:7000/api/absen/${todayAbsen.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(data.message || 'Gagal absen pulang');
      } else {
        setMessage('Berhasil absen pulang');
      }
    } catch (err) {
      setMessage('Gagal absen pulang');
    }
    setIsLoading(false);
  };

  return (
    <div className="ml-64 max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-extrabold mb-6 text-pink-700 flex items-center gap-2">
        <FiCheckCircle className="text-pink-400" />
        Absen Karyawan
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4 mb-4">
          <div>
            <div className="font-semibold text-lg text-pink-600">Tanggal: {today}</div>
            <div className="mt-1">
              Status hari ini:&nbsp;
              {todayAbsen ? (
                <span className="font-bold text-green-600">
                  Sudah absen masuk {todayAbsen.jamMasuk}
                  {todayAbsen.jamPulang && (
                    <> | Sudah absen pulang {todayAbsen.jamPulang}</>
                  )}
                </span>
              ) : (
                <span className="font-bold text-red-500">Belum absen hari ini</span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {!todayAbsen && (
              <button
                disabled={isLoading}
                onClick={handleCheckIn}
                className="flex gap-2 items-center px-5 py-3 rounded-lg bg-green-500 text-white font-bold shadow hover:bg-green-600 transition">
                <FiLogIn /> Absen Masuk
              </button>
            )}
            {todayAbsen && !todayAbsen.jamPulang && (
              <button
                disabled={isLoading}
                onClick={handleCheckOut}
                className="flex gap-2 items-center px-5 py-3 rounded-lg bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition">
                <FiLogOut /> Absen Pulang
              </button>
            )}
          </div>
        </div>
        {message && (
          <div className="mt-2 text-sm font-semibold text-pink-600">{message}</div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-3 text-pink-700">Riwayat Absen</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-pink-50 text-pink-700">
                <th className="py-2">Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Pulang</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {absenList.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">Belum ada data absen.</td>
                </tr>
              )}
              {absenList.map((absen) => (
                <tr key={absen.id} className="border-b hover:bg-yellow-50">
                  <td className="py-2">{absen.tanggal}</td>
                  <td>{absen.jamMasuk || '-'}</td>
                  <td>{absen.jamPulang || '-'}</td>
                  <td>{absen.keterangan || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}