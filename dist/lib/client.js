"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class MongoDBClient {
    constructor(dbName, url) {
        this.client = new mongodb_1.MongoClient(url);
        this.dbName = dbName;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.connect();
            this.db = this.client.db(this.dbName);
        });
    }
    closeConnection() {
        this.client.close();
        delete this.db;
    }
    createSession() {
        this.session = this.client.startSession();
        return this.session;
    }
    _getCollection(collectionName) {
        var _a;
        return (_a = this.db) === null || _a === void 0 ? void 0 : _a.collection(collectionName);
    }
    _buildQuery(query, options) {
        if (options && options.includeDeleted) {
            return query; // Include deleted documents without any modification
        }
        // Exclude deleted documents from the query
        const modifiedQuery = Object.assign(Object.assign({}, query), { deleted: { $ne: true } });
        return modifiedQuery;
    }
    insert(collectionName, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            return yield (collection === null || collection === void 0 ? void 0 : collection.insertOne(data, options));
        });
    }
    insertMany(collectionName, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            return yield (collection === null || collection === void 0 ? void 0 : collection.insertMany(data, options));
        });
    }
    findOne(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return collection ? yield collection.findOne(query || {}, options) : null;
        });
    }
    find(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return collection ? yield collection.find(query || {}).toArray() : [];
        });
    }
    updateMany(collectionName, query, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateMany(query, { $set: updateData }, options));
        });
    }
    updateOne(collectionName, query, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateOne(query, { $set: updateData }, options));
        });
    }
    findOneAndUpdate(collectionName, query, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.findOneAndUpdate(query, { $set: updateData }, options));
        });
    }
    modifyMany(collectionName, query, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateMany(query, updateData, options));
        });
    }
    modifyOne(collectionName, query, updateData, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateOne(query, updateData, options));
        });
    }
    deleteOne(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateOne(query, { $set: { deleted: true, deletedAt: Date.now() } }, options));
        });
    }
    deleteMany(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            return yield (collection === null || collection === void 0 ? void 0 : collection.updateMany(query, { $set: { deleted: true, deletedAt: Date.now() } }, options));
        });
    }
    permanentlyDeleteOne(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.deleteOne(query, options));
        });
    }
    permanentlyDeleteMany(collectionName, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            if (query)
                query = this._buildQuery(query, options);
            return yield (collection === null || collection === void 0 ? void 0 : collection.deleteMany(query, options));
        });
    }
    bulkWrite(collectionName, operations, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this._getCollection(collectionName);
            return yield (collection === null || collection === void 0 ? void 0 : collection.bulkWrite(operations, options));
        });
    }
}
exports.default = MongoDBClient;
