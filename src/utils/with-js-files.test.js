/* @flow */

import {parse} from '@babel/parser';
import fse from 'fs-extra';
import {writeFile} from './write-file.js';
import {withJsFiles} from './with-js-files.js';

test('withJsFiles', async () => {
  const fn = jest.fn();
  const file = '__sugared__/tmp.js';
  await writeFile(file, 'a');
  await withJsFiles('__sugared__', /tmp.js/, fn);
  expect(fn.mock.calls[0][0].node.type).toBe('Program');
  await fse.remove('__sugared__');
});
