import React, { Component } from "react";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {getRightPageID} from "../utils/translateUtils";
import {API_WIKI} from "../api";

class Translator extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.searchText = "";
        this.suggestedPageID = "";
        this.searchPageID = "";

        this.fromLang = "en";
        this.toLang = "fr";
        this.api_url = "https://" + this.fromLang + API_WIKI
        this.maths_word = "mathematics"

        this.send = this.send.bind(this);
        this.callbackSend = this.callbackSend.bind(this);
        this.translate = this.translate.bind(this);
        this.callbackTranslate = this.callbackTranslate.bind(this);
    }

    send(event) {
        event.preventDefault();
        this.searchText = event.target.search.value;

        let srsearch_value = this.searchText + " " + this.maths_word;
        let params = {
            action: "query",
            list: "search",
            format: "json",
            origin: "*",
            srwhat: "text",
            srlimit: "20",
            srsearch: srsearch_value
        };

        let url = getUrl(this.api_url, params);
        httpGetAsync(url, this.callbackSend);
        this.inputRef.current.value = "";
    }

    callbackSend(response) {
        let data = JSON.parse(response);
        let suggestion = {};
        console.log(data);
        this.searchPageID = getRightPageID(data, this.searchText, suggestion);
        this.suggestedPageID = suggestion.value;
        this.translate();
    }

    translate() {
        let params = {
            action: "query",
            format: "json",
            prop: "langlinks",
            pageids: this.searchPageID,
            lllang: this.toLang,
            lllimit: "100",
            origin: "*",
        };

        let url = getUrl(this.api_url, params);
        httpGetAsync(url, this.callbackTranslate);
    }

    callbackTranslate(response) {
        let data = JSON.parse(response);
        console.log(data);

        let res = data["query"]["pages"][this.searchPageID]["langlinks"];
        let translated_word = "";

        if (res === undefined) {
            if (this.suggestedPageID !== "") {
                this.searchPageID = this.suggestedPageID;
                this.suggestedPageID = "";
                this.translate();
                return
            } else {
                translated_word = this.searchText;
            }
        } else {
            translated_word = res[0]["*"];
        }

        this.props.setFunc(translated_word);
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

export default Translator;