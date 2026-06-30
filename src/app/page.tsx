'use client'
import { ranks, suits } from '@/constants/nerts'
import { motion } from 'framer-motion'
import { DisplayOnlyPlayingCard } from '@/components/DisplayOnlyPlayingCard'
import { SimpleLayout } from '@/components/SimpleLayout'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { useRouter } from 'next/navigation'

export default function Home() {
  'use client'
  let router = useRouter()
  const [createNew, setCreateNew] = useState(false)
  const [hasGameCode, addGameCode] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(100)
  const [code, setCode] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const deckMotion = {
    rest: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.8,
        ease: [0, 0.71, 0.2, 1.01],
      },
    },
  }

  const queenMotion = {
    rest: {
      rotate: 0,
    },
    hover: {
      rotate: -6,
      x: -50,
    },
  }

  const kingMotion = {
    rest: {
      rotate: 0,
    },
    hover: {
      rotate: 6,
      x: 50,
    },
  }

  const handleJoinGame = async () => {
    try {
      const response = await fetch('api/join-game', {
        method: 'POST',
        body: JSON.stringify({
          name,
          code,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })

      if (response.status === 200) {
        const responseJson = await response.json()
        const gameCode = responseJson.body?.gameCode
        const playerId = responseJson.body?.playerId
        setCode(gameCode)
        setPlayerId(playerId)
        handleEnterGame()
      } else {
        const res = await response.text()
        console.log(res)
        throw Error('An error occurred while connecting to game.')
      }
    } catch (err) {
      console.log('Error', err)
    }
  }

  const handleCreateGame = async () => {
    try {
      const response = await fetch('api/create-game', {
        method: 'POST',
        body: JSON.stringify({
          name,
          code,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })

      if (response.status === 200) {
        const responseJson = await response.json()
        const gameCode = responseJson.body?.gameCode
        const playerId = responseJson.body?.playerId
        setCode(gameCode)
        setPlayerId(playerId)
      } else {
        const res = await response.text()
        console.log(res)
        throw Error('An error occurred while fetching a game code.')
      }
    } catch (err) {
      console.log('Error', err)
      throw err
    }
  }

  const handleEnterGame = () => {
    if (!code || !playerId) {
      throw Error('An error occurred while setting up game.')
    }

    router.push(`/nerts?code=${code}&player=${playerId}`)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    code ? handleJoinGame() : handleCreateGame()
  }

  const gameCreationForm = () => {
    return (
      <motion.div
        className="flex cursor-pointer justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        exit={{ opacity: 0, scale: 0.1 }}
      >
        <form
          onSubmit={handleSubmit}
          className="relative w-9/12 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 md:w-6/12"
        >
          <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <span>Create a new game</span>
          </h2>
          <div className="mt-6 flex">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              required
              className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant={goal === 0 ? 'primary' : 'secondary'}
              className="flex-1 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={hasGameCode}
              onClick={() => setGoal(0)}
            >
              One &amp; Done
            </Button>
            <Button
              type="button"
              variant={goal === 100 ? 'primary' : 'secondary'}
              className="flex-1 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={hasGameCode}
              onClick={() => setGoal(100)}
            >
              Play to 100
            </Button>
            <Button
              type="button"
              variant={goal === 500 ? 'primary' : 'secondary'}
              className="flex-1 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={hasGameCode}
              onClick={() => setGoal(500)}
            >
              Play to 500
            </Button>
          </div>
          <div className={`mt-6 flex ${!hasGameCode ? 'hidden' : null}`}>
            <input
              type="text"
              name="code"
              value={code}
              pattern="([0-9]){6}"
              required={hasGameCode}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Enter your game code"
              aria-label="Game code"
              className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10 sm:text-sm"
            />
          </div>
          <div className="mt-6">
            <Button
              hidden={hasGameCode}
              type="submit"
              variant="secondary"
              className={`w-full ${hasGameCode ? 'hidden' : null}`}
              onClick={(event) => {
                event.preventDefault()
                addGameCode(true)
              }}
            >
              Have A Game Code?
            </Button>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              type="submit"
              variant="secondary"
              className="order-last w-full"
            >
              {code ? 'Join Game' : 'Start New Game'}
            </Button>
            <Button
              hidden={!hasGameCode}
              type="submit"
              variant="secondary"
              className="w-full"
              onClick={(event) => {
                event.preventDefault()
                hasGameCode ? addGameCode(false) : setCreateNew(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    )
  }

  const cardDecoration = () => {
    return (
      <div
        id="cards"
        className="mt-12 flex h-48 justify-center"
        onClick={() => setCreateNew(true)}
      >
        <motion.div
          initial="rest"
          whileHover="hover"
          animate="animate"
          variants={deckMotion}
          whileTap={{ scale: 1 }}
        >
          <motion.div
            id="king"
            className="flex justify-center"
            variants={kingMotion}
          >
            <motion.div
              id="king"
              className="flex justify-center"
              variants={kingMotion}
            >
              <DisplayOnlyPlayingCard
                suit={suits[1]}
                rank={ranks[12]}
                isShowing
              />
            </motion.div>
            <DisplayOnlyPlayingCard
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
            <motion.div
              id="queen"
              className="flex justify-center"
              variants={queenMotion}
            >
              <DisplayOnlyPlayingCard
                suit={suits[1]}
                rank={ranks[11]}
                isShowing
              />
            </motion.div>
            <DisplayOnlyPlayingCard
              suit={suits[2]}
              rank={ranks[11]}
              isShowing
            />
          </motion.div>
          <motion.div>
            <div id="ace" className="flex justify-center">
              <DisplayOnlyPlayingCard
                suit={suits[3]}
                rank={ranks[0]}
                isShowing
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const gameInformation = () => {
    return (
      <motion.div
        className="flex cursor-pointer justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        exit={{ opacity: 0, scale: 0.1 }}
      >
        <div className="relative w-9/12 rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 md:w-6/12">
          <div className="relative h-12 w-full">
            <Button
              variant="secondary"
              onClick={handleCopyButtonClick}
              className="relative flex h-10 w-full items-center justify-center"
            >
              <span
                className={`absolute transition-opacity duration-300 ease-in-out ${
                  isCopied ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
              >
                Copy to Clipboard: {code}
              </span>
              <span
                className={`absolute transition-opacity duration-300 ease-in-out ${
                  isCopied ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              >
                Copied!
              </span>
            </Button>
          </div>
          <div className="mt-3">
            <Button
              variant="secondary"
              className={`w-full ${hasGameCode ? 'hidden' : null}`}
              onClick={(event) => {
                event.preventDefault()
                handleEnterGame()
              }}
            >
              Enter Game
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <SimpleLayout
      title="NƎRTS"
      intro="Nɘrts is a fast-paced, multi-player card game that combines the excitement of Solitaire with the competitive edge of a race. Players simultaneously build sequences of cards while trying to outmaneuver their opponents. It's a dynamic, energetic experience that tests your speed, strategy, and adaptability. Dive into Nɘrts, where quick thinking and a sharp eye can lead you to victory!"
    >
      {code && !hasGameCode
        ? gameInformation()
        : createNew
          ? gameCreationForm()
          : cardDecoration()}
    </SimpleLayout>
  )
}
