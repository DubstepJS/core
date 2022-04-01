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
import {withJsFiles} from './with-js-files.js';

test('withJsFiles', async () => {
  const fn = jest.fn();
  const file = '__sugared__/tmp.js';
  await writeFile(file, 'a');
  await withJsFiles('__sugared__/tmp.js', fn);
  expect(fn.mock.calls[0][0].type).toBe('Program');
  expect(fn.mock.calls[0][1]).toBe('__sugared__/tmp.js');
  await remove('__sugared__');
});
