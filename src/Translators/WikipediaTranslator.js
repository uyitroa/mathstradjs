import Translator from "./Translator";
import {API_WIKIPEDIA, mathsLang} from "../api";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParenthesis, getRightID} from "../utils/translateUtils";
import Item from "./Item";

class WikipediaTranslator extends Translator {
    constructor() {
        super();

        this.searchText = "";
        this.suggestedPageID = "";
        this.searchPageID = "";
        this.fromLang = "en";
        this.toLang = "fr";
        this.searchingSuggestion = false;

        this.callbackSend = this.callbackSend.bind(this);
        this.callbackTranslate = this.callbackTranslate.bind(this);
        this.getTranslatedWord = this.getTranslatedWord.bind(this);
    }

    async translate(word, fromLang, toLang, setResult, setSuggestion) {
        this.fromLang = fromLang;
        this.toLang = toLang;
        this.searchText = word;
        this.setResult = setResult;
        this.searchingSuggestion = false;
        this.setSuggestion = setSuggestion;

        let srsearchValue = this.searchText + " " + mathsLang[this.fromLang];
        let params = {
            action: "query",
            list: "search",
            format: "json",
            origin: "*",
            srwhat: "text",
            srlimit: "20",
            srsearch: srsearchValue
        };

        let api_url = "https://" + this.fromLang + API_WIKIPEDIA

        let url = getUrl(api_url, params);
        httpGetAsync(url, this.callbackSend);
    }

    callbackSend(response) {
        let data = JSON.parse(response);
        let suggestion = {};

        const wordList = data["query"]["search"];
        const getValue = (word => word["title"]);
        const getID = (word => word["pageid"]);
        this.searchPageID = getRightID(wordList, this.searchText, suggestion, getValue, getID);
        this.suggestedPageID = suggestion.value;
        this.getTranslatedWord();
    }

    getTranslatedWord() {
        let params = {
            action: "query",
            format: "json",
            prop: "langlinks|description",
            pageids: this.searchPageID,
            lllang: this.toLang,
            lllimit: "100",
            origin: "*",
        };

        let api_url = "https://" + this.fromLang + API_WIKIPEDIA;

        let url = getUrl(api_url, params);
        httpGetAsync(url, this.callbackTranslate);
    }

    callbackTranslate(response) {
        let data = JSON.parse(response);

        let translatedWord = new Item("", "");

        try {
            let res = data["query"]["pages"][this.searchPageID]["langlinks"];

            let desc = "";
            try {
                desc = data["query"]["pages"][this.searchPageID]["description"];
            } catch (e) {
                console.error(e, e.stack);
            }


            translatedWord = new Item(cleanParenthesis(res[0]["*"]), desc);
        } catch (e) {
            if (e instanceof TypeError) {
                console.error(e, e.stack);
            } else {
                throw e;
            }
        }

        if (!this.searchingSuggestion) {
            this.setResult(translatedWord);

            this.searchPageID = this.suggestedPageID;
            this.suggestedPageID = ""
            this.searchingSuggestion = true;
            this.getTranslatedWord();

        } else {
            this.setSuggestion(translatedWord);
            this.searchingSuggestion = false;
        }

    }

}

export default WikipediaTranslator;