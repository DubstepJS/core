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

import traverse from '@babel/traverse';
import NodePath from '@babel/traverse/lib/path';
import {parse} from '@babel/parser';
import {readFile} from './read-file.js';

export type ParserOptions = ?{mode: ?('typescript' | 'flow')};

export const parseJs = (code: string, options: ParserOptions) => {
  const typeSystem =
    options && options.mode === 'typescript'
      ? ['typescript']
      : ['flow', 'flowComments'];

  const ast = parse(code, {
    sourceType: 'unambiguous',
    plugins: [
      ...typeSystem,
      'jsx',
      'doExpressions',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'asyncGenerators',
      'functionBind',
      'functionSent',
      'dynamicImport',
      'numericSeparator',
      'optionalChaining',
      'importMeta',
      'bigInt',
      'optionalCatchBinding',
      'throwExpressions',
      ['pipelineOperator', {proposal: 'minimal'}],
      'nullishCoalescingOperator',
    ],
  });

  // ensure `path` has correct type to keep flow.js happy
  // we always override the dummy NodePath with the `enter` visitor
  let path = new NodePath();
  traverse(ast, {
    enter(p) {
      if (p.isProgram()) path = p;
    },
  });

  return path;
};
