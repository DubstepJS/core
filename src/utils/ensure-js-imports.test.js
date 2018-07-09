/* @flow */

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
