import 'dotenv/config';
import { CertStreamClient } from './cert-stream';
import { addDomain } from './redis';

let client = new CertStreamClient(meta => {
  meta.data.leaf_cert.all_domains?.forEach(addDomain)
});

const logEvent = (event: string) => (...args: unknown[]) => logger.info(event, {
  meta: {
    ...args
  },
});

console.info('> started');

// Connect to the websocket server
await client.connect();
console.info('> connected to stream');

// Failed to connect
if (!client.ws) process.exit(0);

client.ws.onclose = logEvent('close');
client.ws.onerror = logEvent('error');
