"use client";

import React, { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon, ForwardIcon, RewindIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./Button";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const storedTrack = localStorage.getItem("selectedTrack");
    if (storedTrack) {
      setTrack(JSON.parse(storedTrack));
      setIsPlaying(true);
    }
  }, []);

  interface Track {
    title: string;
    artist: string;
    src: string;
    thumbnail?: string;
  }

  useEffect(() => {
    if (audioRef.current && track) {
      audioRef.current.src = track.src;
      audioRef.current.load();
    }
  }, [track]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.warn);
    }
    setIsPlaying(!isPlaying);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) audioRef.current.play().catch(console.warn);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (+e.target.value / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <Image
          src={track?.thumbnail || "/music-cover-placeholder.png"}
          alt="Cover"
          width={800}
          height={800}
          className="w-full h-[320px] rounded-xl object-cover"
        />

        <h2 className="text-2xl font-semibold text-center mt-6">
          {track?.title || "No track selected"}
        </h2>
      </div>

      {/* Progress */}
      <div className="w-full max-w-xl mt-6">
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleSeek}
          className="w-full appearance-none h-2 bg-gray-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-xs mt-1 text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-10 mt-8">
        <Button variant="ghost" size="icon" aria-label="Rewind">
          <RewindIcon className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="h-16 w-16"
        >
          {isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Forward">
          <ForwardIcon className="h-6 w-6" />
        </Button>
      </div>

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioPlayer;
