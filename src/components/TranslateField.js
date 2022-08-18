import React, { Component } from "react";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParenthesis, getRightPageID} from "../utils/translateUtils";
import {API_WIKIPEDIA, mathsLang} from "../api";
import WikipediaTranslator from "../Translators/WikipediaTranslator";
import WikidataTranslator from "../Translators/WikidataTranslator";

class TranslateField extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();

        this.searchText = "";

        this.translators = [new WikipediaTranslator(), new WikidataTranslator()]; // order of priority

        this.props.setResults(Array(this.translators.length).fill(undefined));
        this.props.setSuggestion(Array(this.translators.length).fill(""));

        this.send = this.send.bind(this);
    }

    send(event) {
        event.preventDefault();

        this.searchText = event.target.search.value;
        this.inputRef.current.value = "";
        this.runTranslators();
    }

    async runTranslators() {

        let result = this.searchText;

        for (let i = 0; i < this.translators.length; i++) {

            // set results[i] to i-th algorithm result
            const setResult = (result => {
                this.props.setResults(prevResult => prevResult.map((val, index, array) => index === i ? result : val));
            });

            const setSuggestion = (suggest => {
                this.props.setSuggestion(prevSuggestion =>
                    prevSuggestion.map((val, index, array) => index === i ? suggest : val));
            })
            this.translators[i].translate(this.searchText, this.props.fromLang, this.props.toLang, setResult, setSuggestion);
        }
    }


    render() {
        return (
            <form onSubmit={this.send}>
                <input name={"search"} placeholder={"Input something"} ref={this.inputRef}/>
                <button type={"submit"}>Send</button>
            </form>
        )

    }
}

export default TranslateField;