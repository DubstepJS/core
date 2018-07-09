/* @flow */

import fse from 'fs-extra';

export const removeFile = async (name: string) => {
  if (await fse.pathExists(name)) {
    await fse.remove(name);
  }
};
