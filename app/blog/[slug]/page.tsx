'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { Calendar, Clock, User, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '@/components/Button';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  videoUrl: string | null;
  readTime: number | null;
  publishedAt: string | null;
  views: number;
  author: {
    name: string | null;
    image: string | null;
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        router.push('/blog');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-navy">
      <Navbar />

      <article className="pt-24 pb-12">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/blog')}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 mb-12"
        >
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              {post.author.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-gold rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white">{post.author.name || 'Coach Himanshu'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.readTime && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} min read</span>
                </div>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-96 rounded-2xl overflow-hidden mb-12 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* YouTube Video */}
          {post.videoUrl && (
            <div className="mb-12">
              <YouTubeEmbed url={post.videoUrl} title={post.title} />
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="bg-brand-navy-light border border-brand-navy-light/50 rounded-2xl p-8 md:p-12">
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ul:my-6
                prose-li:my-2
                prose-a:text-brand-blue prose-a:no-underline hover:prose-a:text-brand-gold
              "
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto px-6 mt-12"
        >
          <div className="bg-gradient-to-r from-brand-blue/10 to-brand-gold/10 border border-brand-blue/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Fitness Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Get personalized training and nutrition guidance from Coach Himanshu
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/#plans')}
              className="gap-2"
            >
              <span>Explore Plans</span>
            </Button>
          </div>
        </motion.div>
      </article>

      <Footer />
    </div>
  );
}
