import { generate } from 'csv/.';
import { ingest } from './ingest';

test('should work', async () => {
  const stream = generate({ seed: 1, columns: 2, length: 3 });
  expect(await ingest(stream)).toEqual({
    columns: new Set(['OMH', 'ONKCHhJmjadoA']),
    rows: [
      ['D', 'GeACHiN'],
      ['nnmiN', 'CGfDKB'],
    ],
  });
});
