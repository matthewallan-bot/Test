"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/data/tracks";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    audio.src = track.audioUrl;
    audio.load();
    setCurrent(0);
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-source when track changes
  }, [track?.id]);

  if (!track) {
    return <p className="text-ink-soft">No published tracks yet.</p>;
  }

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  function selectTrack(next: number) {
    setIndex(next);
    setPlaying(true);
  }

  return (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          if (index < tracks.length - 1) {
            setIndex((i) => i + 1);
          } else {
            setPlaying(false);
          }
        }}
      />

      <div className="border border-ink/15 bg-paper/80 p-5 shadow-[0_20px_50px_rgba(18,21,26,0.08)]">
        <p className="text-xs uppercase tracking-[0.2em] text-steel">
          Now playing
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide text-ink md:text-4xl">
          {track.title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{track.albumTitle}</p>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => void togglePlay()}
            className="min-w-28 rounded-sm bg-signal px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-signal-deep"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <span className="font-mono text-sm text-ink-soft">
            {formatTime(current)} / {formatTime(duration || track.durationSeconds)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={duration || track.durationSeconds || 1}
          step={0.1}
          value={current}
          aria-label="Seek"
          className="mt-4 w-full accent-[var(--signal)]"
          onChange={(e) => {
            const value = Number(e.target.value);
            const audio = audioRef.current;
            if (audio) audio.currentTime = value;
            setCurrent(value);
          }}
        />
      </div>

      <ol className="divide-y divide-ink/10 border border-ink/15 bg-paper/60">
        {tracks.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => selectTrack(i)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-ash/60 ${
                i === index ? "bg-ash/80" : ""
              }`}
            >
              <span className="flex items-baseline gap-3">
                <span className="w-6 font-mono text-xs text-steel">
                  {item.trackNumber.toString().padStart(2, "0")}
                </span>
                <span className="font-medium text-ink">{item.title}</span>
              </span>
              <span className="font-mono text-xs text-steel">
                {formatTime(item.durationSeconds)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
