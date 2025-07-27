import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Minimize2,
  Maximize2,
  Shuffle,
  Repeat,
  List
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: number;
}

interface MusicPlayerProps {
  isLoggedIn?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  isLoggedIn = true, 
  autoPlay = true,
  className 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 플레이리스트 (실제 음악 파일로 교체 필요)
  const playlist: Track[] = [
    {
      id: 1,
      title: "Glow Not Noise",
      artist: "Moonwave",
      url: "/audio/glow-not-noise.mp3",
      duration: 180
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Nature Sounds",
      url: "/audio/ocean-waves.mp3",
      duration: 240
    },
    {
      id: 3,
      title: "Ambient Flow",
      artist: "Chill Vibes",
      url: "/audio/ambient-flow.mp3",
      duration: 200
    }
  ];

  const currentTrackData = playlist[currentTrack];

  useEffect(() => {
    if (isLoggedIn && autoPlay) {
      setIsPlaying(true);
    }
  }, [isLoggedIn, autoPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, volume, isMuted]);

  const nextTrack = useCallback(() => {
    setCurrentTrack(prev => 
      prev === playlist.length - 1 ? 0 : prev + 1
    );
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        setProgress(progressPercent);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, nextTrack]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const previousTrack = () => {
    setCurrentTrack(prev => 
      prev === 0 ? playlist.length - 1 : prev - 1
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    
    audio.currentTime = clickPercent * audio.duration;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'all';
      if (prev === 'all') return 'one';
      return 'none';
    });
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrackData.url}
        preload="metadata"
      />

      {/* Fixed Music Player Footer */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-lg",
        className
      )}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {currentTrackData.title.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate break-keep-ko">
                  {currentTrackData.title}
                </p>
                <p className="text-xs text-gray-500 truncate break-keep-ko">
                  {currentTrackData.artist}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isShuffled 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
                aria-label="셔플"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={previousTrack}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="이전 곡"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label={isPlaying ? "일시정지" : "재생"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="다음 곡"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={toggleRepeatMode}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  repeatMode !== 'none'
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
                aria-label="반복 모드"
              >
                <Repeat className={cn(
                  "w-4 h-4",
                  repeatMode === 'one' && "text-orange-600"
                )} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-4 max-w-md">
              <div
                ref={progressRef}
                className="w-full h-1 bg-gray-200 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrackData.duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="볼륨 조절"
              />

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label="플레이리스트"
              >
                <List className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                aria-label={isExpanded ? "축소" : "확장"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Playlist */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 break-keep-ko">
                    플레이리스트
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {playlist.map((track, index) => (
                      <button
                        key={track.id}
                        onClick={() => setCurrentTrack(index)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg transition-colors",
                          currentTrack === index
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50 text-gray-700"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate break-keep-ko">
                              {track.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate break-keep-ko">
                              {track.artist}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatTime(track.duration)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Controls */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 break-keep-ko">
                    오디오 설정
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1 break-keep-ko">
                        볼륨
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsShuffled(!isShuffled)}
                        className={cn(
                          "text-xs px-3 py-1 rounded-full transition-colors",
                          isShuffled
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        셔플
                      </button>
                      <button
                        onClick={toggleRepeatMode}
                        className={cn(
                          "text-xs px-3 py-1 rounded-full transition-colors",
                          repeatMode !== 'none'
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        {repeatMode === 'none' && '반복 안함'}
                        {repeatMode === 'all' && '전체 반복'}
                        {repeatMode === 'one' && '한 곡 반복'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;