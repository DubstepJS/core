/* @flow */

import fse from 'fs-extra';
import {writeFile} from './write-file.js';

test('writeFile works with deep path', async () => {
  expect.assertions(1);
  const file = '__writing__/path.txt';
  await writeFile(file, 'test');
  await expect(fse.pathExists(file)).resolves.toEqual(true);
  await fse.remove('__writing__');
});
