"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react";

const TRACKS = [
  { name: "Long Relaxing Music", file: "/long relaxing music.mp3" },
  { name: "Stress Buster", file: "/stress buster.mp3" },
  { name: "Jazz Hop", file: "/Jazz Hop.mp3" },
];

export function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset play state when track changes
    if (isPlaying) {
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? TRACKS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev === TRACKS.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.file} loop />
      
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <div className="bg-card/95 backdrop-blur-sm border-2 border-border rounded-2xl shadow-2xl p-4 min-w-[280px]">
          {/* Track Name and Volume */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Music className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground truncate">
                {currentTrack.name}
              </span>
            </div>
            
            <button
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Playback Controls - Centered */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Previous track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="bg-primary text-primary-foreground rounded-full p-2 hover:opacity-90 transition-opacity"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

