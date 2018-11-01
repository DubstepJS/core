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
import {visitJsImport} from './visit-js-import';
import {parseJs} from './parse-js';

test('visitJsImport named', () => {
  const path = parseJs(`
    import {a, b} from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport no references', () => {
  const path = parseJs(`
    import {a, b} from 'c';
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(0);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport no binding', () => {
  const path = parseJs(`
    import 'c';
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(0);
  });
  visitJsImport(path, `import {a} from 'c'`, handler);
  expect(handler).toBeCalledTimes(0);
});

test('visitJsImport namespace', () => {
  const path = parseJs(`
    import * as a from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import * as b from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport default', () => {
  const path = parseJs(`
    import a from 'c';
    import d from 'd';
    console.log(a);
    console.log(d);
    function test() {
      return a;
    }
  `);
  const handler = jest.fn((path, refPaths) => {
    expect(refPaths).toHaveLength(2);
  });
  visitJsImport(path, `import b from 'c'`, handler);
  expect(handler).toBeCalledTimes(1);
});

test('visitJsImport validation', () => {
  const path = parseJs(`
    import a from 'c';
  `);
  const handler = jest.fn();
  expect(() => {
    visitJsImport(path, `const test = 'test'`, handler);
  }).toThrow();
  expect(() => {
    visitJsImport(path, `import {a, b} from 'c'`, handler);
  }).toThrow();
  expect(handler).not.toBeCalled();
});
