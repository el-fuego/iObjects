/**
 * Объект для работы с SessionStorage
 */
(function (window, root) {
    "use strict";

    var iSessionStorage = {
        _storage: window.sessionStorage,

        /**
         *
         * @returns {boolean}
         */
        isSupported: function () {
            return !!this._storage;
        },

        /**
         *
         * @param name
         * @param value
         * @returns {boolean}
         */
        "set": function (name, value) {
            if (!name || !this._storage) {
                return false;
            }

            this._storage.setItem(name, value);

            return !!this._storage.getItem(name);
        },

        /**
         *
         * @param name
         * @returns {*}
         */
        "get": function (name) {
            if (!name || !this._storage) {
                return null;
            }

            return this._storage.getItem(name);
        },

        /**
         *
         * @param name
         * @returns {boolean}
         */
        remove: function (name) {
            if (!name || !this._storage) {
                return false;
            }

            this._storage.removeItem(name);

            return true;
        },

        /**
         *
         * @returns {boolean}
         */
        clear: function () {
            if (!this._storage) {
                return false;
            }
            var item;

            for (item in this._storage) {
                if (this._storage.hasOwnProperty(item)) {
                    this._storage.removeItem(item);
                }
            }

            return true;
        }
    };

    (root || window).iSessionStorage = iSessionStorage;
}(window, this));
