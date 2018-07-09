/* @flow */

import fse from 'fs-extra';
import {getRestorePoint} from './get-restore-point.js';

test('getRestorePoint', async () => {
  const file = '__restore_point_1__.json';
  await expect(getRestorePoint(file)).resolves.toEqual(0);
  await fse.remove(file);
});
