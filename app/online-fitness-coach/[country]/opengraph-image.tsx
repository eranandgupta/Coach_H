import { ImageResponse } from 'next/server';
import { getCountryBySlug, getAllCountrySlugs } from '@/lib/countries';

// Per-country share image (WhatsApp groups, LinkedIn, X) — same look as the
// root and 1:1 OG images.
export const runtime = 'edge';
export const alt = 'Online Indian Fitness Coach for NRIs — Coach Himanshu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllCountrySlugs().map((country) => ({ country }));
}

export default async function Image({ params }: { params: { country: string } }) {
  const c = getCountryBySlug(params.country);
  const place = c?.name ?? 'Your Country';
  const approx = c?.approxStart ?? '$15';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0A0F1F 0%, #111827 50%, #0A0F1F 100%)',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(23, 95, 255, 0.14)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212, 168, 67, 0.12)', filter: 'blur(100px)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '9999px', border: '1px solid rgba(212,168,67,0.3)', background: 'rgba(212, 168, 67, 0.08)', marginBottom: '28px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A843' }} />
          <span style={{ color: 'rgba(212,168,67,0.95)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
            For Indians &amp; NRIs · 100% Online
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '56px', fontWeight: 800, color: 'white', lineHeight: 1.05 }}>Online Indian Fitness Coach</span>
          <span style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.05, background: 'linear-gradient(90deg, #175FFF, #60A5FA, #D4A843)', backgroundClip: 'text', color: 'transparent' }}>
            in {place}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '48px', marginTop: '40px' }}>
          {[
            { value: approx, label: 'Per Month, From (approx.)' },
            { value: 'Your Time Zone', label: 'Live Sessions' },
            { value: 'Indian Meals', label: 'Food You Can Cook' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '30px', fontWeight: 700, color: 'white' }}>{stat.value}</span>
              <span style={{ fontSize: '13px', color: 'rgba(156,163,175,0.8)', fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <span style={{ position: 'absolute', bottom: '24px', fontSize: '14px', color: 'rgba(156,163,175,0.5)', fontWeight: 500 }}>
          coachhimanshu.com · NASM Certified · with Coach Himanshu
        </span>
      </div>
    ),
    { ...size }
  );
}
