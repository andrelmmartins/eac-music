'use client'

interface PlaylistCardProps {
  name: string
  isSelected: boolean
  onSelect: (name: string) => void
}

const gradients = [
  ['#7c3aed', '#db2777'],
  ['#0369a1', '#0891b2'],
  ['#b45309', '#dc2626'],
  ['#047857', '#65a30d'],
  ['#4338ca', '#7c3aed'],
  ['#be123c', '#c2410c'],
  ['#0f766e', '#2563eb'],
  ['#a21caf', '#4f46e5'],
]

function getGradient(name: string) {
  const hash = Array.from(name).reduce(
    (value, character) => ((value << 5) - value + character.charCodeAt(0)) | 0,
    0,
  )

  return gradients[Math.abs(hash) % gradients.length]
}

const PlaylistCard = ({ name, isSelected, onSelect }: PlaylistCardProps) => {
  const [from, to] = getGradient(name)

  return (
    <button
      type="button"
      onClick={() => onSelect(name)}
      aria-pressed={isSelected}
      className={`group w-full rounded-lg p-4 text-left transition-all duration-300 card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-spotify-green ${
        isSelected
          ? 'bg-dark-700/80 ring-2 ring-spotify-green'
          : 'bg-dark-800/50 hover:bg-dark-700/70'
      }`}
    >
      <div
        className="relative mb-4 aspect-square overflow-hidden rounded-lg shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-black/10" />
        <div className="relative flex h-full items-center justify-center p-4 sm:p-5">
          <span className="break-words text-center text-xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-2xl">
            {name}
          </span>
        </div>
      </div>

      <h3 className={`truncate text-base font-semibold transition-colors sm:text-lg ${
        isSelected ? 'text-spotify-green' : 'text-white group-hover:text-spotify-green'
      }`}>
        {name}
      </h3>
    </button>
  )
}

export default PlaylistCard
