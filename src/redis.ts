import Redis from 'ioredis'
import { getDomain } from 'tldts';

const redis = new Redis(process.env.REDIS_URL!)

// From https://github.com/wotschofsky/domain-digger/blob/09213297e2486ddcf50c5f777d610f288c013dfb/lib/utils.ts#L49
const getBaseDomain = (domain: string) => {
  // Remove wildcard prefix to avoid base domain not being extracted correctly
  // Remove trailing dot
  const cleanedDomain = domain.replace(/^\*\./, '').replace(/\.$/, '');
  const baseDomain = getDomain(cleanedDomain) || cleanedDomain;
  return baseDomain;
};

export const addDomain = async (domain: string) => {
  const baseDomain = getBaseDomain(domain);
  await redis.sadd('domains', domain)
  await redis.sadd('baseDomains', baseDomain)
}
