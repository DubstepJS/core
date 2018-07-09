/* @flow */

import {exec} from './exec.js';

test('exec', async () => {
  await expect(exec('echo test')).resolves.toEqual('test');
});
