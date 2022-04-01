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

*/

import {parseJs} from './parse-js';
import {removeJsImports} from './remove-js-imports';
import {generateJs} from './generate-js';

test('removeJsImports', () => {
  const path = parseJs(`import a, {b} from 'c';`);
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual('');
});

test('removeJsImports, default import with different named local', () => {
  const path = parseJs(`import c from 'c';`);
  removeJsImports(path, `import a from 'c';`);
  expect(generateJs(path).trim()).toEqual('');
});

test('removeJsImports, namespace import', () => {
  const path = parseJs(`import * as c from 'c';`);
  removeJsImports(path, `import * as b from 'c';`);
  expect(generateJs(path).trim()).toEqual('');
});

test('removeJsImports, no match', () => {
  const path = parseJs(`import b from 'c';`);
  removeJsImports(path, `import {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual(`import b from 'c';`);
});

test('removeJsImports specifiers', () => {
  const path = parseJs(`import a, {b, c} from 'c';`);
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual(`import { c } from 'c';`);
});

test('removeJsImports dependent statements', () => {
  const path = parseJs(
    `import a, {b as c} from 'c';
    foo(a);
    c.toString();
    function x(a) {
      a();
    }`
  );
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual('function x(a) {\n  a();\n}');
});

test('removeJsImports namespace dependent statements', () => {
  const path = parseJs(
    `import * as a from 'c';
    foo(a.test());
    function x(a) {
      a();
    }`
  );
  removeJsImports(path, `import * as a from 'c';`);
  expect(generateJs(path).trim()).toEqual('function x(a) {\n  a();\n}');
});
