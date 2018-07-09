/* @flow */

import {parseJs} from './parse-js.js';
import {removeJsImports} from './remove-js-imports.js';
import {generateJs} from './generate-js.js';

test('removeJsImports', () => {
  const path = parseJs(`import a, {b} from 'c';`);
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual('');
});

test('remove specifiers', () => {
  const path = parseJs(`import a, {b, c} from 'c';`);
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual('import { c } from "c";');
});

test('remove dependent statements', () => {
  const path = parseJs(
    `import a, {b} from 'c';foo(a);b.toString();function x(a) {a();}`,
  );
  removeJsImports(path, `import a, {b} from 'c';`);
  expect(generateJs(path).trim()).toEqual('function x(a) {\n  a();\n}');
});
