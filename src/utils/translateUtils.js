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

function getRightPageID(data, word, suggestion = {}) {
    let wordList = data["query"]["search"];

    for (let i = 0; i < wordList.length; i++) {
        if (isLocaleSubstring(wordList[i]["title"], word)) {

            if (i === 0) {
                suggestion.value = wordList.length >= 1 ? wordList[1]["pageid"] : "";
            } else {
                suggestion.value = wordList[0]["pageid"];
            }
            return wordList[i]["pageid"];
        }
    }
    suggestion.value = wordList.length >= 1 ? wordList[1]["pageid"] : "";
    return wordList.length >= 0 ? wordList[0]["pageid"] : "";
}


function cleanParanthesis(word) {
    if (word.length === 0) {return word;}

    if (word[word.length - 1] !== ")") {return word;}

    let newWord = "";
    for(let i = 0; i < word.length; i++) {
        if (word[i] === "(") {break;}
        newWord += word[i];
    }
    return newWord;
}
export {getRightPageID, cleanParanthesis}