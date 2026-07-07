'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, Maximize2, Loader2, Clock, Dumbbell, Search, TrendingUp } from 'lucide-react';
import { useRef, useCallback } from 'react';
import ProtectedContent from '@/components/ProtectedContent';

interface Video {
  id: string;
  name: string;
  title: string;
  url: string;
  thumbnail: string;
}

interface VideoCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  videoCount: number;
  channelUrl?: string;
  requiredPlans?: string[];
  subCategories?: Array<{ id: string; folderName: string; videoCount: number }>;
}

interface VideoLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userPlan?: string;
  userRole?: string;
}

// Category icons from UXWing (free, no attribution required)
const categoryIcons: Record<string, string> = {
  chest: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/chest-male-icon.svg',
  back: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/male-body-back-icon.svg',
  shoulders: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/bodybuilding-muscles-icon.svg',
  biceps: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/arm-muscles-icon.svg',
  triceps: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/strength-icon.svg',
  legs: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/leg-icon.svg',
  abs: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/man-abs-six-pack-icon.svg',
  stretching: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/yoga-exercise-icon.svg',
  warmup: 'https://uxwing.com/wp-content/themes/uxwing/download/education-school/training-icon.svg',
  cardio: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/running-icon.svg',
  homeWorkout: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E",
  rehabilitation: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E",
  // Home Workout sub-categories (reuse existing icons)
  hw_warmup: 'https://uxwing.com/wp-content/themes/uxwing/download/education-school/training-icon.svg',
  hw_chest: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/chest-male-icon.svg',
  hw_back: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/male-body-back-icon.svg',
  hw_shoulders: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/bodybuilding-muscles-icon.svg',
  hw_legs: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/leg-icon.svg',
  hw_arms: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/arm-muscles-icon.svg',
  hw_core: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/man-abs-six-pack-icon.svg',
  hw_cardio: 'https://uxwing.com/wp-content/themes/uxwing/download/fitness-gym-yoga-spa/running-icon.svg',
  // Rehabilitation sub-categories
  rehab_spine: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4'/%3E%3C/svg%3E",
  rehab_shoulder: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/chest-male-icon.svg',
  rehab_knee: 'https://uxwing.com/wp-content/themes/uxwing/download/health-sickness-organs/leg-icon.svg',
  rehab_ankle: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M8 12h8M12 8v8'/%3E%3C/svg%3E",
};

// Video categories configuration
const categoryConfig: Record<string, { name: string; description: string; color: string }> = {
  chest: {
    name: 'Chest',
    description: 'Chest workout exercises',
    color: 'from-red-500 to-orange-500',
  },
  back: {
    name: 'Back',
    description: 'Back workout exercises',
    color: 'from-blue-500 to-cyan-500',
  },
  shoulders: {
    name: 'Shoulders',
    description: 'Shoulder workout exercises',
    color: 'from-purple-500 to-pink-500',
  },
  biceps: {
    name: 'Biceps',
    description: 'Biceps exercises',
    color: 'from-green-500 to-emerald-500',
  },
  triceps: {
    name: 'Triceps',
    description: 'Triceps exercises',
    color: 'from-teal-500 to-cyan-500',
  },
  legs: {
    name: 'Legs',
    description: 'Leg workout exercises',
    color: 'from-yellow-500 to-orange-500',
  },
  abs: {
    name: 'Abs & Core',
    description: 'Core strengthening exercises',
    color: 'from-pink-500 to-rose-500',
  },
  stretching: {
    name: 'Stretching',
    description: 'Flexibility & recovery',
    color: 'from-indigo-500 to-purple-500',
  },
  warmup: {
    name: 'Warm Up',
    description: 'Pre-workout preparation',
    color: 'from-orange-500 to-red-500',
  },
  cardio: {
    name: 'Cardio',
    description: 'Heart-pumping exercises',
    color: 'from-rose-500 to-red-600',
  },
  homeWorkout: {
    name: 'Home Workout',
    description: 'No equipment needed',
    color: 'from-emerald-500 to-green-600',
  },
  // Home Workout sub-categories
  hw_warmup: { name: 'Warm Up', description: 'Pre-workout warm up', color: 'from-orange-500 to-red-500' },
  hw_chest: { name: 'Chest', description: 'Push ups & chest exercises', color: 'from-red-500 to-orange-500' },
  hw_back: { name: 'Back', description: 'Back exercises', color: 'from-blue-500 to-cyan-500' },
  hw_shoulders: { name: 'Shoulders', description: 'Shoulder exercises', color: 'from-purple-500 to-pink-500' },
  hw_legs: { name: 'Legs', description: 'Leg exercises', color: 'from-yellow-500 to-orange-500' },
  hw_arms: { name: 'Arms', description: 'Biceps & triceps exercises', color: 'from-teal-500 to-cyan-500' },
  hw_core: { name: 'Core', description: 'Core strengthening', color: 'from-pink-500 to-rose-500' },
  hw_cardio: { name: 'Cardio', description: 'Heart-pumping exercises', color: 'from-rose-500 to-red-600' },
  // Rehabilitation sub-categories
  rehab_spine: { name: 'Spine & Core', description: 'Spinal mobility & core rehab', color: 'from-cyan-500 to-blue-500' },
  rehab_shoulder: { name: 'Shoulder & Elbow', description: 'Shoulder & elbow rehabilitation', color: 'from-blue-500 to-indigo-500' },
  rehab_knee: { name: 'Knee & Hip', description: 'Knee & hip rehabilitation', color: 'from-teal-500 to-cyan-600' },
  rehab_ankle: { name: 'Ankle & Foot', description: 'Ankle & foot rehabilitation', color: 'from-emerald-500 to-teal-500' },
  rehabilitation: {
    name: 'Rehabilitation',
    description: 'Recovery & healing',
    color: 'from-cyan-500 to-blue-600',
  },
};

