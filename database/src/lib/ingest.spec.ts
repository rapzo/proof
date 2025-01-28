import { generate } from 'csv';
import { ingest } from './ingest';

test('should work', async () => {
  const stream = generate({ seed: 1, columns: 2, length: 3 });
  expect(await ingest(stream)).toEqual({
    columns: new Set(['OMH', 'ONKCHhJmjadoA']),
    rows: new Map([
      [
        0,
        new Map([
          [0, 'D'],
          [1, 'GeACHiN'],
        ]),
      ],
      [
        1,
        new Map([
          [0, 'nnmiN'],
          [1, 'CGfDKB'],
        ]),
      ],
    ]),
  });
});
