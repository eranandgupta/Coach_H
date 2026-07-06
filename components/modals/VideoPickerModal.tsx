'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, Loader2, Search, Check } from 'lucide-react';

interface ScreenPalVideo {
  id: string;
  title: string;
  embedUrl: string;
  thumbnail?: string;
}

interface VideoCategory {
  id: string;
  name: string;
  videoCount: number;
  subCategories?: Array<{ id: string; folderName: string; videoCount: number }>;
}

interface Video {
  id: string;
  name: string;
  title: string;
  url: string;
  thumbnail: string;
}

interface VideoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (videoUrl: string, videoTitle: string) => void;
  currentVideoUrl?: string;
  exerciseName?: string;
}

const categoryConfig: Record<string, { name: string; color: string }> = {
  chest: { name: 'Chest', color: 'from-red-500 to-orange-500' },
  back: { name: 'Back', color: 'from-blue-500 to-cyan-500' },
  shoulders: { name: 'Shoulders', color: 'from-purple-500 to-pink-500' },
  biceps: { name: 'Biceps', color: 'from-green-500 to-emerald-500' },
  triceps: { name: 'Triceps', color: 'from-teal-500 to-cyan-500' },
  legs: { name: 'Legs', color: 'from-yellow-500 to-orange-500' },
  abs: { name: 'Abs & Core', color: 'from-pink-500 to-rose-500' },
  stretching: { name: 'Stretching', color: 'from-indigo-500 to-purple-500' },
  warmup: { name: 'Warm Up', color: 'from-orange-500 to-red-500' },
  cardio: { name: 'Cardio', color: 'from-rose-500 to-red-600' },
  homeWorkout: { name: 'Home Workout', color: 'from-emerald-500 to-green-600' },
  rehabilitation: { name: 'Rehabilitation', color: 'from-cyan-500 to-blue-600' },
  hw_warmup: { name: 'Warm Up', color: 'from-orange-500 to-red-500' },
  hw_chest: { name: 'Chest', color: 'from-red-500 to-orange-500' },
  hw_back: { name: 'Back', color: 'from-blue-500 to-cyan-500' },
  hw_shoulders: { name: 'Shoulders', color: 'from-purple-500 to-pink-500' },
  hw_legs: { name: 'Legs', color: 'from-yellow-500 to-orange-500' },
  hw_arms: { name: 'Arms', color: 'from-teal-500 to-cyan-500' },
  hw_core: { name: 'Core', color: 'from-pink-500 to-rose-500' },
  hw_cardio: { name: 'Cardio', color: 'from-rose-500 to-red-600' },
  rehab_spine: { name: 'Spine & Core', color: 'from-cyan-500 to-blue-500' },
  rehab_shoulder: { name: 'Shoulder & Elbow', color: 'from-blue-500 to-indigo-500' },
  rehab_knee: { name: 'Knee & Hip', color: 'from-teal-500 to-cyan-600' },
  rehab_ankle: { name: 'Ankle & Foot', color: 'from-emerald-500 to-teal-500' },
};

