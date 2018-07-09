/* @flow */

import traverse from '@babel/traverse';
import {readFile} from './read-file.js';
import {writeFile} from './write-file.js';
import {parseJs} from './parse-js.js';
import {generateJs} from './generate-js.js';

export type JsFileMutation = NodePath => void;

export const withJsFile = async (file: string, transform: JsFileMutation) => {
  const code = await readFile(file).catch(() => '');
  const path = parseJs(code);
  await transform(path);
  const generated = generateJs(path);
  await writeFile(file, generated);
};
