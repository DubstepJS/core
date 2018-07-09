/* @flow */

import fse from 'fs-extra';
import {StepperError} from '../core/index.js';
import {createRestorePoint} from './create-restore-point.js';

test('createRestorePoint', async () => {
  const file = '__restore_point__.json';
  await createRestorePoint(file, new StepperError('error', 'step', 0));
  await expect(fse.pathExists(file)).resolves.toEqual(true);
  await fse.remove(file);
});
