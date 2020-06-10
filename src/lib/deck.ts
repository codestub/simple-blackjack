export enum Suit {
  SPADES = 'spades',
  CLUBS = 'clubs',
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
}

export type Rank = {
  type: string;
  value: number;
}

export type Card = Rank & {
  suit: Suit;
};

const ranks: Rank[] = [
  {
    type: '2',
    value: 2,
  },
  {
    type: '3',
    value: 3,
  },
  {
    type: '4',
    value: 4,
  },
  {
    type: '5',
    value: 5,
  },
  {
    type: '6',
    value: 6,
  },
  {
    type: '7',
    value: 7,
  },
  {
    type: '8',
    value: 8,
  },
  {
    type: '9',
    value: 9,
  },
  {
    type: '10',
    value: 10,
  },
  {
    type: 'Jack',
    value: 10,
  },
  {
    type: 'Queen',
    value: 10,
  },
  {
    type: 'King',
    value: 10,
  },
  {
    type: 'Ace',
    value: 11,
  },
];

export const deck: Card[] = Object.values(Suit).reduce((acc, suit) => {
  const cards: Card[] = ranks.map((item): Card => ({
    ...item,
    suit,
  }));
  return acc.concat(cards);
}, <Card[]>[]);
