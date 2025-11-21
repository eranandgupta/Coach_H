'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Image as ImageIcon } from 'lucide-react';
import Button from './Button';

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateBlogModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBlogModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    videoUrl: '',
    published: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create a blog post');
        return;
      }

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          coverImage: '',
          videoUrl: '',
          published: true,
        });
        onSuccess?.();
        onClose();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create blog post');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-brand-navy-light border border-brand-navy-light/50 rounded-2xl w-full max-w-4xl my-8 shadow-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-brand-navy-light/50 flex-shrink-0">
                  <h2 className="text-2xl font-bold text-white">Create Blog Post</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
                    placeholder="Enter blog post title"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt (Short Description)
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none"
                    placeholder="Brief description of the post (optional)"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 bg-brand-navy border border-brand-navy-light/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
                      placeholder="https://example.com/image.jpg"
                    />
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                {/* YouTube Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Paste a YouTube video link to embed it in your blog post
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content (HTML supported) *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={12}
                    className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none font-mono text-sm"
                    placeholder="<h2>Your heading</h2><p>Your content here...</p>"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    You can use HTML tags for formatting (h2, h3, p, strong, em, ul, li, etc.)
                  </p>
                </div>

                {/* Published Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        published: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 bg-brand-navy border border-brand-navy-light/50 rounded text-brand-blue focus:ring-2 focus:ring-brand-blue"
                  />
                  <label htmlFor="published" className="text-gray-300">
                    Publish immediately
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Post</span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
