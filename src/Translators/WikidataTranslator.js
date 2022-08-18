import Translator from "./Translator";
import {API_WIKIDATA, mathsLang} from "../api";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParenthesis, getRightID} from "../utils/translateUtils";
import Item from "./Item";

class WikidataTranslator extends Translator {
    constructor() {
        super();

        this.searchText = "";
        this.toLang = "en";
        this.fromLang = "fr";

        this.searchID = "";
        this.suggestedID = "";
        this.searchingSuggestion = false;

        this.callbackSend = this.callbackSend.bind(this);
        this.getTranslatedWord = this.getTranslatedWord.bind(this);
        this.callbackTranslate = this.callbackTranslate.bind(this);
    }
    async translate(word, fromLang, toLang, setResult, setSuggestion) {
        this.searchText = word;
        this.toLang = toLang;
        this.fromLang = fromLang;
        this.setResult = setResult;
        this.searchingSuggestion = false;
        this.setSuggestion = setSuggestion;

        let srsearchValue = this.searchText + " " + mathsLang[this.fromLang];
        const params = {
            action: "query",
            list: "search",
            format: "json",
            srsearch: srsearchValue,
            srprop: "snippet|titlesnippet",
            origin: "*"
        };

        const url = getUrl(API_WIKIDATA, params);
        httpGetAsync(url, this.callbackSend);
    }

    callbackSend(response) {
        const data = JSON.parse(response);

        let suggestion = {};
        const wordList = data["query"]["search"];
        const getValue = (word => word["titlesnippet"]);
        const getID = (word => word["title"]);
        this.searchID = getRightID(wordList, this.searchText, suggestion, getValue, getID);
        this.suggestedID = suggestion.value;

        this.getTranslatedWord();
    }

    getTranslatedWord() {
        const params = {
            action: "wbgetentities",
            format: "json",
            ids: this.searchID,
            languages: this.toLang + "|" + this.fromLang,
            props: "labels|descriptions",
            origin: "*"
        };

        const url = getUrl(API_WIKIDATA, params);
        httpGetAsync(url, this.callbackTranslate);

    }

    callbackTranslate(response) {
        const data = JSON.parse(response);

        let translatedWord = new Item("", "");

        try {
            let res = data["entities"][this.searchID]["labels"][this.toLang];
            let desc = "";

            try {
                desc = data["entities"][this.searchID]["descriptions"][this.fromLang]["value"];
            } catch (e) {
                console.error(e, e.stack);
            }

            translatedWord = new Item(cleanParenthesis(res["value"]), desc);
        } catch (e) {
            if (e instanceof TypeError) {
                console.error(e, e.stack);
            } else {
                throw e;
            }
        }

        if (!this.searchingSuggestion) {
            this.setResult(translatedWord);

            this.searchingSuggestion = true;
            this.searchID = this.suggestedID;
            this.suggestedID = "";
            this.getTranslatedWord();
        } else {
            this.searchingSuggestion = false;
            this.setSuggestion(translatedWord);
        }
    }

}

export default WikidataTranslator;