// All videos for search functionality
interface AllVideo extends Video {
  categoryId: string;
  categoryName: string;
}

export default function VideoLibrary({ isOpen, onClose, userEmail, userPlan, userRole }: VideoLibraryProps) {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<VideoCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AllVideo[]>([]);
  const [allVideos, setAllVideos] = useState<AllVideo[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories on mount (skip if already loaded)
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    } else if (isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  // Disable right-click on the entire modal when open
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isOpen) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [isOpen]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        const categoriesWithConfig = data.categories
          .filter((cat: any) => {
            if (userRole === 'admin' || userRole === 'coach' || userRole === 'trainer') return true;
            // Rehab plan clients only see the rehabilitation section
            if (userPlan === 'Rehabilitation Plan') return cat.id === 'rehabilitation';
            // Home Workout plan clients only see the home workout section
            if (userPlan === 'Home Workout' || userPlan === 'Home Workout Plan') return cat.id === 'homeWorkout';
            // Show unrestricted categories to all other users
            if (!cat.requiredPlans || cat.requiredPlans.length === 0) return true;
            // Show plan-gated categories if user has the matching plan
            return userPlan && cat.requiredPlans.includes(userPlan);
          })
          .map((cat: any) => ({
            ...cat,
            ...categoryConfig[cat.id],
          }));
        setCategories(categoriesWithConfig);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async (categoryId: string) => {
    setIsLoadingVideos(true);
    try {
      const response = await fetch(`/api/videos?category=${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Fetch all videos for search
  const fetchAllVideos = async () => {
    try {
      const allVids: AllVideo[] = [];
      const categoryIds = Object.keys(categoryConfig).filter(id => !id.startsWith('hw_') && !id.startsWith('rehab_'));

      for (const catId of categoryIds) {
        // Skip channel-only categories (no individual videos to index)
        if (categoryConfig[catId] && !categories.find(c => c.id === catId)?.channelUrl) {
          const response = await fetch(`/api/videos?category=${catId}`);
          if (response.ok) {
            const data = await response.json();
            const videosWithCategory = data.videos.map((v: Video) => ({
              ...v,
              categoryId: catId,
              categoryName: categoryConfig[catId]?.name || catId,
            }));
            allVids.push(...videosWithCategory);
          }
        }
      }
      setAllVideos(allVids);
    } catch (error) {
      console.error('Error fetching all videos:', error);
    }
  };

  // Load all videos when modal opens
  useEffect(() => {
    if (isOpen && allVideos.length === 0) {
      fetchAllVideos();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('videoLibraryRecentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Search function
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = allVideos.filter(video =>
      video.title.toLowerCase().includes(lowerQuery) ||
      video.categoryName.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 suggestions

    setSearchResults(results);
  }, [allVideos]);

  // Handle search result click
  const handleSearchResultClick = (video: AllVideo) => {
    // Save to recent searches
    const newRecent = [video.title, ...recentSearches.filter(s => s !== video.title)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('videoLibraryRecentSearches', JSON.stringify(newRecent));

    // Close search first, then set video after a tick to avoid Safari re-render race
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);

    requestAnimationFrame(() => {
      setSelectedVideo(video);
      setIsIframeLoading(true);

      // Set category and fetch videos in background (for playlist sidebar)
      const category = categories.find(c => c.id === video.categoryId);
      if (category) {
        setSelectedCategory(category);
        fetchVideos(video.categoryId);
      }
    });
  };

  // Handle recent search click
  const handleRecentSearchClick = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const handleCategorySelect = async (category: VideoCategory) => {
    setSelectedCategory(category);
    if (category.subCategories && category.subCategories.length > 0) {
      return; // show sub-categories grid
    }
    await fetchVideos(category.id);
  };

  const handleSubCategorySelect = async (subCat: { id: string; folderName: string; videoCount: number }) => {
    const subCategory: VideoCategory = {
      id: subCat.id,
      name: categoryConfig[subCat.id]?.name || subCat.folderName,
      icon: categoryIcons[subCat.id] || '',
      description: categoryConfig[subCat.id]?.description || '',
      color: categoryConfig[subCat.id]?.color || 'from-emerald-500 to-green-600',
      videoCount: subCat.videoCount,
    };
    setSelectedSubCategory(subCategory);
    await fetchVideos(subCat.id);
  };

  const handleBack = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    } else if (selectedSubCategory) {
      setSelectedSubCategory(null);
      setVideos([]);
    } else {
      setSelectedCategory(null);
      setVideos([]);
    }
    setIsFullscreen(false);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedVideo(null);
    setVideos([]);
    setIsFullscreen(false);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    onClose();
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsIframeLoading(true);
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
            className="fixed inset-0 bg-black/90 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-50 bg-[#0a0a0f] border border-white/5 shadow-2xl overflow-hidden ${
              isFullscreen
                ? 'inset-0 rounded-none'
                : 'inset-2 md:inset-6 lg:inset-10 rounded-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0a0a0f]/95 border-b border-white/5 px-4 py-3 md:px-6 md:py-4 relative z-20">
              <div className="flex items-center justify-between gap-3">
                {/* Left - Back & Title */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {(selectedCategory || selectedVideo) && (
                    <button
                      onClick={handleBack}
                      className="p-2 hover:bg-white/5 rounded-xl transition-all duration-200 border border-white/5"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex p-2.5 bg-gradient-to-br from-brand-blue/20 to-blue-600/20 rounded-xl border border-brand-blue/20">
                      <Dumbbell className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div className="hidden md:block">
                      <h2 className="text-lg font-bold text-white tracking-tight">
                        {selectedVideo
                          ? selectedVideo.title
                          : selectedSubCategory
                            ? selectedSubCategory.name
                            : selectedCategory
                              ? selectedCategory.name
                              : 'Exercise Library'}
                      </h2>
                      <p className="text-gray-500 text-xs">
                        {selectedVideo
                          ? (selectedSubCategory?.name || selectedCategory?.name)
                          : selectedSubCategory
                            ? `${videos.length} exercises`
                            : selectedCategory?.subCategories
                              ? `${selectedCategory.subCategories.length} folders`
                              : selectedCategory
                                ? `${selectedCategory.videoCount} exercises`
                                : 'Video guides'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center - Search Bar */}
                <div className="flex-1 max-w-xl relative z-50">
                  <div className={`relative transition-all duration-200 ${isSearchFocused ? 'transform scale-[1.02]' : ''}`}>
                    <div className={`flex items-center gap-2 bg-white/5 border rounded-xl px-3 py-2 md:px-4 md:py-2.5 transition-all duration-200 ${
                      isSearchFocused
                        ? 'border-brand-blue/50 bg-white/10 shadow-lg shadow-brand-blue/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <Search className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isSearchFocused ? 'text-brand-blue' : 'text-gray-500'}`} />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none min-w-0"
                      />
                      {searchQuery && (
                        <button
                          onClick={clearSearch}
                          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>

                    {/* Search Suggestions Dropdown */}
                    <AnimatePresence>
                      {isSearchFocused && (searchResults.length > 0 || (searchQuery === '' && recentSearches.length > 0)) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100]"
                        >
                          {/* Recent Searches - shown when no query */}
                          {searchQuery === '' && recentSearches.length > 0 && (
                            <div className="p-2">
                              <p className="text-gray-500 text-xs font-medium px-3 py-2 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Recent Searches
                              </p>
                              {recentSearches.map((term, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleRecentSearchClick(term)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left"
                                >
                                  <TrendingUp className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-300 text-sm truncate">{term}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Search Results */}
                          {searchResults.length > 0 && (
                            <div className="p-2 max-h-80 overflow-y-auto">
                              <p className="text-gray-500 text-xs font-medium px-3 py-2">
                                {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
                              </p>
                              {searchResults.map((video) => (
                                <button
                                  key={video.id}
                                  onClick={() => handleSearchResultClick(video)}
                                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                >
                                  {/* Thumbnail */}
                                  <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${categoryConfig[video.categoryId]?.color || 'from-gray-700 to-gray-800'} flex items-center justify-center flex-shrink-0`}>
                                    <Play className="w-3 h-3 text-white/80" fill="white" />
                                  </div>
                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate group-hover:text-brand-blue transition-colors">
                                      {video.title}
                                    </p>
                                    <p className="text-gray-500 text-xs flex items-center gap-1.5">
                                      <img
                                        src={categoryIcons[video.categoryId]}
                                        alt={`${video.categoryName} category icon`}
                                        className="w-3 h-3 object-contain invert opacity-50"
                                      />
                                      {video.categoryName}
                                    </p>
                                  </div>
                                  {/* Arrow */}
                                  <ChevronLeft className="w-4 h-4 text-gray-600 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ))}
                            </div>
                          )}

                          {/* No Results */}
                          {searchQuery !== '' && searchResults.length === 0 && (
                            <div className="p-6 text-center">
                              <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                              <p className="text-gray-400 text-sm">No exercises found</p>
                              <p className="text-gray-600 text-xs mt-1">Try a different search term</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {selectedVideo && (
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-2 hover:bg-white/5 rounded-xl transition-all duration-200 border border-white/5"
                      title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      <Maximize2 className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/5 rounded-xl transition-all duration-200 border border-white/5"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="flex-1 overflow-y-auto p-4 md:p-8 h-[calc(100%-80px)] select-none bg-gradient-to-b from-[#0a0a0f] to-[#0d0d14] relative z-10"
              onContextMenu={(e) => e.preventDefault()}
            >
              <AnimatePresence mode="popLayout">
                {/* Loading State */}
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
                      <p className="text-gray-500 text-sm">Loading exercises...</p>
                    </div>
                  </motion.div>
                ) : selectedVideo ? (
                  /* Video Player View - YouTube-like Layout */
                  <motion.div
                    key="video-player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="h-full overflow-y-auto"
                  >
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
                      {/* Left Side - Main Video Player */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Video Container - Full width on mobile */}
                        <ProtectedContent userEmail={userEmail} className="-mx-4 md:mx-0">
                        <div
                          className="relative bg-black rounded-lg lg:rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          {isIframeLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                              <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
                            </div>
                          )}
                          <div className="aspect-video w-full">
                            <iframe
                              key={selectedVideo.id}
                              src={`${selectedVideo.url}?autoplay=1`}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="autoplay; fullscreen; encrypted-media"
                              allowFullScreen
                              sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                              title={selectedVideo.title}
                              onLoad={() => setIsIframeLoading(false)}
                            />
                          </div>
                        </div>
                        </ProtectedContent>

                        {/* Video Info - Mobile optimized */}
                        <div className="mt-3 lg:mt-4 px-1 lg:px-0">
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                            {selectedVideo.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20">
                              <img
                                src={categoryIcons[(selectedSubCategory || selectedCategory)?.id || '']}
                                alt={`${(selectedSubCategory || selectedCategory)?.name} category icon`}
                                className="w-3.5 h-3.5 object-contain invert"
                              />
                              <span className="text-brand-blue text-xs font-medium">{(selectedSubCategory || selectedCategory)?.name}</span>
                            </div>
                            <span className="text-gray-500 text-xs">
                              {videos.findIndex(v => v.id === selectedVideo.id) + 1} of {videos.length}
                            </span>
                            <span className="hidden md:inline text-gray-600 text-xs">•</span>
                            <p className="hidden md:block text-gray-500 text-xs">
                              Focus on proper form
                            </p>
                          </div>
                        </div>

                        {/* Mobile: Horizontal Scroll Playlist */}
                        <div className="lg:hidden mt-4">
                          <div className="flex items-center justify-between mb-3 px-1">
                            <h4 className="text-white font-semibold text-sm">Up Next</h4>
                            <span className="text-gray-500 text-xs">{videos.length} videos</span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                            {videos.map((video, index) => (
                              <button
                                key={video.id}
                                onClick={() => handleVideoClick(video)}
                                className={`flex-shrink-0 w-36 group ${
                                  selectedVideo.id === video.id ? 'opacity-60' : ''
                                }`}
                              >
                                {/* Thumbnail */}
                                <div className="relative">
                                  <div className={`aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${categoryConfig[(selectedSubCategory || selectedCategory)?.id || '']?.color || 'from-gray-700 to-gray-800'}`}>
                                    {video.thumbnail && (
                                      <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                      />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      {selectedVideo.id === video.id ? (
                                        <div className="w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
                                          <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
                                        </div>
                                      ) : (
                                        <Play className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[9px] text-gray-300 font-medium">
                                    #{index + 1}
                                  </div>
                                  {selectedVideo.id === video.id && (
                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-brand-blue rounded text-[9px] text-white font-medium">
                                      Playing
                                    </div>
                                  )}
                                </div>
                                <h5 className={`mt-1.5 text-xs font-medium line-clamp-2 text-left ${
                                  selectedVideo.id === video.id ? 'text-brand-blue' : 'text-white'
                                }`}>
                                  {video.title}
                                </h5>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Video Playlist (Desktop Only) */}
                      <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden sticky top-0">
                          {/* Playlist Header */}
                          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-white font-semibold">{(selectedSubCategory || selectedCategory)?.name}</h4>
                                <p className="text-gray-500 text-xs mt-0.5">{videos.length} exercises</p>
                              </div>
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue/20 to-blue-600/20 flex items-center justify-center">
                                <img
                                  src={categoryIcons[(selectedSubCategory || selectedCategory)?.id || '']}
                                  alt={`${(selectedSubCategory || selectedCategory)?.name} category icon`}
                                  className="w-4 h-4 object-contain invert"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Video List */}
                          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                            {videos.map((video, index) => (
                              <button
                                key={video.id}
                                onClick={() => handleVideoClick(video)}
                                className={`w-full flex gap-3 p-3 hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0 ${
                                  selectedVideo.id === video.id ? 'bg-brand-blue/10 border-l-2 border-l-brand-blue' : ''
                                }`}
                              >
                                {/* Thumbnail */}
                                <div className="relative w-32 flex-shrink-0">
                                  <div className={`aspect-video rounded-lg overflow-hidden bg-gradient-to-br ${categoryConfig[(selectedSubCategory || selectedCategory)?.id || '']?.color || 'from-gray-700 to-gray-800'}`}>
                                    {video.thumbnail && (
                                      <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                      />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      {selectedVideo.id === video.id ? (
                                        <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                                          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                        </div>
                                      ) : (
                                        <Play className="w-6 h-6 text-white/70" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-gray-300 font-medium">
                                    #{index + 1}
                                  </div>
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 text-left min-w-0">
                                  <h5 className={`text-sm font-medium line-clamp-2 ${
                                    selectedVideo.id === video.id ? 'text-brand-blue' : 'text-white'
                                  }`}>
                                    {video.title}
                                  </h5>
                                  <p className="text-gray-500 text-xs mt-1">
                                    {selectedCategory?.name}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : !selectedCategory ? (
                  /* Category Grid */
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                  >
                    {categories.map((category, index) => (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleCategorySelect(category)}
                        disabled={category.videoCount === 0 && !category.channelUrl}
                        className={`group relative p-5 md:p-6 rounded-2xl bg-gradient-to-br ${categoryConfig[category.id]?.color || 'from-gray-500 to-gray-600'} overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${
                          category.videoCount === 0 && !category.channelUrl ? 'opacity-40 cursor-not-allowed grayscale' : ''
                        }`}
                      >
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                        </div>

                        <div className="relative z-10 text-left">
                          {/* Category Icon */}
                          <div className="mb-3 drop-shadow-lg">
                            <img
                              src={categoryIcons[category.id]}
                              alt={category.name}
                              className="w-10 h-10 md:w-12 md:h-12 object-contain invert"
                            />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow">
                            {category.name}
                          </h3>
                          <p className="text-white/70 text-sm font-medium">
                            {category.videoCount > 0
                              ? `${category.videoCount} exercise${category.videoCount > 1 ? 's' : ''}`
                              : 'Coming soon'}
                          </p>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute bottom-5 right-5 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : selectedCategory?.subCategories && !selectedSubCategory ? (
                  /* Sub-Categories Grid */
                  <motion.div
                    key="sub-categories"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
                  >
                    {selectedCategory.subCategories.map((subCat, index) => (
                      <motion.button
                        key={subCat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSubCategorySelect(subCat)}
                        className={`group relative p-5 md:p-6 rounded-2xl bg-gradient-to-br ${categoryConfig[subCat.id]?.color || 'from-gray-500 to-gray-600'} overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}
                      >
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                        </div>
                        <div className="relative z-10 text-left">
                          <div className="mb-3 drop-shadow-lg">
                            <img
                              src={categoryIcons[subCat.id] || categoryIcons['homeWorkout']}
                              alt={subCat.folderName}
                              className="w-10 h-10 md:w-12 md:h-12 object-contain invert"
                            />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-white mb-1 drop-shadow">
                            {categoryConfig[subCat.id]?.name || subCat.folderName}
                          </h3>
                          <p className="text-white/70 text-sm font-medium">
                            {subCat.videoCount} exercise{subCat.videoCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="absolute bottom-5 right-5 w-9 h-9 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  /* Video List for Selected Category */
                  <motion.div
                    key="videos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    {isLoadingVideos ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                          <Loader2 className="w-10 h-10 text-brand-blue animate-spin" />
                          <p className="text-gray-500 text-sm">Loading videos...</p>
                        </div>
                      </div>
                    ) : videos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                        {videos.map((video, index) => (
                          <motion.button
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleVideoClick(video)}
                            className="group relative bg-[#12121a] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-blue/5 border border-white/5 hover:border-brand-blue/30"
                          >
                            {/* Thumbnail with gradient overlay */}
                            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                              {/* Actual video thumbnail */}
                              {video.thumbnail && (
                                <img
                                  src={video.thumbnail}
                                  alt={video.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                              )}

                              {/* Gradient fallback (shown if no thumbnail or load error) */}
                              {!video.thumbnail && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig[(selectedSubCategory || selectedCategory)?.id || '']?.color || 'from-gray-700 to-gray-800'} opacity-30`} />
                              )}

                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                                <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                  <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                                </div>
                              </div>

                              {/* Duration badge */}
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-md flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-300" />
                                <span className="text-xs text-gray-300 font-medium">Demo</span>
                              </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                              <h3 className="text-white font-semibold text-left text-sm md:text-base line-clamp-2 group-hover:text-brand-blue transition-colors">
                                {video.title}
                              </h3>
                              <p className="text-gray-500 text-xs mt-1.5 text-left">
                                Tap to watch demonstration
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : selectedCategory.channelUrl ? (
                      /* Channel View - Embed ScreenPal channel */
                      <ProtectedContent userEmail={userEmail} className="h-full">
                        <div className="h-full flex flex-col" style={{ minHeight: '60vh' }}>
                          <div className="relative flex-1 bg-black rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
                            <iframe
                              src={selectedCategory.channelUrl}
                              className="w-full h-full"
                              style={{ minHeight: '60vh' }}
                              frameBorder="0"
                              allow="autoplay; fullscreen; encrypted-media"
                              allowFullScreen
                              sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
                              title={`${selectedCategory.name} Channel`}
                            />
                          </div>
                        </div>
                      </ProtectedContent>
                    ) : (
                      /* No Videos - Show placeholder */
                      <div className="h-full flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                          <img
                            src={categoryIcons[selectedCategory.id]}
                            alt={selectedCategory.name}
                            className="w-12 h-12 object-contain invert opacity-50"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {selectedCategory.name} Videos
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md">
                          Exercise demonstrations for this category are being added. Check back soon!
                        </p>
                        <button
                          onClick={handleBack}
                          className="px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 shadow-lg shadow-brand-blue/20"
                        >
                          Back to Categories
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
