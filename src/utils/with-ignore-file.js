/* @flow */

import {readFile} from '../utils/read-file.js';
import {writeFile} from '../utils/write-file.js';

export type IgnoreFileMutation = (
  data: Array<string>,
) => Promise<?Array<string>>;

export const withIgnoreFile = async (file: string, fn: IgnoreFileMutation) => {
  const data = await readFile(file)
    .then(data => data.split('\n'))
    .catch(() => []);
  await writeFile(file, ((await fn(data)) || data).join('\n'));
};
