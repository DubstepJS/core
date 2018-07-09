/* @flow */

import fse from 'fs-extra';
import {writeFile} from './write-file.js';
import {withIgnoreFile} from './with-ignore-file.js';

test('withIgnoreFile works', async () => {
  expect.assertions(1);
  const file = '__non_existent_1__.gitignore';
  await writeFile(file, 'a\nb');
  await withIgnoreFile(file, async (data: Array<string>) => {
    expect(data).toEqual(['a', 'b']);
  });
  await fse.remove(file);
});

test('withIgnoreFile defaults to empty array if it does not exist', async () => {
  expect.assertions(1);
  const file = '__non_existent_2__.gitignore';
  await withIgnoreFile(file, async (data: Array<string>) => {
    expect(data).toEqual([]);
  });
  await fse.remove(file);
});
