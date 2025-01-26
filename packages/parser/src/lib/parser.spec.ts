import { parser } from './parser';

describe('parser', () => {
  it('should work', () => {
    expect(parser('x')).toEqual('parser');
  });
});
