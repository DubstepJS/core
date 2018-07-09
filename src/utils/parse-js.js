/* @flow */

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
      'pipelineOperator',
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
