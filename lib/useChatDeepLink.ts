import { useEffect, useRef } from 'react';

/**
 * Opens a chat from a tapped notification: from `?chat=<id>` when the tap launched the app, or
 * from the service worker's message when this dashboard was already open.
 */
export function useChatDeepLink(onOpen: (conversationId: number) => void) {
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = parseInt(url.searchParams.get('chat') || '', 10);
    if (fromUrl) {
      onOpenRef.current(fromUrl);
      // So a refresh doesn't reopen the chat.
      url.searchParams.delete('chat');
      window.history.replaceState(window.history.state, '', url.pathname + url.search);
    }

    if (!('serviceWorker' in navigator)) return;
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'open-chat') onOpenRef.current(event.data.conversationId);
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);
}
