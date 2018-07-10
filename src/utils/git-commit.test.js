import * as git from 'isomorphic-git';
import {gitCommit} from './git-commit.js';

test('gitCommit', async () => {
  const add = jest.spyOn(git, 'add');
  const commit = jest.spyOn(git, 'commit');

  await expect(gitCommit('test commit')).resolves.toEqual(undefined);
  expect(add).toHaveBeenCalled();
  expect(commit).toHaveBeenCalled();
});
