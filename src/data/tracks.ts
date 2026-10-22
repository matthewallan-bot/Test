export type Track = {
  id: string;
  slug: string;
  title: string;
  albumTitle: string;
  durationSeconds: number;
  trackNumber: number;
  /** Public / CDN URL for HTML5 audio (placeholder until R2 is wired). */
  audioUrl: string;
  contentType: string;
  storageKey: string;
};

/**
 * Placeholder self-hosted tracks for the Music page player.
 * Swap audioUrl / storageKey for real R2 objects after upload.
 * Sample clips use publicly licensed short tones for local UI smoke tests.
 */
export const PLACEHOLDER_TRACKS: Track[] = [
  {
    id: "trk-signal-burn",
    slug: "signal-burn",
    title: "Signal Burn",
    albumTitle: "Fixed Reaction — Demos",
    durationSeconds: 12,
    trackNumber: 1,
    storageKey: "audio/demos/signal-burn.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    contentType: "audio/mpeg",
  },
  {
    id: "trk-afterimage",
    slug: "afterimage",
    title: "Afterimage",
    albumTitle: "Fixed Reaction — Demos",
    durationSeconds: 12,
    trackNumber: 2,
    storageKey: "audio/demos/afterimage.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    contentType: "audio/mpeg",
  },
  {
    id: "trk-static-room",
    slug: "static-room",
    title: "Static Room",
    albumTitle: "Fixed Reaction — Demos",
    durationSeconds: 12,
    trackNumber: 3,
    storageKey: "audio/demos/static-room.mp3",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    contentType: "audio/mpeg",
  },
];
