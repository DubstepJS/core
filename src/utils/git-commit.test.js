import execa from 'execa';
import {gitCommit} from './git-commit.js';

test('gitCommit', async () => {
  const spy = jest.fn();
  jest.spyOn(execa, 'shell').mockImplementation(spy);

  await gitCommit('');
  expect(spy.mock.calls[0][0]).toEqual(expect.stringMatching('git add'));
  expect(spy.mock.calls[1][0]).toEqual(expect.stringMatching('git commit'));
});
