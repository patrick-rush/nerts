'use client'
import clsx from 'clsx'
import Image from 'next/image'
import cardBack from '@/images/photos/ketchikan.jpeg'
import React, {
  ForwardRefRenderFunction,
  RefObject,
  forwardRef,
  useRef,
  useState,
} from 'react'
import type { RankDetails, Suit } from '@/types/nerts'
import { motion } from 'framer-motion'

type PlayingCardProps = {
  className?: string
  suit?: Suit
  rank?: RankDetails
  isShowing: boolean
  draggable?: boolean
  style?: any
  onClick?: () => void
  onDragStart?: () => void
  onDragEnd?: (cardRef: RefObject<HTMLDivElement>) => void
  onPointerEnter?: () => void
  onPointerLeave?: () => void
}

const PlayingCardComponent: ForwardRefRenderFunction<
  HTMLDivElement,
  PlayingCardProps
> = (props, ref) => {
  'use client'
  const {
    className,
    suit,
    rank,
    isShowing,
    draggable = false,
    style,
    onClick,
    onDragStart,
    onDragEnd,
    onPointerEnter,
    onPointerLeave,
  } = props
  const [wasDragged, setWasDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDragStart = () => {
    onDragStart?.()
    setWasDragged(true)
  }

  const handleDragEnd = () => {
    onDragEnd?.(cardRef)
    setWasDragged(false)
  }

  return (
    <motion.div
      className={clsx(className, `z-1000 absolute`)}
      drag={draggable}
      style={style}
      dragElastic={1}
      dragSnapToOrigin
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      transition={{
        ease: 'easeInOut',
        duration: 1,
      }}
      onClick={() => (wasDragged ? null : onClick?.())}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      ref={ref || cardRef}
    >
      <div className="group relative flex select-none flex-col items-start">
        <div hidden className="border-0 text-red-800 text-zinc-950"></div>
        {/* {children} */}
        {isShowing ? (
          <div className="flex h-24 w-16 flex-col justify-between rounded-md bg-white p-2 md:h-36 md:w-24">
            <div className="flex justify-between">
              <div className={`text-${suit?.type}`}>
                <p className="text-lg font-bold">{rank?.display}</p>
              </div>
              <div className={`text-${suit?.type}`}>
                <p className="text-lg font-thin">{suit?.symbol}</p>
              </div>
            </div>
            <div className="flex flex-grow items-center justify-center">
              <div
                className={`absolute text-${suit?.type} font-thin ${suit?.name === 'Spades' && rank?.position === 1 ? 'text-[5rem] leading-[1rem] md:text-8xl' : 'text-5xl'}`}
              >
                {suit?.symbol}
              </div>
            </div>
            <div className="hidden justify-between md:flex">
              <div className={`text-${suit?.type} rotate-180`}>
                <p className="text-lg font-thin">{suit?.symbol}</p>
              </div>
              <div className={`text-${suit?.type} rotate-180`}>
                <p className="text-lg font-bold">{rank?.display}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute h-24 w-16 rounded-md md:h-36 md:w-24">
            <Image
              draggable="false"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              src={cardBack}
              className={clsx(className, 'rounded-md')}
              alt="reverse of playing card"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export const PlayingCard = forwardRef<HTMLDivElement, PlayingCardProps>(
  PlayingCardComponent,
)
