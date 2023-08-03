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

import {parseJs} from './parse-js.js';
import {generateJs} from './generate-js.js';

test('parseJs', async () => {
  const code = 'const a = 1;';
  const path = parseJs(code);
  const generated = generateJs(path);
  expect(generated).toEqual(code);
});

test('parseJs with jsx', async () => {
  const code = `
    import React from 'react'; 
    function Test() {
      return (
        <div>
          <>Fragment Test</>
          Hello World
        </div>
      );
    }
  `;
  const path = parseJs(code);
  const generated = generateJs(path);
  expect(generated).toEqual(code);
});

test('parseJs with class private properties', async () => {
  const code = `
    class Test {
      #test = true;
      // not sure why but this comment is neccessary to trip the 
      // legacy recast parser (before it supported private props)
    }
  `;
  const path = parseJs(code);
  const generated = generateJs(path);
  expect(generated).toEqual(code);
});

test('generic is parsed unambiguously', async () => {
  const code = `export default foo<any, any>()`;
  const path = parseJs(code);
  const generated = generateJs(path);
  expect(generated).toEqual(code);
});
