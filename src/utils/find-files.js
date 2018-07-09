/* @flow */

import fs from 'fs';
import util from 'util';

const stat = util.promisify(fs.stat);
const readDir = util.promisify(fs.readdir);

export const findFiles = async (root: string, match: string => boolean) => {
  const files = [];

  async function collect(root) {
    const stats = await stat(root);
    if (stats.isDirectory()) {
      const children = await readDir(root);
      const searches = children.map(child => {
        return collect(`${root}/${child}`);
      });
      await Promise.all(searches);
    } else {
      if (match(root)) files.push(root);
    }
  }
  await collect(root);

  return files;
};
