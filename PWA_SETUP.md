# PWA Setup Guide

This application is configured as a Progressive Web App (PWA), providing an app-like experience on mobile and desktop devices.

## Features Implemented

### ✅ Core PWA Features
- **Offline Support**: Service worker caches assets for offline use
- **Install Prompts**: Smart install banners for iOS and Android
- **App-like Experience**: Runs in standalone mode without browser chrome
- **Fast Loading**: Cached resources load instantly
- **Push Notifications**: Ready for push notification integration

### ✅ Device-Specific Features

#### iOS Support
- Custom install instructions for Safari
- Apple touch icons
- Status bar styling
- Splash screens support

#### Android Support
- Native install prompt via `beforeinstallprompt` event
- Material Design compliance
- Adaptive icons support

## Files Created

### Configuration Files
- `public/manifest.json` - PWA manifest configuration
- `public/sw.js` - Service worker for offline functionality
- `public/offline.html` - Offline fallback page
- `next.config.js` - Next.js PWA configuration with caching strategies

### Components
- `components/PWAInstallPrompt.tsx` - Smart install prompt component
  - Detects iOS vs Android
  - Shows appropriate install instructions
  - Dismissible with 24-hour cooldown
  - Auto-hides after installation

### Meta Tags
- Added to `app/layout.tsx`:
  - Viewport configuration
  - Theme colors
  - Apple touch icons
  - Mobile web app capabilities

## Icon Setup

### Required Icons
The PWA requires icons in the following sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

### Quick Icon Generation

#### Option 1: Automatic Generation (Recommended)
1. Install sharp: `npm install --save-dev sharp`
2. Place your logo at `public/logo.png` (preferably 512x512 or larger)
3. Run: `node scripts/generate-pwa-icons.js`

#### Option 2: Online Tool
1. Visit: https://www.pwabuilder.com/imageGenerator
2. Upload your logo (1024x1024 recommended)
3. Download generated icons
4. Place in `public/icons/` directory

#### Option 3: Manual Creation
Create icons manually using tools like:
- Photoshop
- Figma
- GIMP
- Canva

Place all icons in `public/icons/` directory following the naming convention:
- `icon-72x72.png`
- `icon-96x96.png`
- etc.

### Creating Icons Directory

```bash
mkdir -p public/icons
mkdir -p public/screenshots
```

## Testing PWA

### Local Testing
1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Open in browser and test install prompt

### Chrome DevTools (Desktop/Android)
1. Open DevTools (F12)
2. Go to Application tab
3. Check:
   - Manifest
   - Service Workers
   - Storage (Cache)
   - Lighthouse PWA audit

### Safari (iOS)
1. Open in Safari on iOS device
2. Tap Share button
3. Look for "Add to Home Screen" option
4. Check standalone mode functionality

### Testing Install Prompt
- The prompt appears 3 seconds after page load
- Dismissed prompts reappear after 24 hours
- Clear localStorage to reset: `localStorage.removeItem('pwa-install-dismissed')`

## Caching Strategy

### Implemented Strategies
1. **CacheFirst**: Fonts, audio, video (long-lived assets)
2. **StaleWhileRevalidate**: Images, CSS, JS (updated when possible)
3. **NetworkFirst**: API calls, dynamic content (fresh data preferred)

### Cache Names
- `google-fonts-webfonts`
- `google-fonts-stylesheets`
- `static-image-assets`
- `static-js-assets`
- `static-style-assets`
- `apis`
- `others`

## Deployment Checklist

- [ ] Generate all required icons
- [ ] Test on iOS Safari
- [ ] Test on Chrome Android
- [ ] Verify offline functionality
- [ ] Check manifest.json loads correctly
- [ ] Test service worker registration
- [ ] Verify install prompt appears
- [ ] Test standalone mode
- [ ] Run Lighthouse PWA audit (should score 100%)

## Customization

### Changing Theme Color
Update in multiple places:
1. `public/manifest.json` - `theme_color`
2. `app/layout.tsx` - `viewport.themeColor`
3. `tailwind.config.ts` - brand colors

### Modifying Install Prompt
Edit `components/PWAInstallPrompt.tsx`:
- Delay before showing (line 33)
- Cooldown period (line 28)
- Design and copy

### Adjusting Cache Duration
Edit `next.config.js`:
- Modify `maxAgeSeconds` for each cache strategy
- Adjust `maxEntries` to control cache size

## Troubleshooting

### Service Worker Not Registering
- Check console for errors
- Ensure HTTPS (required for SW)
- Verify `sw.js` is in `public/` directory
- Clear browser cache and hard reload

### Install Prompt Not Showing
- Check if already installed (standalone mode)
- Verify 24-hour cooldown hasn't been triggered
- Ensure manifest.json is valid
- Check browser compatibility

### Icons Not Loading
- Verify icons exist in `public/icons/`
- Check correct naming convention
- Ensure manifest.json paths are correct
- Clear cache and reload

### Offline Mode Not Working
- Check service worker is active
- Verify cache strategies in `next.config.js`
- Check network tab for cache hits
- Ensure offline.html exists

## Browser Support

### Full Support
- Chrome/Edge 90+
- Safari iOS 11.3+
- Firefox 90+
- Samsung Internet 15+

### Partial Support
- Safari iOS < 11.3 (no service worker)
- Older Android browsers (limited features)

## Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Next.js PWA Examples](https://github.com/shadowwalker/next-pwa)
- [PWA Builder](https://www.pwabuilder.com/)

## Maintenance

### Regular Tasks
- Update service worker version when deploying major changes
- Test PWA functionality after each deployment
- Monitor cache sizes and adjust strategies
- Keep dependencies updated (`next-pwa`)

### Monitoring
- Track install events via analytics
- Monitor service worker errors
- Check cache hit rates
- Measure offline usage

---

**Note**: PWA features are disabled in development mode for better DX. Test in production build.
