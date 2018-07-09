/* @flow */

import fse from 'fs-extra';
import {withJsonFile} from './with-json-file.js';

test('withJsonFile defaults to empty object if it does not exist', async () => {
  expect.assertions(1);
  const file = '__json__.json';
  await withJsonFile(file, async (data: Object) => {
    expect(data).toEqual({});
  });
  await fse.remove(file);
});
