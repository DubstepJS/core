/* @flow */

import fse from 'fs-extra';

export const moveFile = async (oldName: string, newName: string) => {
  if (await fse.pathExists(oldName)) {
    await fse.move(oldName, newName);
  }
};
