/* @flow */

import {readFile} from '../utils/read-file.js';
import {writeFile} from '../utils/write-file.js';

export type JsonFileMutation = (data: any) => Promise<any>;

export const withJsonFile = async (file: string, fn: JsonFileMutation) => {
  const data = JSON.parse(await readFile(file).catch(() => '{}'));
  await writeFile(file, JSON.stringify((await fn(data)) || data));
};
