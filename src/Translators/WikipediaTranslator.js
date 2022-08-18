import Translator from "./Translator";
import {API_WIKIPEDIA, mathsLang} from "../api";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParanthesis, getRightID} from "../utils/translateUtils";

class WikipediaTranslator extends Translator {
    constructor() {
        super();

        this.searchText = "";
        this.suggestedPageID = "";
        this.searchPageID = "";
        this.fromLang = "en";
        this.toLang = "fr";

        this.callbackSend = this.callbackSend.bind(this);
        this.callbackTranslate = this.callbackTranslate.bind(this);
        this.getTranslatedWord = this.getTranslatedWord.bind(this);
    }

    async translate(word, fromLang, toLang, setResult) {
        this.fromLang = fromLang;
        this.toLang = toLang;
        this.searchText = word;
        this.setResult = setResult;

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
            prop: "langlinks",
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

        let res = data["query"]["pages"][this.searchPageID]["langlinks"];
        let translatedWord = "";

        if (res === undefined) {
            if (this.suggestedPageID !== "") {
                this.searchPageID = this.suggestedPageID;
                this.suggestedPageID = "";
                this.getTranslatedWord();
                return;
            } else {
                translatedWord = this.searchText;
            }
        } else {
            translatedWord = res[0]["*"];
        }

        this.setResult(cleanParanthesis(translatedWord));
    }

}

export default WikipediaTranslator;