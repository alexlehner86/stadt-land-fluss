export const DEFAULT_NUMBER_OF_ROUNDS = 3;
export const MIN_NUMBER_OF_ROUNDS = 1;
export const MAX_NUMBER_OF_ROUNDS = 15;

export const ALPHABET_WITHOUT_QXY = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Z'
];

export const STANDARD_CATEGORIES = ['Stadt', 'Land', 'Fluss/Gewässer'];
export const AVAILABLE_CATEGORIES = [
    'Band/Musiker',
    'Berg/Gebirge',
    'Beruf',
    'Berühmte Person',
    'Buchtitel',
    'Chemisches Element',
    'Dinge die man jeden Tag macht',
    'Etwas Eckiges',
    'Etwas Rundes',
    'Fiktiver Charakter',
    'Film/Serie',
    'Getränk',
    'Grund für eine Verspätung',
    'Hobby',
    'In Zeiten von Corona verboten',
    'Könnte ein Trump-Tweet sein',
    'Körperteil',
    'Krankheit',
    'Laster',
    'Marke',
    'Mordwaffe',
    'Pflanze',
    'Pizzasorte',
    'Porno-Künstlername',
    'Religion',
    'Scheidungsgrund',
    'Schimpfwort',
    'See/Meer',
    'Sehenswürdigkeit',
    'Sex (Stellung, Synonym)',
    'Speise',
    'Tier',
    'Title of your Sex Tape',
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
