import { createServer } from 'node:net';
import { ingest, query } from '@proof/store';
import { createReadStream } from 'node:fs';

const [, , file] = process.argv;

async function main() {
  const table = await ingest(file ? createReadStream(file) : process.stdin);

  const server = createServer((socket) => {
    socket.on('data', async (data) => {
      // socket.write(result);

      const queryResult = await query(table, data.toString());
      console.log(queryResult);
    });
  });

  server.listen(3000);
}

main().catch(console.error);
