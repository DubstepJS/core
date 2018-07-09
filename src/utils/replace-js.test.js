/* @flow */

import {parseJs} from './parse-js.js';
import {replaceJs} from './replace-js.js';
import {generateJs} from './generate-js.js';

test('replaceJs', () => {
  const path = parseJs('const a = b * c + d;');
  replaceJs(path, `b * $VALUE`, `x || $VALUE`, ['$VALUE']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('const a = (x || c) + d;');
});

test('replace varargs', () => {
  const path = parseJs('foo.bar(1, 2, 3);');
  replaceJs(path, `foo.bar(...$ARGS)`, `fooBar(...$ARGS)`, ['$ARGS']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('fooBar(1, 2, 3);');
});

test('multiple statements with wildcard', () => {
  const path = parseJs('const a = f(1);');
  replaceJs(path, `const a = f(X)`, `const a = f(X);const b = 2;`, ['X']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('const a = f(1);\nconst b = 2;');
});

test('multiple statements with spread wildcard', () => {
  const path = parseJs('const a = f(1, 2);');
  replaceJs(path, `const a = f(...X)`, `const a = f(...X);const b = 2;`, ['X']);
  const generated = generateJs(path);
  expect(generated.trim()).toEqual('const a = f(1, 2);\nconst b = 2;');
});
