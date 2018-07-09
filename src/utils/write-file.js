/* @flow */

import fs from 'fs';
import util from 'util';
import fse from 'fs-extra';

const write = util.promisify(fs.writeFile);

export const writeFile = async (file: string, data: string) => {
  await fse.ensureFile(file);
  await write(file, data, 'utf-8');
};
