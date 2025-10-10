'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, X, Music } from 'lucide-react'
import { Song } from '@/@types/interfaces'

interface MusicPlayerProps {
  currentSong: Song | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSongSelect: (song: Song) => void
  onClose: () => void
}

const MusicPlayer = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious, onSongSelect, onClose }: MusicPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.src
      audioRef.current.load()
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      if (isPlaying) {
        const playAudio = async () => {
          try {
            await audioRef.current?.play()
          } catch (error) {
            console.error('Error playing audio:', error)
          }
        }
        playAudio()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSong])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration
      
      requestAnimationFrame(() => {
        setCurrentTime(currentTime)
        setDuration(duration)
      })
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleEnded = () => {
    onNext()
  }

  const handleCanPlay = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    }
  }

  if (!currentSong) {
    return null
  } 

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
        onCanPlay={handleCanPlay}
      />
      
      <div className="sticky bottom-3 sm:bottom-4 mx-3 sm:mx-6 z-50">
        <div className="glass-effect rounded-2xl border border-spotify-green/20 p-3 sm:p-4 shadow-2xl backdrop-blur-xl bg-dark-800/60 relative">
          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0 pr-3">
                <h3 className="text-white font-semibold text-sm break-words leading-tight">{currentSong.name}</h3>
                <p className="text-dark-300 text-xs truncate">{currentSong.tone}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-dark-300 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-3">
              <button
                onClick={onPrevious}
                disabled={!currentSong}
                className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={onPlayPause}
                disabled={!currentSong}
                className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              
              <button
                onClick={onNext}
                disabled={!currentSong}
                className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {currentSong && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-dark-400 w-10 text-right font-mono">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    '--progress': duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                  } as React.CSSProperties}
                />
                <span className="text-xs text-dark-400 w-10 font-mono">
                  {formatTime(duration)}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-spotify-green-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                  <h3 className="text-white font-semibold truncate">{currentSong.name}</h3>
                  <p className="text-dark-300 text-sm truncate">{currentSong.tone}</p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onPrevious}
                  disabled={!currentSong}
                  className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={onPlayPause}
                  disabled={!currentSong}
                  className="p-3 bg-white text-black rounded-full hover:scale-105 transition-transform disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                
                <button
                  onClick={onNext}
                  disabled={!currentSong}
                  className="p-2 text-dark-300 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {currentSong && (
                <div className="flex items-center space-x-2 w-full">
                  <span className="text-xs text-dark-400 w-12 text-right font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      '--progress': duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'
                    } as React.CSSProperties}
                  />
                  <span className="text-xs text-dark-400 w-12 font-mono">
                    {formatTime(duration)}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={onClose}
                className="p-2 text-dark-300 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MusicPlayer
