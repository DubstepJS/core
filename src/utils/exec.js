/* @flow */

import execa from 'execa';

export const exec = async (command: string) => {
  const {stdout} = await execa.shell(command);
  return stdout;
};
