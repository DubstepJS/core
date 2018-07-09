/* @flow */

import util from 'util';
import fse from 'fs-extra';
import {writeFile} from './write-file.js';
import {readFile} from './read-file.js';

test('readFile', async () => {
  const file = '__dummy__.js';
  await writeFile(file, 'a');
  expect(await readFile(file)).toEqual('a');
  await fse.remove(file);
});
