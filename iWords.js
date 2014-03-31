(function (window, root) {
    "use strict";

    var _StemmerDist = {
        RVRE: /^(.*?[аеиоуыэюя])(.*)$/i,
        PERFECTIVEGROUND_1: /([ая])(в|вши|вшись)$/gi,
        PERFECTIVEGROUND_2: /(ив|ивши|ившись|ыв|ывши|ывшись)$/i,
        REFLEXIVE: /(с[яь])$/i,
        ADJECTIVE: /(ее|ие|ые|ое|ими|ыми|ей|ий|ый|ой|ем|им|ым|ом|его|ого|ему|ому|их|ых|ую|юю|ая|яя|ою|ею)$/i,
        PARTICIPLE_1: /([ая])(ем|нн|вш|ющ|щ)$/gi,
        PARTICIPLE_2: /(ивш|ывш|ующ)$/i,
        VERB_1: /([ая])(ла|на|ете|йте|ли|й|л|ем|н|ло|но|ет|ют|ны|ть|ешь|нно)$/gi,
        VERB_2: /(ила|ыла|ена|ейте|уйте|ите|или|ыли|ей|уй|ил|ыл|им|ым|ен|ило|ыло|ено|ят|ует|уют|ит|ыт|ены|ить|ыть|ишь|ую|ю)$/i,
        NOUN: /(а|ев|ов|ие|ье|е|иями|ями|ами|еи|ии|и|ией|ей|ой|ий|й|иям|ям|ием|ем|ам|ом|о|у|ах|иях|ях|ы|ь|ию|ью|ю|ия|ья|я)$/i,
        DERIVATIONAL: /.*[^аеиоуыэюя]+[аеиоуыэюя].*ость?$/i,
        DER: /ость?$/i,
        SUPERLATIVE: /(ейше|ейш)$/i,
        I: /и$/i,
        P: /ь$/i,
        NN: /нн$/i
    };

    var iWords = {
        /**
         *
         */
        twoLettersRegexp: /([а-яА-ЯїЇєЄёЁіІ])\1/,

        /**
         *
         * @param word
         * @returns {*}
         */
        stemmer: function (word) {
            word = word.replace(/ё/gi, 'e');
            var wParts = word.match(_StemmerDist.RVRE),
                start,
                rv,
                temp;

            if (!wParts) {
                return word.replace(this.twoLettersRegexp, "$1");
            }

            start = wParts[1];
            rv = wParts[2];
            temp = rv.replace(_StemmerDist.PERFECTIVEGROUND_2, '');

            if (temp == rv) {
                temp = rv.replace(_StemmerDist.PERFECTIVEGROUND_1, '$1');
            }

            if (temp == rv) {
                rv = rv.replace(_StemmerDist.REFLEXIVE, '');
                temp = rv.replace(_StemmerDist.ADJECTIVE, '');

                if (temp != rv) {
                    rv = temp;
                    temp = rv.replace(_StemmerDist.PARTICIPLE_2, '');
                    if (temp == rv) {
                        rv = rv.replace(_StemmerDist.PARTICIPLE_1, '$1');
                    }
                } else {
                    temp = rv.replace(_StemmerDist.VERB_2, '');
                    if (temp == rv) {
                        temp = rv.replace(_StemmerDist.VERB_1, '$1');
                    }
                    if (temp == rv) {
                        rv = rv.replace(_StemmerDist.NOUN, '');
                    } else {
                        rv = temp;
                    }
                }
            } else {
                rv = temp;
            }

            rv = rv.replace(_StemmerDist.I, '');

            if (rv.match(_StemmerDist.DERIVATIONAL)) {
                rv = rv.replace(_StemmerDist.DER, '');
            }

            temp = rv.replace(_StemmerDist.P, '');

            if (temp == rv) {
                rv = rv.replace(_StemmerDist.SUPERLATIVE, '');
                rv = rv.replace(_StemmerDist.NN, 'н');
            } else {
                rv = temp;
            }

            return (start + rv).replace(this.twoLettersRegexp, "$1");
        },

        /**
         *
         */
        _translitAlphabet: {
            'А': 'A',
            'а': 'a',
            'Б': 'B',
            'б': 'b',
            'В': 'V',
            'в': 'v',
            'Г': 'G',
            'г': 'g',
            'Д': 'D',
            'д': 'd',
            'Е': 'E',
            'е': 'e',
            'Ё': 'Yo',
            'ё': 'yo',
            'Ж': 'Zh',
            'ж': 'zh',
            'З': 'Z',
            'з': 'z',
            'И': 'I',
            'и': 'i',
            'Й': 'Y',
            'й': 'y',
            'К': 'K',
            'к': 'k',
            'Л': 'L',
            'л': 'l',
            'М': 'M',
            'м': 'm',
            'Н': 'N',
            'н': 'n',
            'О': 'O',
            'о': 'o',
            'П': 'P',
            'п': 'p',
            'Р': 'R',
            'р': 'r',
            'С': 'S',
            'с': 's',
            'Т': 'T',
            'т': 't',
            'У': 'U',
            'у': 'u',
            'Ф': 'F',
            'ф': 'f',
            'Х': 'Kh',
            'х': 'kh',
            'Ц': 'Ts',
            'ц': 'ts',
            'Ч': 'Ch',
            'ч': 'ch',
            'Ш': 'Sh',
            'ш': 'sh',
            'Щ': 'Sch',
            'щ': 'sch',
            'Ъ': '"',
            'ъ': '"',
            'Ы': 'Y',
            'ы': 'y',
            'Ь': "'",
            'ь': "'",
            'Э': 'E',
            'э': 'e',
            'Ю': 'Yu',
            'ю': 'yu',
            'Я': 'Ya',
            'я': 'ya'
        },

        /**
         *
         */
        _russianSymbolsAlphabet: {
            'q': 'й',
            'w': 'ц',
            'e': 'у',
            'r': 'к',
            't': 'е',
            'y': 'н',
            'u': 'г',
            'i': 'ш',
            'o': 'щ',
            'p': 'з',
            'a': 'ф',
            's': 'ы',
            'd': 'в',
            'f': 'а',
            'g': 'п',
            'h': 'р',
            'j': 'о',
            'k': 'л',
            'l': 'д',
            'z': 'я',
            'x': 'ч',
            'c': 'с',
            'v': 'м',
            'b': 'и',
            'n': 'т',
            'm': 'ь',
            ',': 'б',
            '.': 'ю',
            "'": 'э',
            ';': 'ж',
            '[': 'х',
            ']': 'ъ',
            '`': 'ё',
            'Q': 'Й',
            'W': 'Ц',
            'E': 'У',
            'R': 'К',
            'T': 'Е',
            'Y': 'Н',
            'U': 'Г',
            'I': 'Ш',
            'O': 'Щ',
            'P': 'З',
            'A': 'Ф',
            'S': 'Ы',
            'D': 'В',
            'F': 'А',
            'G': 'П',
            'H': 'Р',
            'J': 'О',
            'K': 'Л',
            'L': 'Д',
            'Z': 'Я',
            'X': 'Ч',
            'C': 'С',
            'V': 'М',
            'B': 'И',
            'N': 'Т',
            'M': 'Ь',
            '<': 'Б',
            '>': 'Ю',
            '"': 'Э',
            ':': 'Ж',
            '{': 'Х',
            '}': 'Ъ',
            '~': 'Ё'
        },

        /**
         *
         * @param str
         * @returns {string}
         */
        translit: function (str) {
            var translit = '',
                i;

            for (i = 0; i < str.length; i++) {
                translit += this._translitAlphabet[str[i]] || str[i];
            }

            return translit;
        },

        /**
         *
         * @param str
         * @returns {string}
         */
        toRussianKeyboard: function (str) {
            var russianSymbols = '',
                i;

            for (i = 0; i < str.length; i++) {
                russianSymbols += this._russianSymbolsAlphabet[str[i]] || str[i];
            }

            return russianSymbols;
        }
    };

    (root || window).iWords = iWords;
}(window, this));
