'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, ArrowLeft, Upload, X, Image } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    phone: '',
    rating: 5,
    review: '',
    transformation: '',
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [beforePhoto, setBeforePhoto] = useState<File | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<File | null>(null);

  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [beforePhotoPreview, setBeforePhotoPreview] = useState<string>('');
  const [afterPhotoPreview, setAfterPhotoPreview] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      if (type === 'profile') {
        setProfilePhoto(file);
        setProfilePhotoPreview(previewUrl);
      } else if (type === 'before') {
        setBeforePhoto(file);
        setBeforePhotoPreview(previewUrl);
      } else if (type === 'after') {
        setAfterPhoto(file);
        setAfterPhotoPreview(previewUrl);
      }
    }
  };

  const removeFile = (type: 'profile' | 'before' | 'after') => {
    if (type === 'profile') {
      setProfilePhoto(null);
      setProfilePhotoPreview('');
    } else if (type === 'before') {
      setBeforePhoto(null);
      setBeforePhotoPreview('');
    } else if (type === 'after') {
      setAfterPhoto(null);
      setAfterPhotoPreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('rating', formData.rating.toString());
      formDataToSend.append('review', formData.review);
      formDataToSend.append('transformation', formData.transformation);

      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }
      if (beforePhoto) {
        formDataToSend.append('beforePhoto', beforePhoto);
      }
      if (afterPhoto) {
        formDataToSend.append('afterPhoto', afterPhoto);
      }

      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          location: '',
          phone: '',
          rating: 5,
          review: '',
          transformation: '',
        });
        setProfilePhoto(null);
        setBeforePhoto(null);
        setAfterPhoto(null);
        setProfilePhotoPreview('');
        setBeforePhotoPreview('');
        setAfterPhotoPreview('');
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      <Navbar />

      <section className="pt-24 md:pt-28 pb-20 px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-gold transition-colors mb-6"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </a>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 border border-brand-gold/30 rounded-full mb-4">
              <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
              <span className="text-brand-gold text-sm font-semibold">Share Your Story</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Client Feedback
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear about your transformation journey with Coach Himanshu!
              Your feedback helps us improve and inspires others to start their fitness journey.
            </p>
          </motion.div>

          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-500" size={24} />
                <h3 className="text-green-500 font-bold text-lg">
                  Thank You!
                </h3>
              </div>
              <p className="text-gray-300">
                Your feedback has been submitted successfully. It will be reviewed and published soon on our testimonials section.
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl"
            >
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {/* Feedback Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-brand-navy-light to-brand-navy-light/50 p-8 md:p-10 rounded-3xl border border-brand-navy-light/50"
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-white font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-white font-semibold mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="City, State/Country (e.g., Delhi, India)"
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-white font-semibold mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${
                          star <= formData.rating
                            ? 'text-brand-gold fill-brand-gold'
                            : 'text-gray-600'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  {formData.rating === 5 && 'Excellent!'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 1 && 'Needs Improvement'}
                </p>
              </div>

              {/* Review */}
              <div>
                <label htmlFor="review" className="block text-white font-semibold mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors resize-none"
                  placeholder="Share your experience with Coach Himanshu's coaching services..."
                />
              </div>

              {/* Transformation (Optional) */}
              <div>
                <label htmlFor="transformation" className="block text-white font-semibold mb-2">
                  Your Transformation (Optional)
                </label>
                <input
                  type="text"
                  id="transformation"
                  name="transformation"
                  value={formData.transformation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-brand-navy border border-brand-navy-light/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold/50 transition-colors"
                  placeholder="e.g., Lost 20kg in 6 months"
                />
              </div>

              {/* Profile Photo Upload */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Profile Photo (Optional)
                </label>
                <p className="text-gray-400 text-sm mb-3">Upload your selfie for your testimonial</p>

                {!profilePhotoPreview ? (
                  <label className="block w-full px-4 py-6 bg-brand-navy border-2 border-dashed border-brand-navy-light/50 rounded-xl hover:border-brand-gold/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="text-brand-gold" size={32} />
                      <span className="text-gray-300 text-sm">Click to upload profile photo</span>
                      <span className="text-gray-500 text-xs">PNG, JPG up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'profile')}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative w-40 h-40 mx-auto">
                    <img
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover rounded-xl border-2 border-brand-gold/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('profile')}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Transformation Photos Upload */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Transformation Photos (Optional)
                </label>
                <p className="text-gray-400 text-sm mb-3">Upload before & after photos of your transformation</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before Photo */}
                  <div>
                    <p className="text-gray-300 text-sm mb-2">Before Photo</p>
                    {!beforePhotoPreview ? (
                      <label className="block w-full px-4 py-6 bg-brand-navy border-2 border-dashed border-brand-navy-light/50 rounded-xl hover:border-brand-gold/50 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Image className="text-brand-gold" size={28} />
                          <span className="text-gray-300 text-xs">Before Photo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'before')}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img
                          src={beforePhotoPreview}
                          alt="Before preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-brand-gold/50"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('before')}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* After Photo */}
                  <div>
                    <p className="text-gray-300 text-sm mb-2">After Photo</p>
                    {!afterPhotoPreview ? (
                      <label className="block w-full px-4 py-6 bg-brand-navy border-2 border-dashed border-brand-navy-light/50 rounded-xl hover:border-brand-gold/50 transition-colors cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Image className="text-brand-gold" size={28} />
                          <span className="text-gray-300 text-xs">After Photo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'after')}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="relative">
                        <img
                          src={afterPhotoPreview}
                          alt="After preview"
                          className="w-full h-48 object-cover rounded-xl border-2 border-brand-gold/50"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('after')}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full gap-2 justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-gray-400 text-sm text-center mt-4">
                Your feedback will be reviewed before being published on the website.
              </p>
            </div>
          </motion.form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
