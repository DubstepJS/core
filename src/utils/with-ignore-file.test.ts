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

import {remove} from 'fs-extra';
import {writeFile} from './write-file.js';
import {withIgnoreFile} from './with-ignore-file.js';

test('withIgnoreFile works', async () => {
  expect.assertions(1);
  const file = '__non_existent_1__.gitignore';
  await writeFile(file, 'a\nb');
  await withIgnoreFile(file, async (data: Array<string>) => {
    expect(data).toEqual(['a', 'b']);
  });
  await remove(file);
});

test('withIgnoreFile defaults to empty array if it does not exist', async () => {
  expect.assertions(1);
  const file = '__non_existent_2__.gitignore';
  await withIgnoreFile(file, async (data: Array<string>) => {
    expect(data).toEqual([]);
  });
  await remove(file);
});
