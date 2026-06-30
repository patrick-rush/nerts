import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { Column } from './Column'
import { useState } from 'react'

export function River({
  river,
  playCard,
  onDragEnd,
}: {
  river: Card[][]
  playCard: (props: PlayCardProps) => void
  onDragEnd: (props: DropCardProps) => void
}) {
  const [wasDragged, setWasDragged] = useState(false)
  const [hoveredCards, setHoveredCards] = useState<Record<number, number>>({})

  const handleDragStart = () => {
    console.log('drag started')
    setWasDragged(true)
  }

  const handleDragEnd = (props: DropCardProps) => {
    onDragEnd?.(props)
    setWasDragged(false)
  }

  const handleCardHover = (riverIndex: number, cardIndex: number) => {
    setHoveredCards((prev) => ({ ...prev, [riverIndex]: cardIndex }))
  }

  const handleCardHoverLeave = (riverIndex: number, cardIndex: number) => {
    setHoveredCards((prev) => {
      if (prev[riverIndex] === cardIndex) {
        const { [riverIndex]: _, ...rest } = prev
        return rest
      }
      return prev
    })
  }

  return (
    <>
      {river.map((pile, riverIndex) => (
        <div
          key={riverIndex}
          id={`river-${riverIndex}`}
          className="relative h-24 w-16 rounded-md outline outline-offset-4 outline-zinc-100 dark:outline-zinc-700/40 md:h-36 md:w-24"
        >
          <div>
            <Column
              pile={pile}
              riverIndex={riverIndex}
              parentIndex={0}
              playCard={playCard}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              wasDragged={wasDragged}
              river={river}
              hoveredCardIndex={hoveredCards[riverIndex] ?? null}
              onCardHover={(cardIndex) =>
                pile.length > 5 ? handleCardHover(riverIndex, cardIndex) : null
              }
              onCardHoverLeave={(cardIndex) =>
                pile.length > 5
                  ? handleCardHoverLeave(riverIndex, cardIndex)
                  : null
              }
            />
          </div>
        </div>
      ))}
    </>
  )
}
