'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, ChevronRight, Clock, FileText } from 'lucide-react';

/** Latest blog posts: swipeable on phones, a three-column grid from laptop width up. */
export default function ArticlesRow({ posts }: { posts: any[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-xl font-bold text-white">Latest Articles</h2>
          <p className="text-gray-500 text-xs">Fitness tips &amp; insights</p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 min-h-[40px] text-brand-blue hover:text-brand-gold text-sm font-medium transition-colors"
        >
          View all
          <ChevronRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

      <div className="-mx-3 md:mx-0 flex gap-4 overflow-x-auto scrollbar-hide px-3 md:px-0 pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex-shrink-0 w-[min(18rem,80vw)] lg:w-auto glass-card overflow-hidden hover:border-white/[0.12] transition-colors"
          >
            <div className="relative h-36 bg-white/[0.04] overflow-hidden">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-white/20" aria-hidden />
                </div>
              )}
              {post.readTime && (
                <span className="theme-dark absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-1 bg-black/70 rounded-full text-[10px] font-medium text-white">
                  <Clock className="w-3 h-3" aria-hidden /> {post.readTime} min
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
                <Calendar className="w-3 h-3" aria-hidden />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Draft'}
              </p>
              <h3 className="text-white font-semibold line-clamp-2 group-hover:text-brand-blue transition-colors mb-2">{post.title}</h3>
              {post.excerpt && <p className="text-gray-400 text-xs line-clamp-2">{post.excerpt}</p>}
              <span className="inline-flex items-center gap-1 text-brand-blue text-xs font-medium mt-3">
                Read article <ArrowRight className="w-3 h-3" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
