/* @flow */

import fs from 'fs-extra';
import {gitClone} from './git-clone.js';

test('gitClone works', async () => {
  const dir = '__cloned__';
  const repo = 'https://github.com/jonschlinkert/is-number.git';
  await gitClone(repo, dir);
  await expect(fs.pathExists(dir)).resolves.toBe(true);
  await fs.remove(dir);
});
