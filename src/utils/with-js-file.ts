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

import {readFile} from './read-file.js';
import {writeFile} from './write-file.js';
import {parseJs} from './parse-js.js';
import {generateJs} from './generate-js.js';
import type {BabelPath, Program} from '@ganemone/babel-flow-types';

export type JsFileMutation = (BabelPath<Program>, file: string) => Promise<any>;

export const withJsFile = async (file: string, transform: JsFileMutation) => {
  const code = await readFile(file).catch(() => '');
  try {
    const program = parseJs(code);
    await transform(program, file);
    const generated = generateJs(program);
    await writeFile(file, generated);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Failed to handle file: ${file}`);
    throw e;
  }
};
