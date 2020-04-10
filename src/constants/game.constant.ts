export const MIN_NUMBER_OF_ROUNDS = 3;
export const MAX_NUMBER_OF_ROUNDS = 10;

export const STANDARD_CATEGORIES = ['Stadt', 'Land', 'Fluss'];
export const AVAILABLE_CATEGORIES = [
    'Band/Musiker',
    'Beruf',
    'Berühmte Person',
    'Fiktiver Charakter',
    'Film/Serie',
    'Getränk',
    'Hobby',
    'Krankheit',
    'Laster',
    'Marke',
    'Mordwaffe',
    'Pflanze',
    'Scheidungsgrund',
    'Sehenswürdigkeit',
    'Speise',
    'Tier'
];

export enum GamePhase {
    waitingToStart = 'waitingToStart',
    fillOutTextfields = 'fillOutTextfields',
    evaluateRound = 'evaluateRound',
    gameResult = 'gameResult'
}
