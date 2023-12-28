export interface Suit {
    name: SuitName;
    symbol: SuitSymbol;
    type: SuitType;
}

export interface RankDetails {
    display: string,
    name: string,
    position: number
}

export interface Card {
    lookup: number;
    suit: Suit;
    rank: RankDetails;
}

interface CommonPlayCardProps {
    card: Card;
}

type ConditionalPlayCardProps = | {
    source: CardSource.River;
    pileIndex: number;
    foundationIndex?: number | null;
} | {
    source: CardSource.Waste | CardSource.Nert;
    pileIndex?: never;
    foundationIndex?: never;
}

export type PlayCardProps = CommonPlayCardProps & ConditionalPlayCardProps

interface CommonDropCardProps {
    card: Card;
    cardRef: RefObject<HTMLDivElement>;
    source: CardSource;
}

type ConditionalDropCardProps = | {
    source: CardSource.River;
    pileIndex: number;
    foundationIndex?: number | null;
} | {
    source: CardSource.Waste | CardSource.Nert;
    pileIndex?: never;
    foundationIndex?: never;
}

export type DropCardProps = CommonDropCardProps & ConditionalDropCardProps

interface CommonHandleUpdateRiverProps {
    destination: number;
}

type ConditionalHandleUpdateRiverProps = | {
    source: CardSource.Nert | CardSource.Waste;
    sourceIndex?: never;
    start?: never;
} | {
    source: CardSource.River;
    sourceIndex: number;
    start?: number | null;
}

export type HandleUpdateRiverProps = CommonHandleUpdateRiverProps & ConditionalHandleUpdateRiverProps

export type GetSourceArrayProps = | {
    source: CardSource.River;
    pileIndex: number;
} | {
    source: CardSource.Nert | CardSource.Waste;
    pileIndex?: never;
}

export interface Player {
    name: string;
    id: string;
}