/* @flow */

import {parseJs} from './parse-js.js';
import {insertJsAfter} from './insert-js-after.js';
import {generateJs} from './generate-js.js';

test('insertJsAfter', () => {
  const path = parseJs('const a = 1;');
  insertJsAfter(path, `const a = VAL`, `const b = 2`, ['VAL']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('const a = 1;\nconst b = 2;');
});
