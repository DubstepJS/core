/* @flow */

import fse from 'fs-extra';
import {removeFile} from './remove-file.js';

test('removeFile no-ops if file does not exist', async () => {
  const file = '__non_existent__/file.txt';
  await expect(removeFile(file)).resolves.toBe(undefined);
});

test('removeFile works with deep path', async () => {
  const file = '__to_remove__/file.txt';
  await fse.ensureFile(file);
  await expect(removeFile(file)).resolves.toBe(undefined);
  await fse.remove('__to_remove__');
});
