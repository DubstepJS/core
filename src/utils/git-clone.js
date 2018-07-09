/* @flow */

import execa from 'execa';

export const gitClone = async (repo: string, target: string) => {
  await execa.shell(`
    if [ ! -d "${target}" ] ; then
      git clone ${repo} ${target}
    fi
  `);
};
