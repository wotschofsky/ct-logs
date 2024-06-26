import 'dotenv/config';

import { CertStreamClient } from './cert-stream';
import { addDomain } from './mongo';

let lastMessageAt = Date.now();

let client = new CertStreamClient(meta => {
  const { all_domains } = meta.data.leaf_cert
  if (!all_domains) return
  console.log('Logging domains', all_domains)
  all_domains?.forEach(addDomain)
  lastMessageAt = Date.now();
});

console.info('> started');

// Connect to the websocket server
await client.connect();
console.info('> connected to stream');

// Failed to connect
if (!client.ws) process.exit(0);

setInterval(() => {
  if (Date.now() - lastMessageAt > 30_000) {
    console.error('No messages received in 30 seconds, exiting...');
    process.exit(0);
  }
}, 1000);
