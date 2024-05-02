import { getDomain } from 'tldts';

// From https://github.com/wotschofsky/domain-digger/blob/09213297e2486ddcf50c5f777d610f288c013dfb/lib/utils.ts#L49
export const getBaseDomain = (domain: string) => {
  // Remove wildcard prefix to avoid base domain not being extracted correctly
  // Remove trailing dot
  const cleanedDomain = domain.replace(/^\*\./, '').replace(/\.$/, '');
  const baseDomain = getDomain(cleanedDomain) || cleanedDomain;
  return baseDomain;
};
