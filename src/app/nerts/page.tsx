"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { suits, ranks, CardSource } from '@/constants/nerts'
import { Container } from '@/components/Container'
import { Lake } from '@/components/Lake'
import { Tableau } from '@/components/Tableau'
import { Stream } from '@/components/Stream'
import type { Card, PlayCardProps, DropCardProps, HandleUpdateRiverProps, GetSourceArrayProps } from '@/types/nerts.d'
import { LayoutGroup } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import { useSearchParams } from 'next/navigation'

interface Player {
    name: string;
    id: string;
}

export default function Nerts() {
    "use client"
    const searchParams = useSearchParams()
    const code = searchParams?.get("code")
    const playerId = searchParams?.get("player")
    const [players, setPlayers] = useState<Player[]>([])
    const [nertStack, setNertStack] = useState<Card[]>([])
    const [river, setRiver] = useState<Card[][]>([[], [], [], []])
    const [stream, setStream] = useState<Card[]>([])
    const [waste, setWaste] = useState<Card[]>([])
    const [lake, setLake] = useState<Card[][]>([])
    const [lastInLake, setLastInLake] = useState<{ player: Player | undefined, card: Card } | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [currentPlayer, setCurrentPlayer] = useState<Player>()
    const maxWasteShowing = useRef(0)
    const shuffle = (array: any[]) => array.sort(() => 0.5 - Math.random())
    const socket = io("http://localhost:3001/game")
    const deck = useMemo(() => suits.flatMap(suit => {
        return ranks.map(rank => {
            return {
                suit,
                rank,
            };
        });
    }), [])

    useEffect(() => {

        socket.on('connect', () => {
            console.log('>>> ws: connected')
            socket.emit('request_game')
        })

        socket.on('game_updated', (message: { data: string }) => {
            console.log('>>> ws: updated', message)
            updateGame(message.data)
        })

        socket.on('ping', (message: { data: string }) => {
            console.log('>>> ws: ping', message)
        })

        socket.on('disconnect', () => {
            console.log('>>> ws: disconnect')
            console.error('Ops, something went wrong')
        })

        socket.on('update_lake', (message: { data: string }) => {
            const updatedLake = JSON.parse(message.data)
            console.log(">>> updatedLake", updatedLake)
            setLake(updatedLake)
        })

        // Cleanup on component unmount
        return () => {
            socket.off('connect')
            socket.off('orders_updated')
            socket.off('disconnect')
            socket.close()
        }
    }, [])

    useEffect(() => {
        // Cleanup on component unmount
        return () => {
            socket.off('connect')
            socket.off('orders_updated')
            socket.off('disconnect')
            socket.close()
        }
    }, [])

    const updateGame = (message: string) => {
        console.log("Updating game:", message)
    }

    useEffect(() => {
        const fetchPlayers = async () => {
            if (code) {
                try {
                    const response = await fetch(`api/get-players?code=${code}`)
                    if (response.status === 200) {
                        const responseJson = await response.json()
                        setPlayers(responseJson.body?.players)
                    } else {
                        const res = await response.text()
                        console.log(res)
                        throw Error("An error occurred while retrieving players.")
                    }
                } catch (err) {
                    console.log("Error", err)
                    throw err
                }
            }
        }
        fetchPlayers()
        console.log("players", players)
    }, [code, playerId])

    useEffect(() => {
        const shuffledDeck: Card[] = shuffle(deck)
        setNertStack(shuffledDeck.splice(0, 13))
        setStream(shuffledDeck)
        setWaste([])
        setLake(Array.from({ length: 4 * players?.length }, () => []))
        setCurrentPlayer(players?.find(player => player.id === playerId))
        setRiver([
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
            shuffledDeck.splice(0, 1),
        ])
        console.log("players", players)
        maxWasteShowing.current = 0
    }, [deck, playerId, players])

    const wasteCards = useCallback(() => {
        if (gameOver) return

        const streamLength = stream.length
        let topOfStream

        if (stream.length >= 3) topOfStream = stream.splice(streamLength - 3).reverse()
        else topOfStream = stream.splice(0).reverse()

        if (topOfStream.length > 0) {
            const newWaste = [...waste, ...topOfStream]
            maxWasteShowing.current = newWaste.length
            setWaste(newWaste)
        } else {
            maxWasteShowing.current = 0
            setStream(waste.reverse())
            setWaste([])
        }
    }, [gameOver, stream, waste, maxWasteShowing, setWaste, setStream])

    const isCompatible = (boardArea: string, movingCard: Card, stationaryCard?: Card) => {
        switch (boardArea) {
            case CardSource.Lake:
                if (!stationaryCard) return movingCard.rank.position === 1
                const isOneMore = movingCard.rank.position - 1 === stationaryCard.rank.position
                const isSameSuit = movingCard.suit.name === stationaryCard.suit.name
                return isOneMore && isSameSuit
            case CardSource.River:
                if (!stationaryCard) return true
                const isOneLess = movingCard.rank.position + 1 === stationaryCard.rank.position
                const isOppositeSuit = movingCard.suit.type !== stationaryCard.suit.type
                return isOneLess && isOppositeSuit
            default:
                throw new Error("Target is not a valid dropzone.")
        }
    }

    const getSourceArray = useCallback((props: GetSourceArrayProps) => {
        const { source, pileIndex } = props
        switch (source) {
            case CardSource.Nert: return nertStack
            case CardSource.Waste: return waste
            case CardSource.River: return river[pileIndex!]
            default: throw new Error(`Invalid source: ${source}`)
        }
    }, [nertStack, river, waste])

    const handleUpdateRiver = ({
        destination,
        source,
        sourceIndex,
        start
    }: HandleUpdateRiverProps) => {
        const copyOfRiver = [...river]
        if (start != null && sourceIndex != null) {
            copyOfRiver[destination].push(...copyOfRiver[sourceIndex!].splice(start, copyOfRiver[sourceIndex!].length))
        } else {
            const props: { source: CardSource.Nert | CardSource.Waste | CardSource.River; pileIndex?: number; } = { source }
            if (source === CardSource.River) props.pileIndex = sourceIndex
            let sourceArray = getSourceArray(props as GetSourceArrayProps)
            const cardToMove = sourceArray.pop()
            if (cardToMove) copyOfRiver[destination].push(cardToMove)
        }
        setRiver(copyOfRiver)
        return true
    }

    const handleUpdateLake = ({
        destination,
        source,
        sourceIndex,
    }: {
        destination: number;
        source: CardSource.Nert | CardSource.Waste | CardSource.River;
        sourceIndex?: number;
    }) => {
        let sourceArray
        if (source === CardSource.River) sourceArray = getSourceArray({ source, pileIndex: sourceIndex! })
        else sourceArray = getSourceArray({ source })
        if (!sourceArray) return false
        const copyOfLake = [...lake]
        const cardToMove = sourceArray.pop()
        if (cardToMove) {
            socket.emit('add_to_lake', { code, playerId, cardToMove, destination })
            copyOfLake[destination].push(cardToMove)
            setLastInLake({ player: currentPlayer, card: cardToMove })
        }
        setLake(copyOfLake)
        return true
    }

    // GAME OVER
    const endGame = () => {
        setGameOver(true)
        window.alert("GAME OVER")
    }

    const playCard = (props: PlayCardProps) => {
        if (gameOver) return

        const { card, source, pileIndex, foundationIndex } = props

        const tryToPlaceInLake = () => {
            return lake.some((pile, i) => {
                if (pile.length === 0) return false

                if (isCompatible(CardSource.Lake, card, pile[pile.length - 1])) return handleUpdateLake({ destination: i, source, sourceIndex: pileIndex })
                else return false
            })
        }

        const tryToPlaceInRiver = (start?: number) => {

            const placeCard = (index: number) => {
                if (source === CardSource.River) return handleUpdateRiver({ destination: index, source, sourceIndex: pileIndex!, start })
                else return handleUpdateRiver({ destination: index, source, sourceIndex: pileIndex })
            }

            const tryToPlaceOnPile = () => {
                return river.some((pile, i) => {
                    if (i === pileIndex || pile.length === 0) return false

                    if (isCompatible(CardSource.River, card, pile[pile.length - 1])) return placeCard(i)
                    else return false
                })
            }

            const tryToPlaceOnBlank = () => {
                return river.some((pile, i) => {
                    if (i === pileIndex || pile.length !== 0) return

                    return placeCard(i)
                })
            }

            return tryToPlaceOnPile() || tryToPlaceOnBlank()

        }

        let cardHandled = false

        /* handle aces */
        if (card?.rank.position === 1) {
            cardHandled = handleUpdateLake({ destination: lake.findIndex(pile => !pile.length), source, sourceIndex: pileIndex })
            if (cardHandled) return true
        }

        /* try river */
        if (source === CardSource.River) {
            const isFoundationCard = foundationIndex != null
            const start = isFoundationCard ? foundationIndex : river[pileIndex!].length - 1

            if (!isFoundationCard) {
                cardHandled = tryToPlaceInLake()
                if (cardHandled) return true
            }

            cardHandled = tryToPlaceInRiver(start)
            if (cardHandled) return true

            /* try lake */
        } else {
            cardHandled = tryToPlaceInLake()
            if (cardHandled) return true
            cardHandled = tryToPlaceInRiver()
            if (cardHandled) return true
        }

        /* unable to place card */
        return false
    }

    const dropCard = ({ card, cardRef, source, pileIndex, foundationIndex }: DropCardProps) => {

        interface Target {
            pile: Card[];
            location: string;
            index: number;
        }

        const determineDestination = (ref: HTMLDivElement) => {
            if (!ref) {
                console.error("Card reference does not exist.")
                throw new Error("cardRef has no current value or current value is incompatible")
            }

            const { bottom, top, right, left, height } = ref.getBoundingClientRect()
            let target: Target | null = null

            const findTarget = (repetitions: number, piles: Card[][], location: string): Target | null => {
                for (let i = 0; i < repetitions; i++) {
                    const values = document.getElementById(`${location}-${i}`)?.getBoundingClientRect()
                    let offset = 10
                    if (location === CardSource.River) offset = (river[i].length * (height / 5)) + 10
                    if (values && left < values.right + 10 && right > values.left - 10 && top < values.bottom + offset && bottom > values.top - 10) {
                        return {
                            pile: piles[i],
                            location: location,
                            index: i,
                        }
                    }
                }
                return null
            }

            target = findTarget(4 * players?.length, lake, CardSource.Lake)

            if (!target) target = findTarget(4, river, CardSource.River)

            console.log(">>> target", target)
            return target
        }

        let destination
        try {
            if (cardRef?.current) destination = determineDestination(cardRef.current)
            if (!destination) return
        } catch (err) {
            console.info(err)
            return
        }

        let compatible
        try {
            const topCard = destination.pile[destination.pile.length - 1]
            compatible = isCompatible(destination.location, card, topCard)
            if (!compatible) return
        } catch (err) {
            console.info(err)
            return
        }

        try {
            if (destination.location === CardSource.Lake) handleUpdateLake({ destination: destination.index, source, sourceIndex: pileIndex })
            if (destination.location === CardSource.River) {
                if (source === CardSource.River) handleUpdateRiver({ destination: destination.index, source, sourceIndex: pileIndex!, start: foundationIndex })
                else handleUpdateRiver({ destination: destination.index, source })
            }
        } catch (err) {
            console.info(err)
            return
        }
    }

    /* board */
    return (
        <Container className="flex h-full items-center pt-8" >
            <LayoutGroup >
                <div className="rounded-2xl sm:border sm:border-zinc-100 sm:p-8 sm:dark:border-zinc-700/40">
                    {/* lake */}
                    <Lake numberOfPlayers={players?.length} lake={lake} lastInLake={lastInLake} />
                    {/* tableau */}
                    <Tableau river={river} nertStack={nertStack} playCard={playCard} endGame={endGame} onDragEnd={dropCard} />
                    {/* stream & waste */}
                    <Stream stream={stream} waste={waste} maxWasteShowing={maxWasteShowing} playCard={playCard} endGame={endGame} wasteCards={wasteCards} nertStack={nertStack} onDragEnd={dropCard} />
                </div>
            </LayoutGroup>
        </Container>
    )
}