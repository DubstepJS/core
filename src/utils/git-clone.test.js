/* @flow */

import fs from 'fs-extra';
import {gitClone} from './git-clone.js';

test('gitClone works', async () => {
  const repo = 'git@github.com:jonschlinkert/is-number.git';
  await expect(gitClone(repo, '__cloned__')).resolves.toBe(undefined);
  await fs.remove('__cloned__');
});
