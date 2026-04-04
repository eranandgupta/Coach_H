import { NextRequest, NextResponse } from 'next/server';
import { VIDEO_CATEGORIES, getScreenPalThumbnail } from '@/lib/screenpal';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      // Return all categories with video counts
      const categories = VIDEO_CATEGORIES.map((cat) => ({
        id: cat.id,
        folderName: cat.folderName,
        videoCount: cat.subCategories
          ? cat.subCategories.reduce((sum, sub) => sum + sub.videos.length, 0)
          : (cat.displayCount ?? cat.videos.length),
        channelUrl: cat.channelUrl,
        requiredPlans: cat.requiredPlans,
        subCategories: cat.subCategories?.map((sub) => ({
          id: sub.id,
          folderName: sub.folderName,
          videoCount: sub.videos.length,
        })),
      }));

      return NextResponse.json({ categories }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Get videos for specific category — search top-level and sub-categories
    let categoryData = VIDEO_CATEGORIES.find((cat) => cat.id === category);
    if (!categoryData) {
      for (const cat of VIDEO_CATEGORIES) {
        if (cat.subCategories) {
          const sub = cat.subCategories.find((s) => s.id === category);
          if (sub) { categoryData = sub; break; }
        }
      }
    }
    if (!categoryData) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const videos = categoryData.videos.map((video) => ({
      id: video.id,
      name: video.title,
      title: video.title,
      url: video.embedUrl,
      thumbnail: video.thumbnail || getScreenPalThumbnail(video.id),
    }));

    return NextResponse.json({ videos }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
