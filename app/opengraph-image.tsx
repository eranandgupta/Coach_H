import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const alt = 'Coach Himanshu - NASM Certified Fitness Expert';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(23, 95, 255, 0.12)',
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
            background: 'rgba(23, 95, 255, 0.08)',
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
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(23, 95, 255, 0.1)',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#175FFF',
            }}
          />
          <span
            style={{
              color: 'rgba(147, 197, 253, 0.9)',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
            }}
          >
            NASM Certified Fitness Expert
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span
            style={{
              fontSize: '64px',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
            }}
          >
            Coach Himanshu
          </span>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 600,
              lineHeight: 1.2,
              background: 'linear-gradient(90deg, #175FFF, #60A5FA, #D4A843)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Transform Your Fitness Journey
          </span>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '48px',
            marginTop: '40px',
          }}
        >
          {[
            { value: '1000+', label: 'Clients Transformed' },
            { value: '6+', label: 'Years Experience' },
            { value: '95%', label: 'Commitment to Results' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>
                {stat.value}
              </span>
              <span style={{ fontSize: '13px', color: 'rgba(156,163,175,0.8)', fontWeight: 500 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <span
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '14px',
            color: 'rgba(156,163,175,0.5)',
            fontWeight: 500,
          }}
        >
          coachhimanshu.com
        </span>
      </div>
    ),
    { ...size }
  );
}
