import { MongoClient, Db, Collection, InsertOneResult, UpdateResult, DeleteResult, BulkWriteResult, FindOptions, Document, AnyBulkWriteOperation, UpdateOptions, DeleteOptions } from 'mongodb';

type MongoOptions = {
  includeDeleted?: boolean;
}

export default class MongoDBClient {
  private client: MongoClient;
  private dbName: string;
  private db: Db | undefined;


  constructor(dbName: string, url: string) {
    this.client = new MongoClient(url);
    this.dbName = dbName;
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  closeConnection(): void {
    this.client.close();
    delete this.db;
  }

  getCollection(collectionName: string): Collection | undefined {
    return this.db?.collection(collectionName);
  }

  private _buildQuery(query: object, options?: MongoOptions): object {
    if (options && options.includeDeleted) {
      return query; // Include deleted documents without any modification
    }

    // Exclude deleted documents from the query
    const modifiedQuery = { ...query, deleted: { $ne: true } };
    return modifiedQuery;
  }

  async insert(collectionName: string, data: Document): Promise<InsertOneResult | undefined> {
    const collection = this.getCollection(collectionName);
    return await collection?.insertOne(data);
  }

  async find(collectionName: string, query?: object, options?: MongoOptions & FindOptions): Promise<Document[] | []> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return collection ? await collection.find(query || {}).toArray() : [];
  }

  async updateMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.updateMany(query, { $set: updateData }, options);
  }

  async updateOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.updateOne(query, { $set: updateData }, options);
  }

  async modifyMany(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.updateMany(query, updateData, options);
  }

  async modifyOne(collectionName: string, query: object, updateData: object, options?: MongoOptions & UpdateOptions): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.updateOne(query, updateData, options);
  }

  async deleteOne(collectionName: string, query: object): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    return await collection?.updateOne(query, { $set:{ deleted: true, deletedAt: Date.now() } });
  }

  async deleteMany(collectionName: string, query: object): Promise<UpdateResult | undefined> {
    const collection = this.getCollection(collectionName);
    return await collection?.updateMany(query, { $set:{ deleted: true, deletedAt: Date.now() } });
  }

  async permanentlyDeleteOne(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.deleteOne(query, options);
  }

  async permanentlyDeleteMany(collectionName: string, query: object, options?: MongoOptions & DeleteOptions): Promise<DeleteResult | undefined> {
    const collection = this.getCollection(collectionName);
    if(query)
      query = this._buildQuery(query, options);

    return await collection?.deleteMany(query, options);
  }

  async bulkWrite(collectionName: string, operations: AnyBulkWriteOperation[]): Promise<BulkWriteResult | undefined> {
    const collection = this.getCollection(collectionName);
    return await collection?.bulkWrite(operations);
  }
}
