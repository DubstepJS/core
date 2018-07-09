/* @flow */

import {parseJs} from './parse-js.js';
import {generateJs} from './generate-js.js';

test('parseJs', async () => {
  const code = 'const a = 1;';
  const path = parseJs(code);
  const generated = generateJs(path);
  expect(code).toEqual(generated.trim());
});
