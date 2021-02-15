const EasyTable = require('easy-table');
const fs = require('fs');
const { compose, filter, map, seq } = require('transducers.js');

main();

function main() {
    const { letterCount, wordPattern, availableLetters } = grabArgs(process.argv);
    const frWords = getFrDictionary();
    const found = findWords(frWords, availableLetters, letterCount, wordPattern);
    showWords(found, frWords.length);
}

function grabArgs(argv) {
    const [,,letterCountOrPatternStr,availableLettersStr] = argv;
    let letterCount = parseInt(letterCountOrPatternStr);
    let wordPattern;
    if (isNaN(letterCount)) {
        wordPattern = new RegExp('^' + letterCountOrPatternStr.replaceAll('_','.') + '$');
        letterCount = letterCountOrPatternStr.length;
    }
    const availableLetters = lowerCaseSort(availableLettersStr);
    return { letterCount, wordPattern, availableLetters };
}

function getFrDictionary() {
    const frFile = fs.readFileSync('./assets/fr.txt');
    return frFile.toString().split('\n');
}

function findWords(dictionary, availableLetters, letterCount, wordPattern) {
    return seq(dictionary, compose(
        filter(s => s.length === letterCount),
        filter(s => wordPattern === undefined || s.match(wordPattern)),
        map(s => ({ word: s, letters: lowerCaseSort(s) })),
        filter(({ letters }) => includesAllLetters(availableLetters, letters)),
        pluck('word'),
    ));
}

function lowerCaseSort(word) {
    return word
        .toLocaleLowerCase()
        .replaceAll('é', 'e')
        .replaceAll('è', 'e')
        .replaceAll('ê', 'e')
        .replaceAll('î', 'i')
        .replaceAll('à', 'a')
        .replaceAll('ô', 'o')
        .split('')
        .sort();
}

function includesAllLetters(availableLetters, letters) {
    const available = [...availableLetters];
    for (const l of letters) {
        const indexOfLetter = available.indexOf(l);
        if (indexOfLetter === -1) {
            return false;
        } else {
            available.splice(indexOfLetter,1);
        }
    }
    return true;
}

function pluck(key) {
    return map(obj => obj[key]);
}

function showWords(words, dictionaryLengh) {
    console.log(`Found ${words.length} from ${dictionaryLengh} words\n`);
    const wordByColumn = 10;
    const table = new EasyTable();
    let start = 0;
    while (start < words.length) {
        const nextWords = words.slice(start, start+wordByColumn);
        nextWords.forEach((w, index) => table.cell(index, w));
        table.newRow();
        start += wordByColumn;
    }
    console.log(table.printTransposed({ namePrinter: () => '' }));
}