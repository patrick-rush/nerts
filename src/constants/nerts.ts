import type { Suit, RankDetails, Card } from '@/types/nerts'

export enum SuitName {
    Hearts = 'Hearts',
    Clubs = 'Clubs',
    Diamonds = 'Diamonds',
    Spades = 'Spades'
}

export enum SuitSymbol {
    Hearts = '♥',
    Clubs = '♣',
    Diamonds = '♦',
    Spades = '♠'
}

export enum SuitType {
    Red = 'red-800',
    Black = 'zinc-950'
}

export enum CardPosition {
    Ace = 1,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
}

export enum CardSource {
    River = 'river',
    Waste = 'waste',
    Nert = 'nertStack',
    Lake = 'lake',
    Stream = 'stream',
}

export const suits: Suit[] = Object.values(SuitName).map(suitName => ({
    name: suitName,
    symbol: SuitSymbol[suitName as keyof typeof SuitSymbol],
    type: (suitName === SuitName.Hearts || suitName === SuitName.Diamonds) ? SuitType.Red : SuitType.Black,
    color: (suitName === SuitName.Hearts || suitName === SuitName.Diamonds) ? SuitType.Red : SuitType.Black,
}));

export enum Rank {
    Ace = 'A',
    Two = '2',
    Three = '3',
    Four = '4',
    Five = '5',
    Six = '6',
    Seven = '7',
    Eight = '8',
    Nine = '9',
    Ten = '10',
    Jack = 'J',
    Queen = 'Q',
    King = 'K'
}

export const rankNames = {
    [Rank.Ace]: 'Ace',
    [Rank.Two]: 'Two',
    [Rank.Three]: 'Three',
    [Rank.Four]: 'Four',
    [Rank.Five]: 'Five',
    [Rank.Six]: 'Six',
    [Rank.Seven]: 'Seven',
    [Rank.Eight]: 'Eight',
    [Rank.Nine]: 'Nine',
    [Rank.Ten]: 'Ten',
    [Rank.Jack]: 'Jack',
    [Rank.Queen]: 'Queen',
    [Rank.King]: 'King',
};

export const ranks: RankDetails[] = Object.entries(Rank).map(([name, display], index) => ({
    display,
    name: rankNames[display],
    position: index + 1
}));

export const cardLookup: { [key: number]: Card} = {}

let i = 0
export const deck = suits.flatMap((suit): Card[] => {
    return ranks.map((rank) => {
        const value = {
            lookup: i,
            suit,
            rank,
        }
        cardLookup[i] = value
        i++
        return value
    })
})