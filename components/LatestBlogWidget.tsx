'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, Clock, ArrowRight, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readTime: number | null;
  publishedAt: string | null;
}

export default function LatestBlogWidget() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchLatestPost();
  }, []);

  const fetchLatestPost = async () => {
    try {
      const response = await fetch('/api/blog/latest');
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error('Error fetching latest post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 bg-gradient-to-br from-brand-navy-light to-brand-navy border border-brand-blue/30 rounded-2xl shadow-2xl p-6 w-80 z-40">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      {/* Collapsed Widget */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-br from-brand-blue to-brand-gold hover:from-brand-blue/90 hover:to-brand-gold/90 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-all duration-300 group relative"
            >
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                1
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Widget */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 bg-gradient-to-br from-brand-navy-light to-brand-navy border border-brand-blue/30 rounded-2xl shadow-2xl overflow-hidden w-80 md:w-96 z-40"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-blue/20 to-brand-gold/20 border-b border-brand-blue/30 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-brand-blue to-brand-gold rounded-lg p-2">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-bold">Latest Blog Post</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {post.coverImage && (
                <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                {post.readTime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </>
                )}
              </div>

              <h4 className="text-white font-bold text-lg mb-3 line-clamp-2">
                {post.title}
              </h4>

              {post.excerpt && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <Link href={`/blog/${post.slug}`}>
                <button className="w-full bg-gradient-to-r from-brand-blue to-brand-gold hover:from-brand-blue/90 hover:to-brand-gold/90 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/blog">
                <button className="w-full mt-3 text-brand-blue hover:text-brand-gold text-sm font-semibold transition-colors">
                  View All Blog Posts
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
