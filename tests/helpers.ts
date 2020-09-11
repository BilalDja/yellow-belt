import mongoose from 'mongoose';

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const collectionName in collections) {
    const currentCollection = collections[collectionName];
    await currentCollection.deleteMany({});
  }
}
