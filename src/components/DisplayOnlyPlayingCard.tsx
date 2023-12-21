"use client"
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import type { RankDetails, Suit } from '@/types/nerts'
import { motion } from "framer-motion"

type DisplayOnlyPlayingCardProps = {
    className?: string
    suit: Suit;
    rank: RankDetails;
    isShowing?: boolean;
    style?: any;
    scale?: number[];
}

export function DisplayOnlyPlayingCard(props: DisplayOnlyPlayingCardProps) {
    "use client"
    const {
        className,
        suit,
        rank,
        isShowing = false,
        style,
        scale,
    } = props

    return (
        <motion.div
            className={clsx("group flex justify-center cursor-pointer", className)}
            initial={{
                filter: "blur(3px)"
            }}
            whileHover={{ 
                scale: 1.1,
                filter: "blur(0px"
            }}
            whileTap={{ scale: 0.9 }}
        >
            <div
                className="relative flex flex-col items-start select-none"
            >
                <div hidden className="border-0 text-zinc-950 text-red-800"></div>
                {/* {children} */}
                {isShowing ?
                    <div className="w-16 h-24 md:w-32 md:h-48 bg-white rounded-lg flex flex-col justify-between p-2">
                        <div className="flex justify-between">
                            <div className={`text-${suit.type}`}>
                                <p className="text-xl font-bold">{rank.display}</p>
                            </div>
                            <div className={`text-${suit.type}`}>
                                <p className="text-xl font-thin">{suit.symbol}</p>
                            </div>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <div className={`absolute text-${suit.type} font-thin text-[5rem] leading-[1rem] md:text-9xl`}>{suit.symbol}</div>
                            <div className="absolute">
                                <div className={`hidden group-hover:block text-white font-bold text-sm leading-[1rem] md:text-md z-[20]`}>PLAY</div>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-between">
                            <div className={`text-${suit.type} rotate-180`}>
                                <p className="text-xl font-thin">{suit.symbol}</p>
                            </div>
                            <div className={`text-${suit.type} rotate-180`}>
                                <p className="text-xl font-bold">{rank.display}</p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-16 h-24 md:w-32 md:h-48 absolute rounded-md">
                        <Image draggable="false" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill src={cardBack} className={clsx(className, "rounded-md")} alt="reverse of playing card" />
                    </div>
                }
            </div>
        </motion.div>
    )
}
