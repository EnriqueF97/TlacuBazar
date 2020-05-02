"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Store {
    constructor(store) {
        this.idStore = store.idStore;
        this.name = store.name;
        this.fkAddress = store.fkAddress;
        this.isServiceStore = store.isServiceStore;
        this.acceptsCacao = store.acceptsCacao;
    }
}
exports.Store = Store;
