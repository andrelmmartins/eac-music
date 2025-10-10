'use client'

import { Album } from '@/@types/interfaces'
import AlbumCard from './AlbumCard'

interface AlbumSectionProps {
  title: string
  subtitle?: string
  albums: Album[]
  isLoading?: boolean
}

const AlbumSection = ({ title, subtitle, albums, isLoading }: AlbumSectionProps) => {
  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {subtitle && (
            <p className="text-dark-300 text-sm">{subtitle}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-dark-700 rounded-lg aspect-square mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                <div className="h-3 bg-dark-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (albums.length === 0) {
    return (
      <section className="mb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {subtitle && (
            <p className="text-dark-300 text-sm">{subtitle}</p>
          )}
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <p className="text-dark-400">Nenhum álbum encontrado</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        {subtitle && (
          <p className="text-dark-300 text-sm">{subtitle}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  )
}

export default AlbumSection
