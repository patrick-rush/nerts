import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { Column } from './Column';
import { useState, type MutableRefObject } from 'react';

export function River({
    river,
    playCard,
    onDragEnd,
}: {
    river: Card[][];
    playCard: (props: PlayCardProps) => void;
    onDragEnd: (props: DragProps) => void;
}) {
    const [wasDragged, setWasDragged] = useState(false)
    
    const handleDragStart = () => {
        console.log("drag started")
        setWasDragged(true)
    }
    
    const handleDragEnd = (props: DragProps) => {
        onDragEnd?.(props)
        setWasDragged(false)
    }

    return (
        <>
            {river.map((pile, riverIndex) => (
                <div key={riverIndex} style={{ /*...styles*/ }}>
                    <div id={`river-${riverIndex}`} className="relative w-16 h-24 md:w-24 md:h-36 outline outline-zinc-100 outline-offset-4 rounded-md dark:outline-zinc-700/40">
                        <Column
                            pile={pile}
                            riverIndex={riverIndex}
                            parentIndex={0}
                            playCard={playCard}
                            handleDragStart={handleDragStart}
                            handleDragEnd={handleDragEnd}
                            wasDragged={wasDragged}
                            river={river}
                        />
                    </div>
                </div>
            ))}
        </>
    )
}