(function (root, undefined) {
    "use strict";

    /**
     * @author Knyazevich Denis, Pulyaev Yuriy
     * Currency Parser|normalizator
     * use:        a = new ICurrency('$'), a = new ICurrency('EUR'), a = new ICurrency('гривен')
     * a.toString()
     * @param curr
     * @constructor
     * @return {*}
     */
    var ICurrency = function (curr) {

        if (!curr) {

            return this;
        }

        if (curr instanceof ICurrency) {
            this.value = curr.value;
            return this;
        }

        /**
         * search currency
         * @type {String}
         */
        var c = curr.toUpperCase(),
            i;

        for (i in this.currencyList) {
            if (this.currencyList.hasOwnProperty(i) && this.currencyList[i].test(c)) {
                this.value = i;
                break;
            }
        }
    };

    /**
     *
     * @type {*}
     */
    ICurrency.prototype = {
        value: 'UAH',
        currencyList: {
            'UAH': /UAH|ГРН|ГРИВЕ?Н|₴|980|0?99/,
            'USD': /USD|ДОЛЛ?|\$|840/,
            'EUR': /EUR|ЕВРО|€|978/,
            'RUB': /RU[BR]|РУБ|810|643/,
            'XAU': /XAU|ЗОЛОТ|959/,
            'BYR': /BYR|РУБ|BR|974/, // белорусские рубли
            'GEL': /GEL|ЛАРИ|LARI|ლ|981/, // грузинские лари
            'LTL': /LTL|ЛИТ|LT|440/, // литовские литы
            'PLZ': /PLZ|ЗЛОТ|ZŁ|616/, // польские злотые (старое обозначение)
            'PLN': /PLN|ЗЛОТ|ZŁ|985/, // польские злотые
            'HRK': /HRK|КУН|KN|191/, // хорватские куны
            'LVL': /LVL|ЛАТ|LS|428/, // латышские латы
            'BGN': /BGN|ЛЕ?В|975/,  // болгарские левы
            'MDL': /MDL|ЛЕ[ЙИ]|LEI|498/, // молдавские леи
            'RON': /RON|ЛЕ[ЙИ]|LEI|946/, // румынские леи
            'TRY': /TRY|ЛИР|£|₤|Y?[^L]TL|949/, // турецкие лиры
            'KPW': /KPW|ВОН|₩|408/, // севернокорейские воны
            'KRW': /KRW|ВОН|₩|410/, // южнокорейские воны
            'THB': /THB|БАТ|฿|764/, // тайландские баты
            'RSD': /RSD|ДИНАР|941/, // сербские динары
            'TND': /TND|ДИНАР|788/, // тунисские динары
            'AED': /AED|ДИХРАМ|784/, // ОАЭ дирхамы
            'AUD': /AUD|ДОЛЛ?|036/, // австралийские доллары
            'HKD': /HKD|ДОЛЛ?|344/, // гонконгские доллары
            'CAD': /CAD|ДОЛЛ?|124/, // канадские доллары
            'JPY': /JPY|ИЕН|¥|392/, // японские иены
            'CNY': /CNY|ЮАНЬ?|¥|156/, // китайские юани
            'CZK': /CZK|КРОН|Kč|203/, // чешские кроны
            'DKK': /DKK|КРОН|KR|208/, // датские кроны
            'MXN': /MXN|ПЕСО|\$|484/, // мексиканские песо
            "AFN": (/AFN/),
            "ALL": (/ALL/),
            "AMD": (/AMD/),
            "ANG": (/ANG/),
            "AOA": (/AOA/),
            "ARS": (/ARS/),
            "AZN": (/AZN/),
            "BAM": (/BAM/),
            "BBD": (/BBD/),
            "BDT": (/BDT/),
            "BHD": (/BHD/),
            "BIF": (/BIF/),
            "BMD": (/BMD/),
            "BND": (/BND/),
            "BOB": (/BOB/),
            "BRL": (/BRL/),
            "BSD": (/BSD/),
            "BTN": (/BTN/),
            "BWP": (/BWP/),
            "BZD": (/BZD/),
            "CHF": (/CHF/),
            "CLP": (/CLP/),
            "COP": (/COP/),
            "CRC": (/CRC/),
            "CVE": (/CVE/),
            "DJF": (/DJF/),
            "DOP": (/DOP/),
            "DZD": (/DZD/),
            "EEK": (/EEK/),
            "EGP": (/EGP/),
            "ERN": (/ERN/),
            "ETB": (/ETB/),
            "FJD": (/FJD/),
            "GBP": (/GBP/),
            "GHS": (/GHS/),
            "GMD": (/GMD/),
            "GNF": (/GNF/),
            "GTQ": (/GTQ/),
            "GYD": (/GYD/),
            "HNL": (/HNL/),
            "HTG": (/HTG/),
            "HUF": (/HUF/),
            "IDR": (/IDR/),
            "ILS": (/ILS/),
            "INR": (/INR/),
            "JMD": (/JMD/),
            "JOD": (/JOD/),
            "KES": (/KES/),
            "KGS": (/KGS/),
            "KHR": (/KHR/),
            "KMF": (/KMF/),
            "KWD": (/KWD/),
            "KYD": (/KYD/),
            "KZT": (/KZT/),
            "LAK": (/LAK/),
            "LBP": (/LBP/),
            "LKR": (/LKR/),
            "LSL": (/LSL/),
            "LYD": (/LYD/),
            "MAD": (/MAD/),
            "MGA": (/MGA/),
            "MKD": (/MKD/),
            "MMK": (/MMK/),
            "MNT": (/MNT/),
            "MOP": (/MOP/),
            "MRO": (/MRO/),
            "MUR": (/MUR/),
            "MVR": (/MVR/),
            "MWK": (/MWK/),
            "MYR": (/MYR/),
            "NAD": (/NAD/),
            "NIO": (/NIO/),
            "NOK": (/NOK/),
            "NPR": (/NPR/),
            "NZD": (/NZD/),
            "OMR": (/OMR/),
            "PAB": (/PAB/),
            "PEN": (/PEN/),
            "PGK": (/PGK/),
            "PHP": (/PHP/),
            "PKR": (/PKR/),
            "PYG": (/PYG/),
            "QAR": (/QAR/),
            "RWF": (/RWF/),
            "SAR": (/SAR/),
            "SBD": (/SBD/),
            "SCR": (/SCR/),
            "SEK": (/SEK/),
            "SGD": (/SGD/),
            "SLL": (/SLL/),
            "SRD": (/SRD/),
            "STD": (/STD/),
            "SZL": (/SZL/),
            "TJS": (/TJS/),
            "TMT": (/TMT/),
            "TOP": (/TOP/),
            "TTD": (/TTD/),
            "TWD": (/TWD/),
            "TZS": (/TZS/),
            "UGX": (/UGX/),
            "UYU": (/UYU/),
            "UZS": (/UZS/),
            "VND": (/VND/),
            "VUV": (/VUV/),
            "WST": (/WST/),
            "XAF": (/XAF/),
            "XCD": (/XCD/),
            "XOF": (/XOF/),
            "XPF": (/XPF/),
            "YER": (/YER/),
            "ZAR": (/ZAR/),
            "ZMK": (/ZMK/),
            'л А-95 Energy': /(АИ)?[ \-]?98|098/,
            'л А-95': /(АИ)?[ \-]?95|095/,
            'л А-92': /(АИ)?[ \-]?92|092/,
            'л А-80': /(АИ)?[ \-]?80|080/,
            'л А-76': /(АИ)?[ \-]?76|076/,
            'л ДТ Energy': /ДТ(\s+Energy)?|0?91/i,
            'л ДТ Евро': /ДТ\s*Евро|0?90/i,
            'л Газа': /0?30/,
            'л E-95 S': /0?94/
        },

        /**
         *
         * @param curr
         * @returns {boolean}
         */
        is: function (curr) {
            return this.value === (new ICurrency(curr)).value;
        },

        /**
         *
         * @returns {String}
         */
        toString: function () {
            return this.value;
        },

        /**
         *
         * @returns {string}
         */
        toHtml: function () {
            return "<span>" + this.toString() + "</span>";
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = ICurrency;
    } else {
        root.ICurrency = ICurrency;
    }
}(this));