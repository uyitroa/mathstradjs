import Translator from "./Translator";
import {API_WIKIDATA, mathsLang} from "../api";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParenthesis, getRightID} from "../utils/translateUtils";

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
            languages: this.toLang,
            props: "labels|descriptions",
            origin: "*"
        };

        const url = getUrl(API_WIKIDATA, params);
        httpGetAsync(url, this.callbackTranslate);

    }

    callbackTranslate(response) {
        const data = JSON.parse(response);

        let translatedWord = "";

        try {
            let res = data["entities"][this.searchID]["labels"][this.toLang];
            translatedWord = res["value"];
        } catch (e) {
            if (e instanceof TypeError) {

            } else {
                throw e;
            }
        }

        if (!this.searchingSuggestion) {
            this.setResult(cleanParenthesis(translatedWord));

            this.searchingSuggestion = true;
            this.searchID = this.suggestedID;
            this.suggestedID = "";
            this.getTranslatedWord();
        } else {
            this.searchingSuggestion = false;
            this.setSuggestion(cleanParenthesis(translatedWord));
        }
    }

}

export default WikidataTranslator;