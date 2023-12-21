import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import type { RankDetails, Suit } from '@/types/nerts'

type DisplayOnlyPlayingCardProps = {
    className?: string
    suit: Suit;
    rank: RankDetails;
    isShowing?: boolean;
    style?: any;
    scale?: number[];
    onClick?: () => void;
}

export function DisplayOnlyPlayingCard(props: DisplayOnlyPlayingCardProps) {
    const {
        className,
        suit,
        rank,
        isShowing = false,
        style,
        scale,
        onClick,
    } = props

    return (
        <div
            className={clsx("group absolute cursor-pointer shadow-md shadow-zinc-800 rounded-md", className)}

        >
            <div
                className="relative flex flex-col items-start select-none"
            >
                <div hidden className="border-0 text-zinc-950 text-red-800"></div>
                {/* {children} */}
                {isShowing ?
                    <div className="w-32 h-48 bg-white rounded-lg flex flex-col justify-between p-2">
                        <div className="flex justify-between">
                            <div className={`text-${suit.type}`}>
                                <p className="text-xl font-bold">{rank.display}</p>
                            </div>
                            <div className={`text-${suit.type}`}>
                                <p className="text-xl font-thin">{suit.symbol}</p>
                            </div>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                        <div className={`absolute text-${suit.type} font-thin ${suit.name === 'Spades' && rank.position === 1 ? 'text-[5rem] leading-[1rem] md:text-9xl' : 'text-7xl'}`}>{suit.symbol}</div>
                            <div className="absolute">
                                <div className={`text-white font-bold text-sm leading-[1rem] text-md z-[20]`}>{suit.name === 'Spades' && rank.position === 1 ? 'PLAY' : ''}</div>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className={`text-${suit.type} rotate-180`}>
                                <p className="text-xl font-thin">{suit.symbol}</p>
                            </div>
                            <div className={`text-${suit.type} rotate-180`}>
                                <p className="text-xl font-bold">{rank.display}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-32 h-48 absolute rounded-md">
                        <Image draggable="false" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={cardBack} className={clsx(className, "rounded-md")} alt="reverse of playing card" />
                    </div>
                }
            </div>
        </div>
    )
}
