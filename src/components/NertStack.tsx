import type { Card, PlayCardProps, DropCardProps } from '@/types/nerts.d'
import { PlayingCard } from './PlayingCard';
import { RefObject, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { CardSource } from '@/constants/nerts';

export function NertStack({
    nertStack,
    className,
    playCard,
    endGame,
    onDragEnd,
}: {
    nertStack: Card[];
    className?: string;
    playCard: (props: PlayCardProps) => void;
    endGame: () => void;
    onDragEnd?: (props: DropCardProps) => void;
}) {
    const [zIndex, setZIndex] = useState(0)
    const timeoutRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const handleDragStart = () => {
        setZIndex(1000)
    }

    const handleDragEnd = (card: Card, cardRef: RefObject<HTMLDivElement>) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            setZIndex(0)
        }, 1000)

        onDragEnd?.({ card, cardRef, source: CardSource.Nert })
    }

    return (
        <>
            <div className={clsx(className, "col-span-4 md:flex")}>
                <div className="md:ml-16">
                    <div
                        id={CardSource.Nert}
                        className="block w-16 h-24 md:w-24 md:h-36 outline outline-teal-500 dark:outline-teal-400 outline-offset-4 rounded-md"
                    >
                        <div
                            className="absolute w-16 h-24 md:w-24 md:h-36 text-teal-500 dark:text-teal-400 flex justify-center items-center select-none"
                            onClick={endGame}
                        >
                            <span className="text-l md:text-2xl font-bold">NERTS</span>
                        </div>
                        {nertStack.map((card, index) => {
                            const nertLength = nertStack.length
                            let shadow = ''
                            if (index > nertLength - 4) shadow = 'shadow-md shadow-zinc-800 rounded-md'
                            return (
                                <PlayingCard
                                    className={shadow}
                                    style={{ zIndex: zIndex }}
                                    key={index}
                                    suit={card?.suit}
                                    rank={card?.rank}
                                    isShowing={true}
                                    draggable={index === nertStack.length - 1}
                                    onDragStart={handleDragStart}
                                    onDragEnd={(cardRef) => handleDragEnd(card, cardRef)}
                                    onClick={() => playCard({
                                        card: nertStack[nertStack.length - 1],
                                        source: CardSource.Nert
                                    })}
                                />
                            )
                        })}
                    </div>
                    <div className="grid justify-items-center m-4 font-medium text-lg text-zinc-400 dark:text-zinc-500 select-none">
                        {nertStack.length}
                    </div>
                </div>
            </div>
        </>
    )
}