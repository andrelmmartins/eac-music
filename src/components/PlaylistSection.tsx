'use client'

import PlaylistCard from './PlaylistCard'

interface PlaylistSectionProps {
  playlists: string[]
  selectedPlaylist: string | null
  onPlaylistSelect: (name: string) => void
}

const PlaylistSection = ({
  playlists,
  selectedPlaylist,
  onPlaylistSelect,
}: PlaylistSectionProps) => {
  if (playlists.length === 0) {
    return null
  }

  return (
    <section className="mb-10" aria-labelledby="playlists-title">
      <div className="mb-6">
        <h2 id="playlists-title" className="text-2xl font-bold text-white">
          Playlists
        </h2>
        <p className="mt-1 text-sm text-dark-300">
          Selecione uma playlist para filtrar as músicas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist}
            name={playlist}
            isSelected={selectedPlaylist === playlist}
            onSelect={onPlaylistSelect}
          />
        ))}
      </div>
    </section>
  )
}

export default PlaylistSection
