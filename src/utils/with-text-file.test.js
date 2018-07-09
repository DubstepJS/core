/* @flow */

import fse from 'fs-extra';
import {withTextFile} from './with-text-file.js';

test('withTextFile defaults to empty string if it does not exist', async () => {
  expect.assertions(1);
  const file = '__text__.txt';
  await withTextFile(file, async (data: string) => {
    expect(data).toEqual('');
  });
  await fse.remove(file);
});
