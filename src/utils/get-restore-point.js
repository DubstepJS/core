/* @flow */

import {readFile} from './read-file.js';

export const getRestorePoint = async (file: string) => {
  try {
    const data = await readFile(file);
    return JSON.parse(data).index || 0;
  } catch (e) {
    return 0;
  }
};
