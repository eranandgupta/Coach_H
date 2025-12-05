import { NextRequest, NextResponse } from 'next/server';
import { VIDEO_CATEGORIES, getScreenPalThumbnail } from '@/lib/screenpal';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      // Return all categories with video counts
      const categories = VIDEO_CATEGORIES.map((cat) => ({
        id: cat.id,
        folderName: cat.folderName,
        videoCount: cat.videos.length,
      }));

      return NextResponse.json({ categories });
    }

    // Get videos for specific category
    const categoryData = VIDEO_CATEGORIES.find((cat) => cat.id === category);
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

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
