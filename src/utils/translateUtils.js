function ciEquals(a, b) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
}

function isLocaleSubstring(big, small) {
    if (small.length > big.length) {return false;}

    for (let i = 0; i <= big.length - small.length; i++) {
        let substringBig = big.substring(i, i + small.length);
        if (ciEquals(substringBig, small)) {
            return true;
        }
    }
    return false;
}

function strip(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function cleanHref(word) {
    return strip(word);
}

function getRightID(wordList, word, suggestion = {}, getValue, getID) {
    /**
     * getValue(word) => value of the word to compare
     * getID(word) => id of the word
     */

    for (let i = 0; i < wordList.length; i++) {
        let wikidataTitle = cleanHref(getValue(wordList[i]));
        if (isLocaleSubstring(wikidataTitle, word)) {

            if (i === 0) {
                suggestion.value = wordList.length > 1 ? getID(wordList[1]) : "";
            } else {
                suggestion.value = getID(wordList[0]);
            }
            return getID(wordList[i]);
        }
    }
    suggestion.value = wordList.length > 1 ? getID(wordList[1]) : "";
    return wordList.length > 0 ? getID(wordList[0]) : "";
}

function cleanParenthesis(word) {
    if (word.length === 0) {return word;}

    if (word[word.length - 1] !== ")") {return word;}

    let newWord = "";
    for(let i = 0; i < word.length; i++) {
        if (word[i] === "(") {break;}
        newWord += word[i];
    }
    return newWord;
}
export {cleanParenthesis, getRightID}