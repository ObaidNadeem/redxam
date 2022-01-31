import crypto from 'crypto';

export function generateCode(email: string) {
  let code = crypto.createHash('md5').update(email).digest('hex').slice(0, 6);
  let replacements = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J',
  };

  return code
    .split('')
    .map(char => (replacements[char] ? replacements[char] : char))
    .join('')
    .toUpperCase();
}
