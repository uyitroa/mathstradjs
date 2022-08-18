import React from 'react';
import {httpGetAsync, getUrl} from './utils/httpUtils'
import TranslateField from "./components/TranslateField";
import SelectLanguage from "./components/SelectLanguage";
import Item from "./Translators/Item";
import './App.css';

// if first algorithm can't translate the word, then results[0] would be empty, so check result[1], then result[2] until it's not empty. Prioritize result[0], then result[1], then result[2], ...
function getResult(results) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].value !== "" && results[i].value !== undefined) {
            return results[i];
        }
    }
    return new Item("", "");
}

function getSuggestionFromResults(results) {
    let suggestions = [];
    let start = false;
    for (let i = 0; i < results.length; i++) {
        if (start) {
            if (results[i].value !== "" && results[i].value !== undefined) {
                suggestions.push(results[i]);
            }
            continue;
        }

        if (results[i].value !== "" && results[i].value !== undefined) {
            start = true;
        }
    }
    return suggestions;
}

export default function App () {

    /*
    results, suggestions are list of Translators.Item
    */
    const [results, setResults] = React.useState([]); // use multiple translate algorithm, get multiple results. List order of priority
    const [suggestions, setSuggestion] = React.useState([]);
    const [fromLang, setFromLang] = React.useState("en");
    const [toLang, setToLang] = React.useState("fr");

    return (
        <div>
            <h1>mathstradjs</h1>
            <h2>{getResult(results).value + ": " + getResult(results).description}</h2>
            {suggestions.map(val => (
                val.value !== "" && val.value !== undefined ? <h3>Suggestion: {val.value + ": " + val.description}</h3> : ""
            ))}
            
            {getSuggestionFromResults(results).map(val => (
                <h3>Suggestion: {val.value + ":: " + val.description}</h3>
            ))}
            <TranslateField fromLang={fromLang} toLang={toLang} setResults={setResults} setSuggestion={setSuggestion}/>
            <SelectLanguage lang={fromLang} setLang={setFromLang}/>
            <SelectLanguage lang={toLang} setLang={setToLang}/>
        </div>
    )
}

