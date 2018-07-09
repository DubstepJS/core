/* @flow */

import {findFiles} from './find-files.js';

test('findFiles', async () => {
  const files = await findFiles('src', f => {
    return /find-files.test.js/.test(f);
  });
  expect(files.length).toEqual(1);
});
