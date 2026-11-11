import { NextResponse } from 'next/server';
import { getUploadAuthParams } from '@imagekit/next/server';

// Never statically render: Next 13 caches a GET with no dynamic input at build time.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authParams = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    });

    return NextResponse.json(authParams);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth params' },
      { status: 500 }
    );
  }
}
