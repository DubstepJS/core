/*
Copyright (c) 2018 Uber Technologies, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@flow
*/

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
