# Push Notifications Implementation

This document explains how push notifications work in the Coach Himanshu PWA.

## Features

### Push Notifications Are Sent For:
1. **Coach Notifications** - When a coach sends a notification to all clients
2. **New Blog Posts** - When a coach publishes a new blog post

## How It Works

### 1. Client Subscription
- When a client logs into their dashboard, the app automatically requests permission for notifications (after 3 seconds)
- If the user grants permission, the app subscribes to push notifications
- The subscription is saved to the database with the user's ID

### 2. Sending Notifications

#### Coach Dashboard → Notify Clients Button
- Coach clicks "Notify Clients" button
- Writes a message
- On send, the notification is:
  - Saved to the database
  - Sent as push notification to all clients' devices

#### Blog Post Creation
- When a coach publishes a blog post
- Push notification is automatically sent to all clients
- Notification includes the blog title and excerpt

### 3. Receiving Notifications (Client Side)
- Service worker receives the push event
- Displays a notification with title, body, and icon
- When clicked, opens the app to the relevant page

## Technical Details

### Service Worker (`public/sw.js`)
- Handles `push` events
- Displays notifications
- Handles notification clicks

### Push Subscription Hook (`lib/usePushNotifications.ts`)
- React hook for managing push subscriptions
- Handles permission requests
- Subscribes/unsubscribes from push notifications

### API Endpoints
- `POST /api/push/subscribe` - Save push subscription
- `DELETE /api/push/subscribe` - Remove push subscription
- `POST /api/notifications` - Create notification (also sends push)
- `POST /api/blog` - Create blog post (sends push if published)

### Database Schema
- `PushSubscription` model stores subscription details
- Fields: userId, endpoint, endpointHash, p256dh, auth

### Environment Variables
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public_key>
VAPID_PRIVATE_KEY=<private_key>
VAPID_SUBJECT=mailto:admin@coachhimanshu.com
```

## Testing Push Notifications

### Prerequisites
1. Must be accessed via HTTPS (or localhost)
2. Must be installed as PWA on device
3. User must grant notification permission

### Test Notifications
1. **Test Coach Notification:**
   - Login as coach
   - Click "Notify Clients"
   - Send a message
   - Check client devices for notification

2. **Test Blog Post Notification:**
   - Login as coach
   - Create a new blog post
   - Ensure "Publish immediately" is checked
   - Submit
   - Check client devices for notification

### Troubleshooting

**No notification received?**
- Check if notification permission is granted
- Check browser console for errors
- Verify service worker is registered
- Check if PWA is installed

**Subscription fails?**
- Ensure VAPID keys are in .env file
- Restart dev server after adding env variables
- Check browser compatibility

## Browser Support
- Chrome/Edge (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (iOS 16.4+, macOS 13+)
- Opera (Desktop & Mobile)

## Security Notes
- VAPID keys are used for authentication
- Private key should never be exposed to clients
- Subscriptions are tied to specific users
- Invalid subscriptions are automatically removed
