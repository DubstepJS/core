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
