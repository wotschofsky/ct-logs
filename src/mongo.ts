import { type Collection, type Document, MongoClient } from 'mongodb';
import { getBaseDomain } from './utils';

const client = new MongoClient(process.env.MONGO_URL!);

await client.connect();

const db = client.db('certstream');
const domains = db.collection('domains');
const baseDomains = db.collection('baseDomains');

const addUniqueValue = async (collection: Collection<Document>, value: string) => {
  const entry = await collection.find({ value }).next();
  if (entry) return;
  await collection.insertOne({ value });
}

export const addDomain = async (domain: string) => {
  const baseDomain = getBaseDomain(domain);
  await addUniqueValue(domains, domain)
  await addUniqueValue(baseDomains, baseDomain)
};
