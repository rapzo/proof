import { createConnection, Socket } from 'node:net';
import { createInterface } from 'node:readline/promises';

const port = !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3000;

const [, , ...arg] = process.argv;

async function main() {
  const command = arg.join(' ').trim();

  const client = command
    ? createClient(command)
    : createInteractiveClient(port);

  client.on('error', () => {
    console.log(`no server found at port ${port}`);
    process.exit(1);
  });
}

const createInteractiveClient = (port: number): Socket => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  const client = createConnection({ port }, () => {
    rl.on('line', (line) => {
      client.write(line.trim());
    });
  })
    .on('data', (data) => {
      try {
        console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
      } catch {
        console.log(data.toString());
      } finally {
        rl.prompt();
      }
    })
    .on('connect', () => {
      console.log('connected to server');
      rl.prompt();
    })
    .on('end', () => {
      console.log('disconnected from server');
      process.exit(0);
    });

  return client;
};

const createClient = (command: string): Socket => {
  const client = createConnection({ port }, () => {
    client.write(command);
  }).on('data', (data) => {
    try {
      console.log(JSON.stringify(JSON.parse(data.toString()), null, 2));
    } catch {
      console.log(data.toString());
    } finally {
      client.end();
    }
  });

  return client;
};

main().catch(console.error);
