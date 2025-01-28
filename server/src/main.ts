import { createServer } from 'node:net';
import { ingest, query } from '@proof/database';
import { createReadStream } from 'node:fs';

const port = !isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3000;

const [, , file] = process.argv;

async function main() {
  const table = await ingest(!file ? process.stdin : createReadStream(file));

  const server = createServer((socket) => {
    socket.on('data', async (data) => {
      const command = data.toString().trim();

      console.log('Received:', command);
      console.time('query');

      try {
        const queryResult = await query(table, command);
        console.timeEnd('query');

        socket.write(JSON.stringify(queryResult));
      } catch (error) {
        console.timeEnd('query');

        if (error instanceof Error) {
          console.error(error.message);
        }

        server.close();
      }
    });
  });

  server
    .on('connection', (client) => {
      console.log('Connected:', client.remoteAddress);
    })
    .listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
}

main().catch(console.error);
