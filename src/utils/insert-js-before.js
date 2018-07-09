/* @flow */

import {replaceJs} from './replace-js.js';

export const insertJsBefore = (
  path: NodePath,
  target: string,
  code: string,
  wildcards: Array<string> = [],
) => {
  return replaceJs(path, target, `${code}\n${target}`, wildcards);
};
