import Translator from "./Translator";
import {API_WIKI, mathsLang} from "../api";
import {getUrl, httpGetAsync} from "../utils/httpUtils";
import {cleanParanthesis, getRightPageID} from "../utils/translateUtils";

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

    translate(word, fromLang, toLang, setResult) {
        this.fromLang = fromLang;
        this.toLang = toLang;
        this.searchText = word;
        this.setResult = setResult;

        let srsearch_value = this.searchText + " " + mathsLang[this.fromLang];
        let params = {
            action: "query",
            list: "search",
            format: "json",
            origin: "*",
            srwhat: "text",
            srlimit: "20",
            srsearch: srsearch_value
        };

        let api_url = "https://" + this.fromLang + API_WIKI

        let url = getUrl(api_url, params);
        httpGetAsync(url, this.callbackSend);
    }

    callbackSend(response) {
        let data = JSON.parse(response);
        let suggestion = {};

        this.searchPageID = getRightPageID(data, this.searchText, suggestion);
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

        let api_url = "https://" + this.fromLang + API_WIKI;

        let url = getUrl(api_url, params);
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
                this.getTranslatedWord();
                return;
            } else {
                translated_word = this.searchText;
            }
        } else {
            translated_word = res[0]["*"];
        }

        this.setResult(cleanParanthesis(translated_word));
    }

}

export default WikipediaTranslator;