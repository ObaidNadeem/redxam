import { generateCode } from './helpers'

test('generateCode returns an string', () => {
  expect(typeof generateCode('sample@email.com')).toBe('string');
});
