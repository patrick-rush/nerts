import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CardSource } from '@/constants/nerts'

function getCardTop(
  parentIndex: number,
  pileLength: number,
  hoveredCardIndex: number | null | undefined,
  extraPx: number = 14,
): number {
  const s = Math.min(200 / pileLength, 40)
  // No effect when hovering the last card — it's already fully visible.
  if (hoveredCardIndex == null || hoveredCardIndex >= pileLength - 1) {
    return s * parentIndex
  }
  const h = hoveredCardIndex
  const pivot = h + 1 // the card directly below the hovered card — this one moves down

  // Special case: pivot IS the last card. Nothing is below it to compress, so it
  // simply slides down freely by extraPx. This is the one time the last card moves.
  if (pivot === pileLength - 1) {
    if (parentIndex <= h) return s * parentIndex // hovered card and above: unchanged
    return s * pivot + extraPx // last card: pushed down freely
  }

  const remainingGaps = pileLength - 1 - pivot // gaps between pivot and the fixed last card
  // Cap extra space so cards below pivot are never compressed below 40% of original spacing
  const cappedExtra = Math.min(extraPx, s * remainingGaps * 0.6)
  if (cappedExtra <= 0) return s * parentIndex
  const newSpacingBelow = (s * remainingGaps - cappedExtra) / remainingGaps
  if (parentIndex <= h) return s * parentIndex // hovered card and above: unchanged
  if (parentIndex === pivot) return s * pivot + cappedExtra // pivot: pushed down
  return s * pivot + cappedExtra + (parentIndex - pivot) * newSpacingBelow // below pivot: compressed
}

interface ColumnProps {
  pile: Card[]
  riverIndex: number
  parentIndex: number
  playCard: (props: PlayCardProps) => void
  handleDragStart: () => void
  handleDragEnd: (props: DropCardProps) => void
  wasDragged: boolean
  river: Card[][]
  parentZIndex?: number
  hoveredCardIndex?: number | null
  onCardHover?: (index: number) => void
  onCardHoverLeave?: (index: number) => void
}

export const Column = ({
  pile,
  riverIndex,
  parentIndex,
  playCard,
  handleDragStart: onDragStart,
  handleDragEnd: onDragEnd,
  wasDragged,
  river,
  parentZIndex,
  hoveredCardIndex,
  onCardHover,
  onCardHoverLeave,
}: ColumnProps): JSX.Element => {
  const [zIndex, setZIndex] = useState(parentZIndex || 0)
  const cardRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (parentIndex >= pile.length) {
    return <></>
  }

  const handleDragStart = () => {
    setZIndex(zIndex + 1000)
    onDragStart()
  }

  const handleDragEnd = (props: DropCardProps) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setZIndex(parentZIndex || 0)
    }, 1000)

    onDragEnd(props)
  }

  const card = pile[parentIndex]
  const cardTop = getCardTop(parentIndex, pile.length, hoveredCardIndex)

  return (
    <motion.div
      className="relative"
      style={{ zIndex: zIndex }}
      drag
      dragElastic={1}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={(event) => {
        event.stopPropagation()
        handleDragEnd({
          card,
          cardRef,
          source: CardSource.River,
          pileIndex: riverIndex,
          foundationIndex:
            parentIndex < pile.length - 1 ? parentIndex : undefined,
        })
      }}
      onClick={(event) => {
        if (!wasDragged) {
          event.stopPropagation()
          playCard({
            card,
            source: CardSource.River,
            pileIndex: riverIndex,
            foundationIndex:
              parentIndex < pile.length - 1 ? parentIndex : undefined,
          })
        }
      }}
    >
      <div
        id={`${CardSource.River}-${riverIndex}-${parentIndex}`}
        key={parentIndex}
        className="absolute"
      >
        <PlayingCard
          className="rounded-md shadow-md shadow-zinc-800"
          style={{ top: `${cardTop}px`, transition: 'top 0.15s ease-out' }}
          suit={card?.suit}
          rank={card?.rank}
          isShowing={true}
          ref={cardRef}
          onPointerEnter={() => onCardHover?.(parentIndex)}
          onPointerLeave={() => onCardHoverLeave?.(parentIndex)}
        />
        <Column
          pile={pile}
          riverIndex={riverIndex}
          parentIndex={parentIndex + 1}
          playCard={playCard}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          wasDragged={wasDragged}
          river={river}
          parentZIndex={zIndex}
          hoveredCardIndex={hoveredCardIndex}
          onCardHover={onCardHover}
          onCardHoverLeave={onCardHoverLeave}
        />
      </div>
    </motion.div>
  )
}
