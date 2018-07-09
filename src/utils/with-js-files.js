/* @flow */

import {findFiles} from './find-files.js';
import {withJsFile} from './with-js-file.js';
import type {JsFileMutation} from './with-js-file.js';

export const withJsFiles = async (
  root: string,
  regexp: RegExp,
  fn: JsFileMutation,
) => {
  const files = await findFiles(root, f => regexp.test(f));
  for (const file of files) {
    await withJsFile(file, fn);
  }
};
