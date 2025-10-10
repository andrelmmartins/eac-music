'use client'

import { Song } from '@/@types/interfaces'
import { Play, Pause } from 'lucide-react'

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  onSongSelect: (song: Song) => void
  onPlayPause: () => void
}

const SongList = ({ songs, currentSong, isPlaying, onSongSelect, onPlayPause }: SongListProps) => {
  const handleSongClick = (song: Song) => {
    if (currentSong?.id === song.id) {
      onPlayPause()
    } else {
      onSongSelect(song)
    }
  }


  return (
    <div className="bg-dark-800/50 backdrop-blur-sm rounded-lg border border-dark-700 overflow-hidden">
      <div className="px-8 py-4 border-b border-dark-700">
        <div className="grid grid-cols-11 gap-4 text-sm text-dark-400 font-medium items-center">
          <div className="col-span-1 flex justify-center">
            <span className="text-lg">#</span>
          </div>
          <div className="col-span-5">TÍTULO</div>
          <div className="col-span-3">TOM</div>
          <div className="col-span-2">TAGS</div>
        </div>
      </div>

      <div className="divide-y divide-dark-700">
        {songs.map((song, index) => {
          const isCurrentSong = currentSong?.id === song.id
          const isPlayingCurrent = isCurrentSong && isPlaying

          return (
            <div
              key={song.id}
              onClick={() => handleSongClick(song)}
              className={`
                group px-8 py-4 hover:bg-dark-700/50 transition-colors cursor-pointer
                ${isCurrentSong ? 'bg-dark-700/30' : ''}
              `}
            >
              <div className="grid grid-cols-11 gap-4 items-center">
                <div className="col-span-1 flex justify-center">
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isCurrentSong ? (
                      isPlayingCurrent ? (
                        <Pause className="w-4 h-4 text-spotify-green" />
                      ) : (
                        <Play className="w-4 h-4 text-spotify-green" />
                      )
                    ) : (
                      <>
                        <span className="text-dark-400 group-hover:hidden text-sm">
                          {index + 1}
                        </span>
                        <Play className="hidden group-hover:block w-4 h-4 text-white hover:text-spotify-green transition-colors" />
                      </>
                    )}
                  </div>
                </div>

                <div className="col-span-5">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className={`font-medium truncate ${
                        isCurrentSong ? 'text-spotify-green' : 'text-white'
                      }`}>
                        {song.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <span className="text-dark-300 text-sm">{song.tone}</span>
                </div>

                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {song.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-dark-600 text-dark-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {song.tags.length > 2 && (
                      <span className="px-2 py-1 text-xs bg-dark-600 text-dark-200 rounded-full">
                        +{song.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SongList
