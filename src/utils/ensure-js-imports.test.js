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
import {ensureJsImports} from './ensure-js-imports.js';
import {generateJs} from './generate-js.js';

test('ensureJsImports', () => {
  const path = parseJs('');
  const vars = ensureJsImports(path, `import foo, {bar} from 'bar';`);
  const code = generateJs(path);
  expect(code.trim()).toEqual(`import foo, { bar } from "bar";`);
  expect(vars).toEqual([{default: 'foo', bar: 'bar'}]);
});

test('ensureJsImports after', () => {
  const path = parseJs(`import 'x';`);
  const vars = ensureJsImports(path, `import foo, {bar} from 'bar';`);
  const code = generateJs(path);
  expect(code.trim()).toEqual(`import "x";\nimport foo, { bar } from "bar";`);
  expect(vars).toEqual([{default: 'foo', bar: 'bar'}]);
});

test('ensureJsImports before', () => {
  const path = parseJs(`const a = 1;`);
  const vars = ensureJsImports(path, `import foo, {bar} from 'bar';`);
  const code = generateJs(path);
  expect(code.trim()).toEqual(`import foo, { bar } from "bar";\nconst a = 1;`);
  expect(vars).toEqual([{default: 'foo', bar: 'bar'}]);
});

test('merge', () => {
  const path = parseJs(`import {x} from 'foo'`);
  const vars = ensureJsImports(path, `import foo, {bar} from 'foo';`);
  const code = generateJs(path);
  expect(code.trim()).toEqual(`import foo, { x, bar } from "foo";`);
  expect(vars).toEqual([{default: 'foo', x: 'x', bar: 'bar'}]);
});

test('retain default', () => {
  const path = parseJs(`import foo from 'foo'`);
  const vars = ensureJsImports(path, `import wildcard from 'foo';`);
  const code = generateJs(path);
  expect(code.trim()).toEqual(`import foo from "foo";`);
  expect(vars).toEqual([{default: 'foo'}]);
});

test('multiple', () => {
  const path = parseJs(`import foo from 'foo';import bar from 'bar'`);
  const vars = ensureJsImports(
    path,
    `import wildcard from 'foo';import another, {x} from 'bar';`,
  );
  const code = generateJs(path);
  expect(code.trim()).toEqual(
    `import foo from "foo";\nimport bar, { x } from "bar";`,
  );
  expect(vars).toEqual([{default: 'foo'}, {default: 'bar', x: 'x'}]);
});
