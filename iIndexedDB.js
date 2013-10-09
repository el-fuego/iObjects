(function (window) {
    "use strict";

    /**
     * в ФФ window.indexedDB имеет только getter
     */
    if (!window.indexedDB) {
        window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    }

    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    window.iIndexedDB = {
        IDBTransaction: window.IDBTransaction || {}
    };

    /**
     * константы для поддержки "старых" браузеров
     * устанавливать нужно именно так, а не через ||, т.к. эти свойства в некоторых браузерах readOnly
     */
    if (window.iIndexedDB.IDBTransaction.READ_WRITE == null) {
        window.iIndexedDB.IDBTransaction.READ_WRITE = 'readwrite';
    }

    if (window.iIndexedDB.IDBTransaction.READ_ONLY == null) {
        window.iIndexedDB.IDBTransaction.READ_ONLY = 'readonly';
    }
}(window));