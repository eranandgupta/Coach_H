// A library video shared in chat. Messages are plain text, so it travels as a marker at the start of
// the message, followed by an optional note on the next line:
//   [[video:cTlZFhnY85E|Cable Chest Press]]
//   Do 3 sets of this today
// Safe to import from client components (no server dependencies). The server checks every marker
// against the video library before saving it, and only staff can send one.

const VIDEO_MESSAGE = /^\[\[video:([A-Za-z0-9_-]+)\|([^\]\n]*)\]\](?:\n([\s\S]*))?$/;

export type SharedVideo = { videoId: string; title: string; note: string };

export function buildVideoMessage(videoId: string, title: string, note = ''): string {
  const safeTitle = title.replace(/[\]\n]/g, ' ').trim();
  const text = note.trim();
  return `[[video:${videoId}|${safeTitle}]]${text ? `\n${text}` : ''}`;
}

export function parseVideoMessage(content: string): SharedVideo | null {
  const match = VIDEO_MESSAGE.exec(content);
  return match ? { videoId: match[1], title: match[2], note: (match[3] || '').trim() } : null;
}

/** How a message reads outside the chat itself: notifications and the conversation list. */
export function messagePreview(content: string): string {
  const video = parseVideoMessage(content);
  if (!video) return content;
  return video.note ? `Video: ${video.title} · ${video.note}` : `Video: ${video.title}`;
}
