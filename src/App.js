import React from 'react';
import {httpGetAsync, getUrl} from './utils/httpUtils'
import Translator from "./components/MainPage";
import './App.css';

export default function App () {
    const [result, setResult] = React.useState("1");

    return (
        <div>
            <h1>Hello world</h1>
            <h2>{result}</h2>
            <Translator text={result} setFunc={setResult}/>
        </div>
    )
}
