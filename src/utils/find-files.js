/*
Copyright (c) 2018 Uber Technologies, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@flow
*/

import fs from 'fs';
import util from 'util';
import path from 'path';

const stat = util.promisify(fs.stat);
const readDir = util.promisify(fs.readdir);

export const findFiles = async (root: string, match: string => boolean) => {
  const files = [];

  async function collect(root) {
    const stats = await stat(root);
    if (stats.isDirectory()) {
      const children = await readDir(root);
      const searches = children.map(child => {
        return collect(path.join(root, child));
      });
      await Promise.all(searches);
    } else {
      if (match(root)) files.push(root);
    }
  }
  await collect(root);

  return files;
};
