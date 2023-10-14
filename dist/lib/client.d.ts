import { InsertOneResult, UpdateResult, DeleteResult, BulkWriteResult, FindOptions, Document, AnyBulkWriteOperation, UpdateOptions, DeleteOptions, InsertManyResult } from 'mongodb';
interface MongoOptions {
    includeDeleted?: boolean;
}
export default class MongoDBClient {
    private client;
    private dbName;
    private db;
    constructor(dbName: string, url: string);
    connect(): Promise<void>;
    closeConnection(): void;
    private _getCollection;
    private _buildQuery;
    insert(collectionName: string, data: Document): Promise<InsertOneResult | undefined>;
    insertMany(collectionName: string, data: Document[]): Promise<InsertManyResult | undefined>;
    findOne(collectionName: string, query?: object, options?: MongoOptions & FindOptions): Promise<Document | null>;
    find(collectionName: string, query?: object, options?: MongoOptions & FindOptions): Promise<Document[] | []>;
    updateMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    updateOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    modifyMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    modifyOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    deleteOne(collectionName: string, query: object): Promise<UpdateResult | undefined>;
    deleteMany(collectionName: string, query: object): Promise<UpdateResult | undefined>;
    permanentlyDeleteOne(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined>;
    permanentlyDeleteMany(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined>;
    bulkWrite(collectionName: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult | undefined>;
}
export {};
