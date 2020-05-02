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

export const createAndFillArray = <T>(length: number, value: T): T[] => {
    return new Array(length).fill(value);
};

export const makePluralIfCountIsNotOne = (count: number, singular: string, plural: string): string => {
    return count === 1 ? singular : plural;
};

export const convertDateToUnixTimestamp = (dateToConvert: Date): number => dateToConvert.getTime() / 1000 | 0;
