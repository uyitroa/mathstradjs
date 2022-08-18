import React from 'react';
import {httpGetAsync, getUrl} from './utils/httpUtils'
import TranslateField from "./components/TranslateField";
import SelectLanguage from "./components/SelectLanguage";
import './App.css';

// if first algorithm can't translate the word, then results[0] would be empty, so check result[1], then result[2] until it's not empty. Prioritize result[0], then result[1], then result[2], ...
function renderResult(results) {
    for (let i = 0; i < results.length; i++) {
        if (results[i] !== "" && results[i] !== undefined) {
            return results[i];
        }
    }
    return "";
}

export default function App () {
    const [results, setResults] = React.useState([]); // use multiple translate algorithm, get multiple results. List order of priority
    const [fromLang, setFromLang] = React.useState("en");
    const [toLang, setToLang] = React.useState("fr");

    return (
        <div>
            <h1>mathstradjs</h1>
            <h2>{renderResult(results)}</h2>
            <TranslateField fromLang={fromLang} toLang={toLang} setResults={setResults}/>
            <SelectLanguage lang={fromLang} setLang={setFromLang}/>
            <SelectLanguage lang={toLang} setLang={setToLang}/>
        </div>
    )
}