export default function VideoPickerModal({ isOpen, onClose, onSelect, currentVideoUrl, exerciseName }: VideoPickerModalProps) {
  const [categories, setCategories] = useState<VideoCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allVideos, setAllVideos] = useState<(Video & { categoryId: string; categoryName: string })[]>([]);
  const [searchResults, setSearchResults] = useState<(Video & { categoryId: string; categoryName: string })[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    setSearchResults(
      allVideos.filter(v =>
        v.title.toLowerCase().includes(lowerQuery) ||
        v.categoryName.toLowerCase().includes(lowerQuery) ||
        v.url.toLowerCase().includes(lowerQuery)
      ).slice(0, 20)
    );
  }, [allVideos]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  // Auto-search by exercise name when modal opens and videos are loaded
  useEffect(() => {
    if (isOpen && exerciseName && exerciseName.trim().length > 0 && allVideos.length > 0) {
      handleSearch(exerciseName.trim());
    }
  }, [isOpen, exerciseName, allVideos, handleSearch]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/videos');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories.map((cat: any) => ({
          ...cat,
          name: categoryConfig[cat.id]?.name || cat.name,
        })));
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
  useEffect(() => {
    if (isOpen && allVideos.length === 0) {
      const fetchAll = async () => {
        const allVids: (Video & { categoryId: string; categoryName: string })[] = [];
        const categoryIds = Object.keys(categoryConfig).filter(id => !id.startsWith('hw_') && !id.startsWith('rehab_'));
        for (const catId of categoryIds) {
          try {
            const response = await fetch(`/api/videos?category=${catId}`);
            if (response.ok) {
              const data = await response.json();
              allVids.push(...data.videos.map((v: Video) => ({
                ...v,
                categoryId: catId,
                categoryName: categoryConfig[catId]?.name || catId,
              })));
            }
          } catch {}
        }
        setAllVideos(allVids);
      };
      fetchAll();
    }
  }, [isOpen]);

  const handleCategorySelect = async (category: VideoCategory) => {
    setSelectedCategory(category);
    if (category.subCategories && category.subCategories.length > 0) return;
    await fetchVideos(category.id);
  };

  const handleSubCategorySelect = async (subCatId: string) => {
    setSelectedSubCategoryId(subCatId);
    await fetchVideos(subCatId);
  };

  const handleBack = () => {
    if (selectedSubCategoryId) {
      setSelectedSubCategoryId(null);
      setVideos([]);
    } else {
      setSelectedCategory(null);
      setVideos([]);
    }
  };

  const handleVideoSelect = (video: Video) => {
    onSelect(video.url, video.title);
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setSelectedSubCategoryId(null);
    setVideos([]);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  const isVideoSelected = (video: Video) => {
    return currentVideoUrl === video.url;
  };

  const currentTitle = selectedSubCategoryId
    ? categoryConfig[selectedSubCategoryId]?.name || ''
    : selectedCategory?.name || 'Select Exercise Video';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60]"
            onClick={handleClose}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  {(selectedCategory || searchQuery) && !searchQuery && (
                    <button
                      onClick={handleBack}
                      className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <h2 className="text-lg font-bold text-white">{currentTitle}</h2>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-sm mx-4">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search exercises..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} className="p-0.5 hover:bg-white/10 rounded">
                        <X className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                <button onClick={handleClose} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Search Results */}
                {searchQuery.trim().length > 0 ? (
                  <div>
                    {searchResults.length > 0 ? (
                      <>
                        <p className="text-gray-500 text-xs mb-4">{searchResults.length} result{searchResults.length > 1 ? 's' : ''}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {searchResults.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => handleVideoSelect(video)}
                              className={`group relative bg-white/5 border rounded-xl p-3 text-left transition-all hover:bg-white/10 ${
                                currentVideoUrl === video.url
                                  ? 'border-green-500/50 bg-green-500/10'
                                  : 'border-white/10 hover:border-brand-blue/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryConfig[video.categoryId]?.color || 'from-gray-700 to-gray-800'} flex items-center justify-center flex-shrink-0`}>
                                  {currentVideoUrl === video.url ? (
                                    <Check className="w-5 h-5 text-white" />
                                  ) : (
                                    <Play className="w-4 h-4 text-white/80 ml-0.5" fill="white" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white text-sm font-medium truncate">{video.title}</p>
                                  <p className="text-gray-500 text-xs">{video.categoryName}</p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No exercises found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )}
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                  </div>
                ) : !selectedCategory ? (
                  /* Category Grid */
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        disabled={category.videoCount === 0 && !category.subCategories?.length}
                        className={`group relative p-4 rounded-xl bg-gradient-to-br ${categoryConfig[category.id]?.color || 'from-gray-500 to-gray-600'} overflow-hidden transition-all hover:scale-[1.03] hover:shadow-lg text-left ${
                          category.videoCount === 0 && !category.subCategories?.length ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        <h3 className="text-base font-bold text-white mb-0.5">{categoryConfig[category.id]?.name || category.name}</h3>
                        <p className="text-white/70 text-xs">
                          {category.videoCount > 0 ? `${category.videoCount} exercises` : category.subCategories?.length ? `${category.subCategories.length} folders` : 'Coming soon'}
                        </p>
                      </button>
                    ))}
                  </div>
                ) : selectedCategory.subCategories && !selectedSubCategoryId ? (
                  /* Sub-Category Grid */
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedCategory.subCategories.map((subCat) => (
                      <button
                        key={subCat.id}
                        onClick={() => handleSubCategorySelect(subCat.id)}
                        className={`group relative p-4 rounded-xl bg-gradient-to-br ${categoryConfig[subCat.id]?.color || 'from-gray-500 to-gray-600'} overflow-hidden transition-all hover:scale-[1.03] hover:shadow-lg text-left`}
                      >
                        <h3 className="text-base font-bold text-white mb-0.5">{categoryConfig[subCat.id]?.name || subCat.folderName}</h3>
                        <p className="text-white/70 text-xs">{subCat.videoCount} exercises</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Video List */
                  <div>
                    {isLoadingVideos ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                      </div>
                    ) : videos.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {videos.map((video) => (
                          <button
                            key={video.id}
                            onClick={() => handleVideoSelect(video)}
                            className={`group relative bg-white/5 border rounded-xl p-3 text-left transition-all hover:bg-white/10 ${
                              isVideoSelected(video)
                                ? 'border-green-500/50 bg-green-500/10'
                                : 'border-white/10 hover:border-brand-blue/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryConfig[selectedSubCategoryId || selectedCategory?.id || '']?.color || 'from-gray-700 to-gray-800'} flex items-center justify-center flex-shrink-0`}>
                                {isVideoSelected(video) ? (
                                  <Check className="w-5 h-5 text-white" />
                                ) : (
                                  <Play className="w-4 h-4 text-white/80 ml-0.5" fill="white" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{video.title}</p>
                                {isVideoSelected(video) && (
                                  <p className="text-green-400 text-xs">Currently selected</p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400">No videos in this category</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
