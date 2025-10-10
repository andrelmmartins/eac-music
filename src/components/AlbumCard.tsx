'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { Album } from '@/@types/interfaces'
import { useState } from 'react'

interface AlbumCardProps {
  album: Album
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group bg-dark-800/50 backdrop-blur-sm rounded-lg p-4 hover:bg-dark-700/70 transition-all duration-300 cursor-pointer card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/${album.id}`} className="block">
        <div className="relative mb-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-dark-600 to-dark-700 shadow-2xl">
            {album.banner ? (
              <img
                src={album.banner}
                alt={album.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-dark-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
              </div>
            )}
          </div>
          
          <div
            className={`absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            } hover:scale-110 hover:bg-spotify-green-light`}
          >
            <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-white text-lg truncate group-hover:text-spotify-green transition-colors">
            {album.name}
          </h3>
          
          <div className="flex flex-wrap gap-1">
            {album.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-dark-600 text-dark-200 rounded-full"
              >
                {tag}
              </span>
            ))}
            {album.tags.length > 2 && (
              <span className="px-2 py-1 text-xs bg-dark-600 text-dark-200 rounded-full">
                +{album.tags.length - 2}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default AlbumCard
