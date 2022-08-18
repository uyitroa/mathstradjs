/**
 * Abstract class Translator
 *
 * @class Translator
 */

class Translator {

    constructor() {
        this.setResult = (x => {});
        this.setSuggestion = (x => {});
        if (this.constructor == Translator) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    translate(word, fromLang, toLang, setResult, setSuggestion) {
        throw new Error("Method translator() must be implemented");
    }


}

export default Translator;