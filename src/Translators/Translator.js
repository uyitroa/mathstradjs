/**
 * Abstract class Translator
 *
 * @class Translator
 */

class Translator {

    constructor() {
        this.setResult = (x => {});

        if (this.constructor == Translator) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    translate(word, fromLang, toLang, setResult) {
        throw new Error("Method translator() must be implemented");
    }


}

export default Translator;