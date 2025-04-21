"use client";

import React, { useState, useRef, useEffect } from "react";
import { ForwardIcon, PlayIcon, RewindIcon, PauseIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./Button";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<Track | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!trackRef.current) {
      const stored = localStorage.getItem("selectedTrack");
      if (stored) {
        trackRef.current = JSON.parse(stored);
        setIsPlaying(true);
      }
    }
  }, []);

  useEffect(() => {
    if (trackRef.current && audioRef.current) {
      audioRef.current.src = trackRef.current.src;
      audioRef.current.load();
      setCurrentTime(0);
      setProgress(0);
    }
  }, [trackRef.current?.src]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.warn);
      setIsPlaying(true);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      if (isPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const track = trackRef.current;

  return (
    <div className="h-screen bg-white text-black flex flex-col items-center justify-center px-4">
      {/* Cover */}
      <div className="w-full max-w-2xl">
        <Image
          src="/music-cover-placeholder.png"
          alt="Cover"
          width={1000}
          height={1000}
          className="w-full rounded-2xl object-cover"
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold mt-6 text-center">
        {track?.title || "Audio Title"}
      </h2>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mt-6 px-2">
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-10 mt-8">
        <Button variant="ghost" size="icon" className="h-16 w-16">
          <RewindIcon className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="h-20 w-20"
        >
          {isPlaying ? (
            <PauseIcon className="h-10 w-10" />
          ) : (
            <PlayIcon className="h-10 w-10" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="h-16 w-16">
          <ForwardIcon className="h-8 w-8" />
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
