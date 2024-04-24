import { InsertOneResult, UpdateResult, DeleteResult, BulkWriteResult, FindOptions, Document, AnyBulkWriteOperation, UpdateOptions, DeleteOptions, InsertManyResult, FindOneAndUpdateOptions, ModifyResult, ClientSession, InsertOneOptions, BulkWriteOptions } from 'mongodb';
interface MongoOptions {
    includeDeleted?: boolean;
}
export default class MongoDBClient {
    private client;
    private dbName;
    private db;
    private session;
    constructor(dbName: string, url: string);
    connect(): Promise<void>;
    closeConnection(): void;
    createSession(): ClientSession;
    private _getCollection;
    private _buildQuery;
    insert(collectionName: string, data: Document, options: InsertOneOptions | undefined): Promise<InsertOneResult | undefined>;
    insertMany(collectionName: string, data: Document[], options: BulkWriteOptions | undefined): Promise<InsertManyResult | undefined>;
    findOne(collectionName: string, query?: object, options?: MongoOptions & FindOptions): Promise<Document | null>;
    find(collectionName: string, query?: object, options?: MongoOptions & FindOptions): Promise<Document[] | []>;
    updateMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    updateOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    findOneAndUpdate(collectionName: string, query: object, updateData: object, options: MongoOptions & FindOneAndUpdateOptions): Promise<ModifyResult | undefined>;
    modifyMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    modifyOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined>;
    deleteOne(collectionName: string, query: object, options: UpdateOptions | undefined): Promise<UpdateResult | undefined>;
    deleteMany(collectionName: string, query: object, options: UpdateOptions | undefined): Promise<UpdateResult | undefined>;
    permanentlyDeleteOne(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined>;
    permanentlyDeleteMany(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined>;
    bulkWrite(collectionName: string, operations: AnyBulkWriteOperation[], options: BulkWriteOptions | undefined): Promise<BulkWriteResult | undefined>;
}
export {};
