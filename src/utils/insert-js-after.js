/* @flow */

import {replaceJs} from './replace-js.js';

export const insertJsAfter = (
  path: NodePath,
  target: string,
  code: string,
  wildcards: Array<string> = [],
) => {
  return replaceJs(path, target, `${target}\n${code}`, wildcards);
};
