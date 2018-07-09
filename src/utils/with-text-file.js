/* @flow */

import {readFile} from '../utils/read-file.js';
import {writeFile} from '../utils/write-file.js';

export type TextFileMutation = (data: string) => Promise<?string>;

export const withTextFile = async (file: string, fn: TextFileMutation) => {
  const data = await readFile(file).catch(() => '');
  await writeFile(file, (await fn(data)) || data);
};
