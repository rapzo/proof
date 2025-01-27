import { createConnection } from 'node:net';
import { createInterface } from 'node:readline/promises';

const [, , arg] = process.argv;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

const port = isNaN(Number(arg)) ? 3000 : Number(arg);

const client = createConnection({ port }, async () => {
  rl.prompt();

  rl.on('line', async (line) => {
    client.write(line.trim());
  });
});

client.on('data', (data) => {
  console.log(data.toString());
  rl.prompt();
});

client.on('end', () => {
  console.log('disconnected from server');

  process.exit(0);
});

client.on('error', (_error) => {
  console.log(`no server found at port ${port}`);
  process.exit(1);
});
