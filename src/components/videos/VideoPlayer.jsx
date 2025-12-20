"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import ReactPlayer from "react-player";
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff, HiArrowsPointingOut, HiXMark } from "react-icons/hi2";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import Image from "next/image";

const VideoPlayer = forwardRef(function VideoPlayer({ 
  videoUrl, 
  thumbnailUrl, 
  title,
  onProgress,
  onEnded,
  onPlay,
  onPause,
  className = "",
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  width = "100%",
  height = "auto"
}, ref) {
  const [playing, setPlaying] = useState(autoplay);
  const [mutedState, setMutedState] = useState(muted);
  const [volume, setVolume] = useState(1);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    seekTo: (seconds) => {
      playerRef.current?.seekTo(seconds);
    },
    play: () => {
      setPlaying(true);
    },
    pause: () => {
      setPlaying(false);
    },
    getCurrentTime: () => {
      return played * duration;
    }
  }));

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    setPlaying(true);
    setShowThumbnail(false);
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setPlaying(false);
    if (onPause) onPause();
  };

  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
      if (onProgress) {
        onProgress(state);
      }
    }
  };

  const handleSeekChange = (e) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    const value = parseFloat(e.target.value);
    playerRef.current?.seekTo(value);
    setSeeking(false);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    setMutedState(value === 0);
  };

  const toggleMute = () => {
    if (mutedState) {
      setMutedState(false);
      setVolume(0.5);
    } else {
      setMutedState(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (playing) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleClickPlay = () => {
    if (showThumbnail) {
      setShowThumbnail(false);
      setPlaying(true);
      if (onPlay) onPlay();
    } else {
      setPlaying(!playing);
      if (playing) {
        if (onPause) onPause();
      } else {
        if (onPlay) onPlay();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ width, aspectRatio: '16/9' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (playing) {
          setShowControls(false);
        }
      }}
    >
      {/* Video Player */}
      <div className="relative w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={playing}
          muted={mutedState}
          volume={volume}
          loop={loop}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={() => {
            setPlaying(false);
            setPlayed(0);
            if (onEnded) onEnded();
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true
              }
            }
          }}
        />

        {/* Thumbnail Overlay */}
        {showThumbnail && thumbnailUrl && (
          <div 
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleClickPlay}
          >
            <Image
              src={thumbnailUrl}
              alt={title || "Video thumbnail"}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
                aria-label="Play video"
              >
                <BsFillPlayFill className="w-10 h-10 text-slate-900 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {controls && (
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
              <h3 className="text-white font-bold text-lg drop-shadow-lg line-clamp-2">
                {title}
              </h3>
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-teal-400 transition-colors p-2"
                  aria-label="Exit fullscreen"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Center Play/Pause Button */}
            {!showThumbnail && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleClickPlay}
                  className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl opacity-0 hover:opacity-100"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <BsPauseFill className="w-8 h-8 text-slate-900" />
                  ) : (
                    <BsFillPlayFill className="w-8 h-8 text-slate-900 ml-1" />
                  )}
                </button>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              {/* Progress Bar */}
              <div className="w-full">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={played}
                  onChange={handleSeekChange}
                  onMouseUp={handleSeekMouseUp}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${played * 100}%, #475569 ${played * 100}%, #475569 100%)`
                  }}
                />
                <div className="flex justify-between text-white text-xs mt-1">
                  <span>{formatTime(played * duration)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={handleClickPlay}
                    className="text-white hover:text-teal-400 transition-colors"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? (
                      <HiPause className="w-6 h-6" />
                    ) : (
                      <HiPlay className="w-6 h-6" />
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-teal-400 transition-colors"
                      aria-label={mutedState ? "Unmute" : "Mute"}
                    >
                      {mutedState ? (
                        <HiVolumeOff className="w-6 h-6" />
                      ) : (
                        <HiVolumeUp className="w-6 h-6" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={mutedState ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${(mutedState ? 0 : volume) * 100}%, #475569 ${(mutedState ? 0 : volume) * 100}%, #475569 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-teal-400 transition-colors"
                  aria-label="Fullscreen"
                >
                  <HiArrowsPointingOut className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
});

export default VideoPlayer;

