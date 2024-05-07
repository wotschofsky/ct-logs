import { type Collection, type Document, MongoClient } from 'mongodb';
import { getBaseDomain } from './utils';

const client = new MongoClient(process.env.MONGO_URL!);

await client.connect();

const db = client.db('certstream');
const domains = db.collection('domains');
const baseDomains = db.collection('baseDomains');

domains.createIndex({ value: 1 }, { unique: true });
baseDomains.createIndex({ value: 1 }, { unique: true });

const addUniqueValue = async (collection: Collection<Document>, value: string) => {
  const entry = await collection.find({ value }).next();

  if (entry) {
    await collection.updateOne({ _id: entry._id }, {
      $set: { lastSeen: new Date() }
    });
    return;
  };

  await collection.insertOne({
    value,
    firstSeen: new Date(),
    lastSeen: new Date()
  });
}

export const addDomain = async (domain: string) => {
  const baseDomain = getBaseDomain(domain);
  await Promise.all([
    addUniqueValue(domains, domain),
    addUniqueValue(baseDomains, baseDomain)
  ])
};
