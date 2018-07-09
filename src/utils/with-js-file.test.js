/* @flow */

import fse from 'fs-extra';
import {writeFile} from './write-file.js';
import {withJsFile} from './with-js-file';

test('withJsFile', async () => {
  const fn = jest.fn();
  const file = '__js__.js';
  await writeFile(file, 'a');
  await withJsFile(file, fn);
  expect(fn.mock.calls[0][0].node.type).toBe('Program');
  await fse.remove(file);
});
