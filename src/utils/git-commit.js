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
import globby from 'globby';
import * as git from 'isomorphic-git';
import ini from 'ini';
import {readFile} from './read-file';

export const gitCommit = async (message: string) => {
  const paths = await globby(['./**', './**/.*'], {gitignore: true});
  for (const filepath of paths) {
    await git.add({fs, dir: '.', filepath}).catch(() => {});
  }

  const {user = {name: 'dubstep', email: 'dubstep'}} = await getGlobalConfig();
  const name = (await get('user.name')) || user.name;
  const email = (await get('user.email')) || user.email;
  await git.commit({fs, dir: '.', author: {name, email}, message});
};

async function get(path) {
  return git.config({fs, dir: '.', path});
}
async function getGlobalConfig() {
  const file = await readFile(`${process.env.HOME}/.gitconfig`).catch(() => '');
  return ini.parse(file);
}
