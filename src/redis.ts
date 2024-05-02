import Redis from 'ioredis'

import { getBaseDomain } from './utils';

const redis = new Redis(process.env.REDIS_URL!)

export const addDomain = async (domain: string) => {
  const baseDomain = getBaseDomain(domain);
  await redis.sadd('domains', domain)
  await redis.sadd('baseDomains', baseDomain)
}
