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
        className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-900/80"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(18, 18, 18, 0.8) 100%), url(${album.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative p-8">
        <div className="flex items-end space-x-8">
          <div className="w-48 h-48 bg-gradient-to-br from-dark-600 to-dark-700 rounded-lg shadow-2xl flex-shrink-0">
            {album.banner ? (
              <img
                src={album.banner}
                alt={album.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-dark-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎵</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 truncate">
                {album.name}
              </h1>
            </div>

            {album.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {album.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm bg-dark-700/50 text-white rounded-full border border-dark-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={onPlayAll}
                className="flex items-center space-x-2 bg-spotify-green text-black px-8 py-4 rounded-full font-semibold hover:bg-spotify-green-light transition-colors hover:scale-105 transform"
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
