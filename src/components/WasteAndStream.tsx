import type { Card, PlayCardProps, DragProps } from '@/types/nerts.d'
import { Stream } from './Stream';
import { Waste } from './Waste';
import type { MutableRefObject } from 'react';

export function WasteAndStream({
    stream,
    waste,
    maxWasteShowing,
    playCard,
    wasteCards,
    onDragEnd,
}: {
    stream: Card[];
    waste: Card[];
    maxWasteShowing: { current: number }
    playCard: (props: PlayCardProps) => void;
    wasteCards: () => void;
    onDragEnd: (props: DragProps) => void;
}) {
    return (
        <div id="stream-and-waste" className="flex justify-center ">
            {/* stream */}
            <Stream stream={stream} wasteCards={wasteCards} />
            {/* waste */}
            <Waste waste={waste} playCard={playCard} maxWasteShowing={maxWasteShowing} onDragEnd={onDragEnd} />
        </div>

    )
}