export const MIN_NUMBER_OF_ROUNDS = 3;
export const MAX_NUMBER_OF_ROUNDS = 10;

export const ALPHABET_WITHOUT_QXY = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'
];

export const STANDARD_CATEGORIES = ['Stadt', 'Land', 'Fluss'];
export const AVAILABLE_CATEGORIES = [
    'Band/Musiker',
    'Berg/Gebirge',
    'Beruf',
    'Berühmte Person',
    'Buchtitel',
    'Chemisches Element',
    'Etwas Eckiges',
    'Etwas Rundes',
    'Fiktiver Charakter',
    'Film/Serie',
    'Getränk',
    'Grund für eine Verspätung',
    'Hobby',
    'Körperteil',
    'Krankheit',
    'Laster',
    'Marke',
    'Mordwaffe',
    'Pflanze',
    'Pizzasorte',
    'Religion',
    'Scheidungsgrund',
    'Schimpfwort',
    'Sehenswürdigkeit',
    'See/Meer',
    'Sex (Synonym)',
    'Speise',
    'Tier',
    'Unnötige Superkraft',
    'Videospiel',
    'Werkzeug',
    'Wort in einer Fremdsprache'
];

export enum GamePhase {
    waitingToStart = 'waitingToStart',
    fillOutTextfields = 'fillOutTextfields',
    evaluateRound = 'evaluateRound',
    gameResult = 'gameResult'
}

export const MIN_NUMBER_OF_PLAYERS = 2;

export const LETTER_ANIMATION_LETTER_COUNT = 5;
export const LETTER_ANIMATION_REDRAW_SPEED = 800;
