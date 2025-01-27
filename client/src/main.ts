import { createConnection } from 'node:net';
import { query } from '@proof/query';

const client = createConnection({ port: 3000 }, async () => {
  console.log('connected to server!');

  const response = await query();
  client.write(response);
});

client.on('data', (data) => {
  console.log(data.toString());
});

client.on('end', () => {
  console.log('disconnected from server');

  process.exit(0);
});
