import MongoDBClient from "../src";

// Mock MongoDB connection URL and database name for testing purposes
const testUrl = 'mongodb+srv://aniket:GxH86KPVdf9h4bnv@cluster0.jbgwsqz.mongodb.net/?retryWrites=true&w=majority';
const testDbName = 'testDb';
const testCollectionName = 'test_collection';

describe('MongoDBClient', () => {
  let client: MongoDBClient;

  beforeAll(async () => {
    client = new MongoDBClient(testDbName, testUrl);
    await client.connect();
  });

  afterAll(async () => {
    await client.permanentlyDeleteMany(testCollectionName, {}, { includeDeleted: true });
    client.closeConnection();
  });

  beforeEach(async () => {
    // Ensure the test collection is empty before each test
    await client.permanentlyDeleteMany(testCollectionName, {}, { includeDeleted: true });
  });

  it('should insert a document', async () => {
    const data = { name: 'John', age: 30 };
    const insertedId = await client.insert(testCollectionName, data);
    expect(insertedId).toBeDefined();
  });

  it('should find documents', async () => {
    // Insert some test data
    const testData = [
      { name: 'Alice', age: 28 },
      { name: 'Bob', age: 32 },
      { name: 'Charlie', age: 27 },
    ];
    await client.insertMany(testCollectionName, testData);

    const query = { age: { $gt: 25 } };
    const result = await client.find(testCollectionName, query);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Verify that the documents meet the criteria
    expect(result.every(doc => doc.age > 25)).toBe(true);
  });

  it('should not find a document that does not exist', async () => {
    const query = { name: 'Nonexistent' };
    const result = await client.find(testCollectionName, query);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should update many documents', async () => {
    const data = [{ name: 'John', age: 40 }, { name: 'Johny', age: 41 }];
    await client.insertMany(testCollectionName, data); // Insert some documents for delete test

    const query = { age: { $gt: 25 } };
    const updateData = { status: 'active' };
    const updateResult = await client.updateMany(testCollectionName, query, updateData);
    expect(updateResult).toBeDefined();

    // Verify that the updated documents have the correct status
    const updatedDocs = await client.find(testCollectionName, query);
    expect(updatedDocs.every(doc => doc.status === 'active')).toBe(true);
  });

  it('should update one document', async () => {
    const data = { name: 'John', age: 30 };
    await client.insert(testCollectionName, data); // Insert a document for update test

    const query = { name: 'John' };
    const updateData = { age: 31 };
    const updateResult = await client.updateOne(testCollectionName, query, updateData);
    expect(updateResult).toBeDefined();

    // Verify that the updated document has the correct age
    const updatedDoc = await client.find(testCollectionName, query);
    expect(updatedDoc[0].age).toBe(31);
  });

  it('should delete one document', async () => {
    const data = { name: 'John', age: 30 };
    await client.insert(testCollectionName, data); // Insert a document for delete test

    const query = { name: 'John' };
    const deleteResult = await client.deleteOne(testCollectionName, query);
    expect(deleteResult).toBeDefined();

    // Verify that the document has been deleted
    const deletedDoc = await client.find(testCollectionName, query);
    expect(deletedDoc.length).toBe(0);
  });

  it('should delete many documents', async () => {
    const data = [{ name: 'John', age: 40 }, { name: 'Johny', age: 41 }];
    await client.insertMany(testCollectionName, data); // Insert some documents for delete test

    const query = { age: { $gt: 35 } };
    const deleteResult = await client.deleteMany(testCollectionName, query);
    expect(deleteResult).toBeDefined();

    // Verify that all matching documents have been deleted
    // (Ensure they do not exist in the collection)
    const deletedDocs = await client.find(testCollectionName, query);
    expect(deletedDocs.length).toBe(0);
  });

  it('should permanently delete one document', async () => {
    const data = { name: 'John', age: 30 };
    await client.insert(testCollectionName, data); // Insert a document for permanently delete test

    const query = { name: 'John' };
    const deleteResult = await client.permanentlyDeleteOne(testCollectionName, query);
    expect(deleteResult).toBeDefined();

    // Verify that the document has been permanently deleted
    // (Ensure it does not exist in the collection)
    const deletedDoc = await client.find(testCollectionName, query);
    expect(deletedDoc.length).toBe(0);
  });

  it('should permanently delete many documents', async () => {
    const data = [{ name: 'John', age: 40 }, { name: 'Johny', age: 41 }];
    await client.insertMany(testCollectionName, data); // Insert some documents for delete test

    const query = { age: { $gt: 35 } };
    const deleteResult = await client.permanentlyDeleteMany(testCollectionName, query);
    expect(deleteResult).toBeDefined();

    // Verify that all matching documents have been permanently deleted
    // (Ensure they do not exist in the collection)
    const deletedDocs = await client.find(testCollectionName, query);
    expect(deletedDocs.length).toBe(0);
  });
});
