'use client'

import { Album } from '@/@types/interfaces'
import { Play } from 'lucide-react'

interface AlbumHeaderProps {
  album: Album
  onPlayAll: () => void
}

const AlbumHeader = ({ album, onPlayAll }: AlbumHeaderProps) => {
  return (
    <div className="relative">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(18, 18, 18, 0.6) 0%, rgba(18, 18, 18, 0.8) 100%), url(${album.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-6 sm:space-y-0 sm:space-x-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-dark-600  to-dark-700 rounded-lg shadow-2xl flex-shrink-0 mx-auto sm:mx-0">
            {album.banner ? (
              <img
                src={album.banner}
                alt={album.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-dark-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-4xl">🎵</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 break-words">
                {album.name}
              </h1>
            </div>

            {album.tags.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                  {album.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-dark-700/50 text-white rounded-full border border-dark-600 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                  {album.tags.length > 3 && (
                    <span className="px-2.5 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-dark-600/50 text-dark-300 rounded-full border border-dark-600 whitespace-nowrap">
                      +{album.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-center sm:justify-start space-x-4">
              <button
                onClick={onPlayAll}
                className="flex items-center space-x-2 bg-spotify-green text-black px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold hover:bg-spotify-green-light transition-colors hover:scale-105 transform text-sm sm:text-base"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Reproduzir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumHeader
