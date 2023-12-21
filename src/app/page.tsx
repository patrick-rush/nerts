"use client"
import { ranks, suits } from '@/constants/nerts'
import { motion } from 'framer-motion'
import { DisplayOnlyPlayingCard } from '@/components/DisplayOnlyPlayingCard'
import { SimpleLayout } from '@/components/SimpleLayout'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'

export default function Home() {
  "use client"
  const [createNew, setCreateNew] = useState(false)

  const deckMotion = {
    hover: {
      scale: 1.1, // Scales up the whole container
      transition: {
        duration: 0.8,
        ease: [0, 0.71, 0.2, 1.01],
      }

    }
  }

  const queenMotion = {
    rest: {
      rotate: 0
    },
    hover: {
      rotate: -6,
      x: -50 
    }
  }

  const kingMotion = {
    rest: {
      rotate: 0
    },
    hover: {
      rotate: 6,
      x: 50
    }

  }

  return (
    <SimpleLayout
      title='NERTS'
      intro='Nerts is a fast-paced, multi-player card game that combines the excitement of Solitaire with the competitive edge of a race. Players simultaneously build sequences of cards while trying to outmaneuver their opponents. It&apos;s a dynamic, energetic experience that tests your speed, strategy, and adaptability. Dive into Nerts, where quick thinking and a sharp eye can lead you to victory!'
    >
      {createNew ?
        <motion.div
          className="flex justify-center cursor-pointer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          exit={{ opacity: 0, scale: 0.1 }}
        >
          <form
            onSubmit={() => console.log("submit it!")}
            className="relative w-6/12 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
          >
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <span>Create a new game</span>
            </h2>
            <div className="mt-6 flex">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                aria-label="Your name"
                required
                className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button type="submit" variant="secondary" className="w-full order-last">
                Start
              </Button>
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                onClick={(event) => {
                  event.preventDefault()
                  setCreateNew(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>

        </motion.div>
        :
        <div id="cards" className="flex justify-center" onClick={() => setCreateNew(true)}>
          <motion.div
            initial="rest"
            whileHover="hover"
            variants={deckMotion}
            whileTap={{ scale: 1 }}
          >
            <motion.div
              id="king"
              className="flex justify-center"
              variants={kingMotion}
            >
              <DisplayOnlyPlayingCard
                className="mt-8"
                suit={suits[0]}
                rank={ranks[12]}
                isShowing
              />
            </motion.div>
            <motion.div
              id="queen"
              className="flex justify-center"
              variants={queenMotion}
            >
              <DisplayOnlyPlayingCard
                className="mt-8"
                suit={suits[2]}
                rank={ranks[11]}
                isShowing
              />
            </motion.div>
            <motion.div>

              <div id="ace" className="flex justify-center">
                <DisplayOnlyPlayingCard
                  className="mt-8"
                  suit={suits[3]}
                  rank={ranks[0]}
                  isShowing
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      }
    </SimpleLayout>
  )
}

/* 

          <div id="cards" className="flex justify-center" onClick={() => setCreateNew(true)}>
            <motion.div
              initial={{
                // Initial styles for the whole card container
              }}
              transition={{
                duration: 0.8,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              whileHover={{
                scale: 1.1, // Scales up the whole container
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                id="king"
                className="flex justify-center"
                initial={{ rotate: 0 }} // Starts hidden behind the ace
                whileHover={{ rotate: 6 }} // Rotates to the right when hovered
              >
                <DisplayOnlyPlayingCard
                  className="mt-8 left-2"
                  suit={suits[0]}
                  rank={ranks[12]}
                  isShowing
                />
              </motion.div>
              <motion.div
                id="queen"
                className="flex justify-center"
                initial={{ rotate: 0 }} // Starts hidden behind the ace
                whileHover={{ rotate: -6 }} // Rotates to the left when hovered
              >
                <DisplayOnlyPlayingCard
                  className="mt-8 right-2"
                  suit={suits[2]}
                  rank={ranks[11]}
                  isShowing
                />
              </motion.div>
              <div id="ace" className="flex justify-center">
                <DisplayOnlyPlayingCard
                  className="mt-8"
                  suit={suits[3]}
                  rank={ranks[0]}
                  isShowing
                />
              </div>
            </motion.div>
          </div>
*/