'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readTime: number | null;
  publishedAt: string | null;
}

// SEO internal link mappings - keywords to internal pages
const SEO_LINK_MAP: { keyword: RegExp; href: string; title: string }[] = [
  { keyword: /\bworkout plans?\b/i, href: '/#plans', title: 'View Workout Plans' },
  { keyword: /\bgym plans?\b/i, href: '/#plans', title: 'View Gym Plans' },
  { keyword: /\bhome workout\b/i, href: '/#plans', title: 'View Home Workout Plans' },
  { keyword: /\bpersonal training\b/i, href: '/#plans', title: 'Explore Personal Training' },
  { keyword: /\b1[:\-]1 training\b/i, href: '/#plans', title: 'Explore 1:1 Training' },
  { keyword: /\bCoach Himanshu\b/i, href: '/about', title: 'About Coach Himanshu' },
  { keyword: /\bfitness assessment\b/i, href: '/assessment', title: 'Take Fitness Assessment' },
  { keyword: /\bfitness journey\b/i, href: '/assessment', title: 'Start Your Fitness Journey' },
  { keyword: /\bcontact us\b/i, href: '/contact', title: 'Contact Us' },
  { keyword: /\bget in touch\b/i, href: '/contact', title: 'Get in Touch' },
  { keyword: /\bFit Bharat Mission\b/i, href: '/fit-bharat-mission', title: 'Fit Bharat Mission' },
  { keyword: /\bfitness blog\b/i, href: '/blog', title: 'Read More Fitness Articles' },
  { keyword: /\brehabilitation\b/i, href: '/#plans', title: 'View Rehabilitation Plans' },
  { keyword: /\brehab\b/i, href: '/#plans', title: 'View Rehabilitation Plans' },
  { keyword: /\bdiet guidance\b/i, href: '/#plans', title: 'Explore Diet Guidance Plans' },
  { keyword: /\bnutrition guidance\b/i, href: '/#plans', title: 'Explore Nutrition Plans' },
  { keyword: /\bfat loss\b/i, href: '/#plans', title: 'Explore Fat Loss Plans' },
  { keyword: /\bmuscle gain\b/i, href: '/#plans', title: 'Explore Muscle Gain Plans' },
  { keyword: /\btransformation\b/i, href: '/about', title: 'See Transformations' },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
      fetchRelatedPosts(params.slug as string);
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

  const fetchRelatedPosts = async (currentSlug: string) => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const allPosts: RelatedPost[] = await response.json();
        const filtered = allPosts
          .filter((p) => p.slug !== currentSlug)
          .slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
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

  // Convert plain text to HTML if needed
  const formatContent = (content: string) => {
    // Check if content already contains HTML tags
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);

    if (hasHtmlTags) {
      // Content is already HTML, return as is
      return content;
    }

    // Content is plain text - convert to HTML with proper formatting
    // Split by lines and process each line
    const lines = content.split('\n');
    const result: string[] = [];
    let currentListItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (currentListItems.length > 0) {
        result.push('<ul>' + currentListItems.map(item => '<li>' + item + '</li>').join('') + '</ul>');
        currentListItems = [];
      }
      inList = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Empty line - creates paragraph break
      if (!trimmed) {
        flushList();
        continue;
      }

      // Check if it's a list item (starts with -, *, •, or number followed by . or ))
      const listMatch = trimmed.match(/^([-*•]|\d+[.)]) /);
      if (listMatch) {
        if (!inList) {
          inList = true;
        }
        currentListItems.push(trimmed.replace(/^([-*•]|\d+[.)]) /, ''));
        continue;
      }

      // Not a list item - flush any pending list
      flushList();

      // Regular text line - wrap in paragraph
      result.push('<p>' + trimmed + '</p>');
    }

    // Flush any remaining list items
    flushList();

    return result.join('\n');
  };

  // Add SEO internal hyperlinks to blog content
  const addSeoLinks = (html: string): string => {
    const linkedHrefs = new Set<string>();

    // Process text content only (not inside HTML tags or existing links)
    let result = html;
    for (const { keyword, href, title } of SEO_LINK_MAP) {
      // Skip if we already linked to this destination
      if (linkedHrefs.has(href)) continue;

      // Only replace first occurrence, and only if not already inside an <a> tag
      const parts = result.split(/(<a\b[^>]*>.*?<\/a>|<[^>]+>)/gi);
      let replaced = false;

      for (let i = 0; i < parts.length; i++) {
        // Skip HTML tags and existing links
        if (parts[i].startsWith('<')) continue;
        if (replaced) break;

        const match = parts[i].match(keyword);
        if (match) {
          parts[i] = parts[i].replace(
            keyword,
            `<a href="${href}" title="${title}" class="text-brand-blue hover:text-brand-gold transition-colors">${match[0]}</a>`
          );
          linkedHrefs.add(href);
          replaced = true;
        }
      }

      result = parts.join('');
    }

    return result;
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
      <AnnouncementBar />
      <Navbar />

      <article className="pt-32 pb-12">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-3 md:px-6 mb-6 md:mb-8">
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
          className="max-w-4xl mx-auto px-3 md:px-6 mb-6 md:mb-12"
        >
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-400 mb-4 md:mb-6">
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
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-48 md:h-96 rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-12 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20">
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
          className="max-w-4xl mx-auto px-3 md:px-6"
        >
          <div className="bg-brand-navy-light border border-brand-navy-light/50 rounded-lg md:rounded-2xl p-3 md:p-8 lg:p-12">
            <div
              className="prose prose-invert prose-base md:prose-lg max-w-none break-words
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-xl prose-h2:md:text-2xl prose-h2:lg:text-3xl prose-h2:mt-8 prose-h2:md:mt-12 prose-h2:mb-4 prose-h2:md:mb-6
                prose-h3:text-lg prose-h3:md:text-xl prose-h3:lg:text-2xl prose-h3:mt-6 prose-h3:md:mt-8 prose-h3:mb-3 prose-h3:md:mb-4
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:md:mb-6 prose-p:text-sm prose-p:md:text-base
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:text-gray-300 prose-ul:my-4 prose-ul:md:my-6 prose-ul:text-sm prose-ul:md:text-base
                prose-li:my-1 prose-li:md:my-2
                prose-a:text-brand-blue prose-a:no-underline hover:prose-a:text-brand-gold
                [&>*]:break-words [&>*]:overflow-hidden
              "
              dangerouslySetInnerHTML={{ __html: addSeoLinks(formatContent(post.content)) }}
            />
          </div>
        </motion.div>

        {/* SEO Internal Links Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto px-3 md:px-6 mt-6 md:mt-12"
        >
          <div className="bg-brand-navy-light border border-brand-navy-light/50 rounded-lg md:rounded-2xl p-4 md:p-8">
            <h3 className="text-lg md:text-xl font-bold text-white mb-4">
              Explore More
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <Link href="/about" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>About Coach Himanshu</span>
              </Link>
              <Link href="/#plans" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>Workout Plans</span>
              </Link>
              <Link href="/assessment" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>Fitness Assessment</span>
              </Link>
              <Link href="/blog" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>All Blog Posts</span>
              </Link>
              <Link href="/fit-bharat-mission" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>Fit Bharat Mission</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm md:text-base">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto px-3 md:px-6 mt-6 md:mt-12"
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`}>
                  <div className="bg-brand-navy-light border border-brand-navy-light/50 rounded-lg md:rounded-xl overflow-hidden hover:border-brand-blue/50 transition-all duration-300 group">
                    {related.coverImage ? (
                      <div className="relative h-32 md:h-40 overflow-hidden">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-32 md:h-40 bg-gradient-to-br from-brand-blue/20 to-brand-gold/20" />
                    )}
                    <div className="p-3 md:p-4">
                      <h4 className="text-sm md:text-base font-semibold text-white group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                        {related.title}
                      </h4>
                      {related.excerpt && (
                        <p className="text-gray-400 text-xs md:text-sm line-clamp-2">
                          {related.excerpt}
                        </p>
                      )}
                      {related.readTime && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>{related.readTime} min read</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto px-3 md:px-6 mt-6 md:mt-12"
        >
          <div className="bg-gradient-to-r from-brand-blue/10 to-brand-gold/10 border border-brand-blue/30 rounded-xl md:rounded-2xl p-5 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              Ready to Start Your Fitness Journey?
            </h3>
            <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6">
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
