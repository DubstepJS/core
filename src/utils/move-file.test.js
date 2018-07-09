/* @flow */

import fse from 'fs-extra';
import {moveFile} from './move-file.js';

test('moveFile no-ops if src does not exist', async () => {
  const source = '__source__/file.txt';
  const target = '__target__/file.tx';
  await expect(moveFile(source, target)).resolves.toBe(undefined);
  await fse.remove('__source__');
});

test('moveFile works with deep path', async () => {
  const source = '__deep__/file.txt';
  const target = '__target__/moved.txt';
  await fse.ensureFile(source);
  await expect(moveFile(source, target)).resolves.toBe(undefined);
  await fse.remove('__target__');
  await fse.remove('__deep__');
});
