/* @flow */

import fs from 'fs';
import * as git from 'isomorphic-git';

export const gitClone = async (repo: string, target: string) => {
  await git.clone({fs, url: repo, dir: target});
};
