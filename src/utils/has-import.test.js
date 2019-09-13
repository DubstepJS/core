// @flow

import {parseJs} from './parse-js.js';
import {hasImport} from './has-import';

test('hasImport default import works', () => {
  const path = parseJs(`import foo from 'bar';`);
  expect(hasImport(path, `import foo from 'bar'`)).toEqual(true);
});

test('hasImport specifier import works', () => {
  const path = parseJs(`import { foo } from 'bar';`);
  expect(hasImport(path, `import { foo } from 'bar'`)).toEqual(true);
});

test('hasImport missing works', () => {
  const path = parseJs(`import { foo } from 'bar';`);
  expect(hasImport(path, `import { bar } from 'bar'`)).toEqual(false);
});
