import { ImageResponse } from 'next/server';
import { getAllPairSlugs, getPairBySlug } from '@/lib/foodCompare';

export const runtime = 'edge';
export const alt = 'Indian food comparison: calories, protein and which is better';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPairSlugs().map((pair) => ({ pair }));
}

export default async function Image({ params }: { params: { pair: string } }) {
  const pair = getPairBySlug(params.pair);
  const sides = pair
    ? [
        { name: pair.nameA, kcal: pair.foodA.per100g.kcal, protein: pair.foodA.per100g.protein },
        { name: pair.nameB, kcal: pair.foodB.per100g.kcal, protein: pair.foodB.per100g.protein },
      ]
    : [];
  const longest = Math.max(0, ...sides.map((s) => s.name.length));
  const nameSize = longest > 14 ? '52px' : '68px';

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '9999px', border: '1px solid rgba(212,168,67,0.3)', background: 'rgba(212, 168, 67, 0.08)', marginBottom: '36px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4A843' }} />
          <span style={{ color: 'rgba(212,168,67,0.95)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
            Which is better?
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {sides.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {i === 1 && <span style={{ fontSize: '44px', fontWeight: 800, color: 'rgba(156,163,175,0.7)' }}>vs</span>}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '420px' }}>
                <span style={{ fontSize: nameSize, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.05 }}>{s.name}</span>
                <span style={{ marginTop: '18px', fontSize: '30px', fontWeight: 700, color: '#D4A843' }}>{s.kcal} kcal</span>
                <span style={{ marginTop: '6px', fontSize: '22px', color: 'rgba(209,213,219,0.85)' }}>{s.protein} g protein per 100 g</span>
              </div>
            </div>
          ))}
        </div>

        <span style={{ position: 'absolute', bottom: '24px', fontSize: '14px', color: 'rgba(156,163,175,0.5)', fontWeight: 500 }}>
          coachhimanshu.com · data from INDB, IFCT 2017 and USDA
        </span>
      </div>
    ),
    { ...size }
  );
}
