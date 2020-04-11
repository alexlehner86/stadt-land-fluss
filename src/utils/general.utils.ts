import randomnItem from 'random-item';

export const copyToClipboard = (text: string) => {
    const element = document.createElement('textarea');
    element.value = text;
    element.setAttribute('readonly', '');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
};

/**
* Returns an array of unique letters of the alphabet.
* The number of letters is defined by the parameter numberOfLetters (max: 26).
*/
export const getRandomnLetters = (numberOfLetters: number): string[] => {
    if (numberOfLetters > 26) {
        throw new Error('Cannot create more than 26 randomn unique letters of the alphabet!');
    }
    const randomnLetters: string[] = [];
    let alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    for (let i = 0; i < numberOfLetters; i++) {
        const randomnLetter = randomnItem(alphabet);
        randomnLetters.push(randomnLetter);
        alphabet = alphabet.filter(letter => letter !== randomnLetter);
    }
    return randomnLetters;
};

export const createAndFillArray = <T>(length: number, value: T): T[] => {
    return new Array(length).fill(value);
};
