import { AnimatePresence, motion } from 'framer-motion'
import { PlayingCard } from './PlayingCard'
import type { Card, Player } from '@/types/nerts.d'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { PlayerColor, PlayerColorIndex } from '@/constants/nerts'

export function Lake({
  numberOfPlayers,
  lake,
  lastInLake,
}: {
  numberOfPlayers: number
  lake: Card[][]
  lastInLake: {
    player: Player | undefined
    card: Card
    pileIndex: number
  } | null
}) {
  const [playAnimation, setPlayAnimation] = useState(false)
  const previousLastInLake = useRef<{
    player: Player | undefined
    card: Card
    pileIndex: number
  } | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!lastInLake) return
    if (
      previousLastInLake.current &&
      lastInLake.player?.name === previousLastInLake.current.player?.name &&
      lastInLake.card.lookup === previousLastInLake.current.card.lookup
    )
      return
    setPlayAnimation(true)

    previousLastInLake.current = lastInLake

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setPlayAnimation(false)
    }, 4000)
  }, [lastInLake])

  return (
    <div id="lake" className="pb-8">
      <div
        className={clsx(
          'grid place-items-center rounded-md px-8 outline outline-offset-4 outline-zinc-100 dark:outline-zinc-700/40',
          lake.length <= 8
            ? 'min-h-24 grid-cols-8 md:min-h-36'
            : lake.length <= 12
              ? 'grid-cols-6'
              : 'grid-cols-8',
        )}
      >
        {lake.map((pile, index) => {
          const playerColor = lastInLake?.player
            ? PlayerColor[
                PlayerColorIndex[
                  lastInLake.player.colorIndex ?? 0
                ] as keyof typeof PlayerColor
              ]
            : ''
          let showPlayerName
          let shadow = ''
          if (lastInLake && lastInLake.card && lastInLake.pileIndex === index)
            showPlayerName = true
          if (pile?.length) shadow = 'shadow-md shadow-zinc-800 rounded-md'
          return (
            <div
              className={clsx(
                shadow,
                'relative isolate my-4 h-24 w-16 md:h-36 md:w-24',
              )}
              key={index}
              id={`lake-${index}`}
            >
              <span
                hidden
                className="bg-indigo-500 bg-orange-500 bg-pink-500 bg-teal-500 outline-indigo-400 outline-indigo-500 outline-orange-400 outline-orange-500 outline-pink-400 outline-pink-500 outline-teal-400 outline-teal-500"
              ></span>
              {pile?.map((card, cardIndex) => {
                const pileLength = pile?.length
                let shadow = ''
                if (index > pileLength - 3)
                  shadow = 'shadow-md shadow-zinc-800 rounded-md'
                const isLastPlaced =
                  lastInLake?.pileIndex === index &&
                  cardIndex === pile.length - 1
                const outlineColor =
                  PlayerColor[
                    PlayerColorIndex[
                      lastInLake?.player?.colorIndex || 0
                    ] as keyof typeof PlayerColor
                  ]
                return (
                  <PlayingCard
                    className={`${shadow} ${isLastPlaced ? `rounded-md outline outline-offset-4 outline-${outlineColor}-500 dark:outline-${outlineColor}-400` : ''}`}
                    key={cardIndex}
                    suit={card?.suit}
                    rank={card?.rank}
                    isShowing={true}
                  />
                )
              })}
              <AnimatePresence>
                {showPlayerName && playAnimation && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }}
                    className={`absolute bottom-0 left-0 right-0 flex items-center justify-center rounded-b-md bg-${playerColor}-500 px-1 py-0.5`}
                  >
                    <span className="truncate text-center text-xs font-semibold text-white">
                      {lastInLake?.player?.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
