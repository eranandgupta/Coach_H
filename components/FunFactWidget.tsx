'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Share2, X, Download } from 'lucide-react';

export default function FunFactWidget() {
  const [fact, setFact] = useState<{ id: number; content: string; publishedAt: string } | null>(null);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchFact = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/fun-facts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.activeFact) {
          setFact(data.activeFact);
        }
      } catch (error) {
        console.error('Failed to fetch fun fact:', error);
      }
    };
    fetchFact();
  }, []);

  const generateShareImage = useCallback(async () => {
    if (!fact || !canvasRef.current) return;
    setGenerating(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background — dark navy gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0A0F1F');
    bgGrad.addColorStop(0.5, '#111B33');
    bgGrad.addColorStop(1, '#0A0F1F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow — top left
    const glow1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
    glow1.addColorStop(0, 'rgba(23, 95, 255, 0.08)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    // Subtle radial glow — bottom right
    const glow2 = ctx.createRadialGradient(880, 880, 0, 880, 880, 350);
    glow2.addColorStop(0, 'rgba(23, 95, 255, 0.06)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // Decorative border lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeRect(55, 55, W - 110, H - 110);

    // Corner accents
    const accentColor = 'rgba(23, 95, 255, 0.3)';
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(55, 85);
    ctx.lineTo(55, 55);
    ctx.lineTo(85, 55);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(W - 85, 55);
    ctx.lineTo(W - 55, 55);
    ctx.lineTo(W - 55, 85);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(55, H - 85);
    ctx.lineTo(55, H - 55);
    ctx.lineTo(85, H - 55);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(W - 85, H - 55);
    ctx.lineTo(W - 55, H - 55);
    ctx.lineTo(W - 55, H - 85);
    ctx.stroke();

    // Lightbulb icon area — glass circle
    const iconCx = W / 2;
    const iconCy = 240;
    const iconR = 62;
    const iconGrad = ctx.createRadialGradient(iconCx, iconCy, 0, iconCx, iconCy, iconR);
    iconGrad.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
    iconGrad.addColorStop(1, 'rgba(234, 179, 8, 0.03)');
    ctx.fillStyle = iconGrad;
    ctx.beginPath();
    ctx.arc(iconCx, iconCy, iconR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Lightbulb emoji
    ctx.font = '56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💡', iconCx, iconCy + 18);

    // "Did You Know?" label
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = 'rgba(234, 179, 8, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('D I D   Y O U   K N O W ?', W / 2, 360);

    // Decorative line under label
    const lineGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, 'rgba(23, 95, 255, 0.3)');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, 388);
    ctx.lineTo(W / 2 + 120, 388);
    ctx.stroke();

    // Fun fact text — wrapped
    ctx.font = '500 48px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.textAlign = 'center';

    const maxWidth = W - 160;
    const lineHeight = 64;
    const words = fact.content.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Vertically center the fact block in the space between the eyebrow and footer
    const textStartY = 560 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, textStartY + i * lineHeight);
    });

    // Bottom branding area
    const brandY = H - 235;

    // Divider line
    const divGrad = ctx.createLinearGradient(100, 0, W - 100, 0);
    divGrad.addColorStop(0, 'transparent');
    divGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.06)');
    divGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.06)');
    divGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, brandY);
    ctx.lineTo(W - 100, brandY);
    ctx.stroke();

    // Load and draw logo
    try {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        logo.onload = () => resolve();
        logo.onerror = () => reject();
        logo.src = 'https://ik.imagekit.io/oeagl0l4x/public/logo.png?tr=w-200,q-80,f-auto';
      });
      const logoH = 84;
      const logoW = (logo.width / logo.height) * logoH;
      ctx.drawImage(logo, W / 2 - logoW / 2, brandY + 26, logoW, logoH);
    } catch {
      // Fallback text if logo fails
      ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.fillText('Coach Himanshu', W / 2, brandY + 80);
    }

    // Website and social
    ctx.font = '400 22px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('coachhimanshu.com  •  @coachhimanshusquad_', W / 2, brandY + 128);

    // "NASM Certified" small badge
    ctx.font = '500 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle = 'rgba(23, 95, 255, 0.4)';
    ctx.fillText('NASM CERTIFIED FITNESS COACH', W / 2, brandY + 162);

    const dataUrl = canvas.toDataURL('image/png');
    setGeneratedImage(dataUrl);
    setGenerating(false);
  }, [fact]);

  const handleShare = async () => {
    if (!generatedImage) {
      await generateShareImage();
    }
    setShowSharePanel(true);
  };

  // Generate image when share panel opens for first time
  useEffect(() => {
    if (showSharePanel && !generatedImage && !generating) {
      generateShareImage();
    }
  }, [showSharePanel, generatedImage, generating, generateShareImage]);

  const shareToWhatsApp = async () => {
    const text = `💡 Did You Know?\n\n${fact?.content}\n\n🏋️ Get fit with Coach Himanshu\n👉 coachhimanshu.com\n📸 @coachhimanshusquad_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct share — download image for user to post
    downloadImage();
    alert('Image downloaded! Open Instagram and share it as a post or story.');
  };

  const shareToFacebook = () => {
    const text = `💡 Did You Know?\n\n${fact?.content}\n\n🏋️ Get fit with Coach Himanshu → coachhimanshu.com`;
    window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent('https://coachhimanshu.com')}`, '_blank');
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `coach-himanshu-fun-fact.png`;
    link.href = generatedImage;
    link.click();
  };

  const nativeShare = async () => {
    if (!fact) return;

    // Try native share with image if supported
    if (navigator.share && generatedImage) {
      try {
        const res = await fetch(generatedImage);
        const blob = await res.blob();
        const file = new File([blob], 'coach-himanshu-fun-fact.png', { type: 'image/png' });

        await navigator.share({
          title: 'Fun Fitness Fact - Coach Himanshu',
          text: `💡 Did You Know?\n\n${fact.content}\n\n🏋️ coachhimanshu.com`,
          files: [file],
        });
        return;
      } catch {
        // Fallback to text-only share
      }
    }

    // Text-only native share
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Fun Fitness Fact - Coach Himanshu',
          text: `💡 Did You Know?\n\n${fact.content}\n\n🏋️ Get fit with Coach Himanshu → coachhimanshu.com`,
        });
      } catch {
        // User cancelled
      }
    }
  };

  if (!fact) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-6 md:mb-8"
      >
        <div
          className="relative overflow-hidden rounded-2xl border border-yellow-500/10 p-4 md:p-5"
          style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.06) 0%, rgba(234,179,8,0.01) 50%, rgba(23,95,255,0.03) 100%)' }}
        >
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: 'rgba(234,179,8,0.08)' }} />

          <div className="relative flex items-start gap-3">
            <div
              className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center border border-yellow-500/15"
              style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.12) 0%, rgba(234,179,8,0.04) 100%)' }}
            >
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] md:text-xs font-semibold text-yellow-400/70 uppercase tracking-wider mb-1">
                Did You Know?
              </p>
              <p className="text-white/80 text-sm md:text-[15px] leading-relaxed">
                {fact.content}
              </p>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex-shrink-0 p-2 rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all group"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
              title="Share this fact"
            >
              <Share2 className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Share panel modal */}
      <AnimatePresence>
        {showSharePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowSharePanel(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="glass-card-strong rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm">Share Fun Fact</h3>
                <button onClick={() => setShowSharePanel(false)} className="p-1.5 rounded-lg hover:bg-white/5">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Preview */}
              <div className="p-4">
                {generating ? (
                  <div className="aspect-square rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue"></div>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Shareable fun fact"
                    className="w-full rounded-xl border border-white/[0.06]"
                  />
                ) : null}
              </div>

              {/* Share buttons */}
              <div className="px-4 pb-5 space-y-3">
                {/* Native share (mobile) */}
                {'share' in navigator && (
                  <button
                    onClick={nativeShare}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-brand-blue to-blue-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-brand-blue/20 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}

                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.06] hover:border-green-500/20 transition-all group"
                    style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.08) 0%, rgba(37,211,102,0.02) 100%)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-green-500 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 font-medium">WhatsApp</span>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={shareToInstagram}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.06] hover:border-pink-500/20 transition-all group"
                    style={{ background: 'linear-gradient(135deg, rgba(225,48,108,0.08) 0%, rgba(131,58,180,0.04) 100%)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-500 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 font-medium">Instagram</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-white/[0.06] hover:border-blue-500/20 transition-all group"
                    style={{ background: 'linear-gradient(135deg, rgba(24,119,242,0.08) 0%, rgba(24,119,242,0.02) 100%)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-500 fill-current">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-[10px] text-gray-400 font-medium">Facebook</span>
                  </button>
                </div>

                {/* Download */}
                <button
                  onClick={downloadImage}
                  disabled={!generatedImage}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.12] transition-all text-sm font-medium disabled:opacity-30"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}
                >
                  <Download className="w-4 h-4" />
                  Download Image
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
