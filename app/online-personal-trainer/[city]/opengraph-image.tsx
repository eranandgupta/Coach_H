import { ImageResponse } from 'next/server';
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities';

export const runtime = 'edge';
export const alt = 'Online Personal Trainer — Live 1-on-1 Training with Coach Himanshu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }));
}

export default async function Image({ params }: { params: { city: string } }) {
  const city = getCityBySlug(params.city);
  const cityName = city?.name ?? 'India';

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
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(23, 95, 255, 0.14)',
            filter: 'blur(120px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(212, 168, 67, 0.12)',
            filter: 'blur(100px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            borderRadius: '9999px',
            border: '1px solid rgba(212,168,67,0.3)',
            background: 'rgba(212, 168, 67, 0.08)',
            marginBottom: '28px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A843' }} />
          <span
            style={{
              color: 'rgba(212,168,67,0.95)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
            }}
          >
            {cityName} · Live 1-on-1 Training
          </span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '58px', fontWeight: 800, color: 'white', lineHeight: 1.05 }}>
            Online Personal Trainer
          </span>
          <span
            style={{
              fontSize: '72px',
              fontWeight: 800,
              lineHeight: 1.05,
              background: 'linear-gradient(90deg, #175FFF, #60A5FA, #D4A843)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            in {cityName}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '40px' }}>
          {[
            { value: '₹7,999', label: '1:1 Starting From' },
            { value: '60 min', label: 'Live Sessions' },
            { value: 'No Commute', label: 'Train From Home' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '30px', fontWeight: 700, color: 'white' }}>{stat.value}</span>
              <span style={{ fontSize: '13px', color: 'rgba(156,163,175,0.8)', fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        <span style={{ position: 'absolute', bottom: '24px', fontSize: '14px', color: 'rgba(156,163,175,0.5)', fontWeight: 500 }}>
          coachhimanshu.com · with Coach Himanshu
        </span>
      </div>
    ),
    { ...size }
  );
}
