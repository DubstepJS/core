/* @flow */

import {parseJs} from './parse-js.js';
import {insertJsBefore} from './insert-js-before.js';
import {generateJs} from './generate-js.js';

test('insertJsBefore', () => {
  const path = parseJs('const a = 1;');
  insertJsBefore(path, `const a = VAL`, `const b = 2`, ['VAL']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('const b = 2;\nconst a = 1;');
});
