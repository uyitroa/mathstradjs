import React from 'react';
import {httpGetAsync, getUrl} from './utils/httpUtils'
import Translator from "./components/Translator";
import SelectLanguage from "./components/SelectLanguage";
import './App.css';

export default function App () {
    const [result, setResult] = React.useState("1");
    const [fromLang, setFromLang] = React.useState("en");
    const [toLang, setToLang] = React.useState("fr");

    return (
        <div>
            <h1>Hello world</h1>
            <h2>{result}</h2>
            <Translator fromLang={fromLang} toLang={toLang} setResult={setResult}/>
            <SelectLanguage lang={fromLang} setLang={setFromLang}/>
            <SelectLanguage lang={toLang} setLang={setToLang}/>
        </div>
    )
}
