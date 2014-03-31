/**
 * Объект для работы с localStorage
 */
(function (window) {
    "use strict";

    window.iLocalStorage = {
        _storage: window.localStorage,

        isSupported: function () {
            return !!this._storage;
        },

        "set": function (name, value) {
            if (!name || !this._storage) {
                return false;
            }

            this._storage.setItem(name, value);

            return !!this._storage.getItem(name);
        },

        "get": function (name) {
            if (!name || !this._storage) {
                return null;
            }

            return this._storage.getItem(name);
        },

        remove: function (name) {
            if (!name || !this._storage) {
                return false;
            }

            this._storage.removeItem(name);

            return true;
        },

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
}(window));
