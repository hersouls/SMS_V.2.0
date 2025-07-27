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
import { DESIGN_TOKENS } from '../../lib/design-tokens';

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
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 플레이리스트 (Footer 디자인 가이드 표준)
  const playlist: Track[] = [
    {
      id: 1,
      title: "Glow Not Noise",
      artist: "Moonwave",
      url: "/audio/glow-not-noise.mp3",
      duration: 225
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

  // 자동 재생 로직 (Footer 디자인 가이드 표준)
  useEffect(() => {
    if (isLoggedIn && autoPlay && audioRef.current) {
      const playMusic = async () => {
        try {
          setIsLoading(true);
          audioRef.current!.volume = volume;
          await audioRef.current!.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('자동 재생 실패 (브라우저 정책):', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      const timer = setTimeout(playMusic, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, autoPlay, volume]);

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

  const previousTrack = useCallback(() => {
    setCurrentTrack(prev => 
      prev === 0 ? playlist.length - 1 : prev - 1
    );
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
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
  }, [nextTrack, repeatMode]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
    const percentage = clickX / width;
    
    audio.currentTime = percentage * audio.duration;
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
      <div className={cn(
        "@container fixed bottom-0 left-0 right-0 z-30",
        DESIGN_TOKENS.GRADIENT_PRIMARY,
        "backdrop-blur-md shadow-2xl border-t border-white/10",
        className
      )}>
        <div className="px-4 py-3 @sm:px-6 @lg:px-8">
          {/* Main Player Controls */}
          <div className="flex items-center space-x-3 @sm:space-x-4">
            {/* Track Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold font-pretendard tracking-ko-normal">
                  {currentTrack + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate break-keep-ko tracking-ko-normal font-pretendard">
                  {currentTrackData.title}
                </p>
                <p className="text-xs text-white/70 truncate break-keep-ko tracking-ko-normal font-pretendard">
                  {currentTrackData.artist}
                </p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center space-x-2 @sm:space-x-3">
              <button
                onClick={() => setIsShuffled(!isShuffled)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isShuffled 
                    ? "text-blue-300 bg-white/20" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                aria-label="셔플"
              >
                <Shuffle className="w-4 h-4 @sm:w-5 @sm:h-5" />
              </button>

              <button
                onClick={previousTrack}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="이전 곡"
              >
                <SkipBack className="w-4 h-4 @sm:w-5 @sm:h-5" />
              </button>

              <button
                onClick={togglePlay}
                className={cn(
                  "p-2 @sm:p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200 shadow-lg hover:shadow-xl",
                  "focus:ring-white/50"
                )}
                aria-label={isPlaying ? "일시정지" : "재생"}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 @sm:w-5 @sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 @sm:w-5 @sm:h-5" />
                ) : (
                  <Play className="w-4 h-4 @sm:w-5 @sm:h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="다음 곡"
              >
                <SkipForward className="w-4 h-4 @sm:w-5 @sm:h-5" />
              </button>

              <button
                onClick={toggleRepeatMode}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  repeatMode !== 'none'
                    ? "text-blue-300 bg-white/20" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                aria-label="반복 모드"
              >
                <Repeat className={cn(
                  "w-4 h-4 @sm:w-5 @sm:h-5",
                  repeatMode === 'one' && "text-orange-300"
                )} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-3 @sm:mx-4 max-w-md hidden @md:block">
              <div
                ref={progressRef}
                className={cn(DESIGN_TOKENS.PROGRESS_BASE)}
                onClick={handleProgressClick}
                role="progressbar"
                aria-label="재생 진행률"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={cn(DESIGN_TOKENS.PROGRESS_FILL)}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/70 mt-1 font-pretendard tracking-ko-normal">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrackData.duration)}</span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 @sm:w-5 @sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 @sm:w-5 @sm:h-5" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className={cn(DESIGN_TOKENS.SLIDER_BASE, "w-12 @sm:w-16")}
                aria-label="볼륨 조절"
                aria-valuenow={isMuted ? 0 : volume * 100}
                aria-valuemin={0}
                aria-valuemax={100}
              />

              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="플레이리스트"
              >
                <List className="w-4 h-4 @sm:w-5 @sm:h-5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={isExpanded ? "축소" : "확장"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4 @sm:w-5 @sm:h-5" />
                ) : (
                  <Maximize2 className="w-4 h-4 @sm:w-5 @sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4">
                {/* Playlist */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 break-keep-ko tracking-ko-normal font-pretendard">
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
                            ? "bg-white/20 text-white"
                            : "hover:bg-white/10 text-white/70 hover:text-white"
                        )}
                        aria-label={`${track.title} 재생`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium font-pretendard tracking-ko-normal">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm truncate break-keep-ko tracking-ko-normal font-pretendard">
                              {track.title}
                            </p>
                            <p className="text-xs text-white/50 truncate break-keep-ko tracking-ko-normal font-pretendard">
                              {track.artist}
                            </p>
                          </div>
                          <span className="text-xs text-white/50 font-pretendard tracking-ko-normal">
                            {formatTime(track.duration)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Controls */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 break-keep-ko tracking-ko-normal font-pretendard">
                    오디오 설정
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-white/70 block mb-1 break-keep-ko tracking-ko-normal font-pretendard">
                        볼륨
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className={cn(DESIGN_TOKENS.SLIDER_BASE, "w-full h-2")}
                        aria-label="볼륨 조절"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsShuffled(!isShuffled)}
                        className={cn(
                          "text-xs px-3 py-1 rounded-full transition-colors font-pretendard tracking-ko-normal",
                          isShuffled
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        )}
                      >
                        셔플
                      </button>
                      <button
                        onClick={toggleRepeatMode}
                        className={cn(
                          "text-xs px-3 py-1 rounded-full transition-colors font-pretendard tracking-ko-normal",
                          repeatMode !== 'none'
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
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

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrackData.url}
        preload="metadata"
        onError={(e) => console.error('Audio error:', e)}
      />

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: linear-gradient(to right, #a78bfa, #60a5fa);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: linear-gradient(to right, #a78bfa, #60a5fa);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </>
  );
};

export default MusicPlayer;