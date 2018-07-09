import execa from 'execa';

export const gitCommit = async (message: string) => {
  await execa.shell('git add .');
  await execa.shell(`git commit -m '${message.replace(/'/g, '')}'`);
};
