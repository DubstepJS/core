/* @flow */

import fs from 'fs';
import util from 'util';

const read = util.promisify(fs.readFile);
export const readFile = async (file: string) => read(file, 'utf-8');
