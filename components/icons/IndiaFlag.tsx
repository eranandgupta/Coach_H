// Inline SVG tricolour — emoji flags render inconsistently (and not at all on Windows).
export default function IndiaFlag({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[3px] shadow-sm ring-1 ring-black/10`} aria-hidden>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.6" />
      <circle cx="15" cy="10" r="0.5" fill="#000080" />
    </svg>
  );
}
