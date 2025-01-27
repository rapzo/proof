import { createServer } from 'node:net';
import { ingest, query } from '@proof/database';
import { createReadStream } from 'node:fs';

const [, , file] = process.argv;

async function main() {
  const table = await ingest(file ? createReadStream(file) : process.stdin);

  const server = createServer((socket) => {
    socket.on('data', async (data) => {
      try {
        const queryResult = await query(table, data.toString());

        socket.write(queryResult);
      } catch (error) {
        if (error instanceof Error) {
          socket.write(error.message);
        }

        server.close();

        throw error;
      }
    });
  });

  return server.listen(3000);
}

main().catch(console.error);
