import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard'
import { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion"
import { CardSource } from '@/constants/nerts'
interface ColumnProps {
    pile: Card[]
    riverIndex: number
    parentIndex: number
    playCard: (props: PlayCardProps) => void
    handleDragStart: () => void
    handleDragEnd: (props: DropCardProps) => void
    wasDragged: boolean;
    river: Card[][];
    parentZIndex?: number;
}

export const Column = ({ pile,
    riverIndex,
    parentIndex,
    playCard,
    handleDragStart: onDragStart,
    handleDragEnd: onDragEnd,
    wasDragged,
    river,
    parentZIndex
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
                    foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined,
                })
            }}
            onClick={(event) => {
                if (!wasDragged) {
                    event.stopPropagation()
                    playCard({
                        card,
                        source: CardSource.River,
                        pileIndex: riverIndex,
                        foundationIndex: (parentIndex < pile.length - 1) ? parentIndex : undefined
                    })
                }
            }}
        >
            <div id={`${CardSource.River}-${riverIndex}-${parentIndex}`} key={parentIndex} className="absolute" >
                <PlayingCard
                    className="shadow-md shadow-zinc-800 rounded-md"
                    style={{ top: `${Math.min(200 / river[riverIndex].length, 40) * parentIndex}px` }}
                    suit={card?.suit}
                    rank={card?.rank}
                    isShowing={true}
                    ref={cardRef}
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
                />
            </div>
        </motion.div>
    )
}