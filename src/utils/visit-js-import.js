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
import {parseStatement} from './parse-js';
import {
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
} from '@babel/types';
import type {
  BabelPath,
  Program,
  ImportDeclaration,
  Identifier,
} from '@ganemone/babel-flow-types';

export const visitJsImport = (
  path: BabelPath<Program>,
  source: string,
  handler: (
    path: BabelPath<ImportDeclaration>,
    refPaths: Array<BabelPath<Identifier>>
  ) => any
) => {
  const sourceNode = parseStatement(source);
  if (sourceNode.type !== 'ImportDeclaration') {
    throw new Error(
      `Expected source with type ImportDeclaration. Received: ${
        sourceNode.type
      }`
    );
  }
  const specifiers = sourceNode.specifiers;
  if (specifiers.length !== 1) {
    throw new Error(
      `Expected exactly one import specifier. Received: ${specifiers.length}`
    );
  }
  const sourceSpecifier = specifiers[0];
  const localName = specifiers[0].local.name;
  path.traverse({
    ImportDeclaration(ipath: BabelPath<ImportDeclaration>) {
      const sourceName = ipath.get('source').node.value;
      if (sourceName !== sourceNode.source.value) {
        return;
      }
      ipath.get('specifiers').forEach(targetSpecifier => {
        const targetName = targetSpecifier.get('local').node.name;
        // $FlowFixMe
        const binding = ipath.scope.bindings[targetName];
        const refPaths = binding ? binding.referencePaths : [];
        if (
          // specifier case
          (isImportSpecifier(targetSpecifier) &&
            isImportSpecifier(sourceSpecifier) &&
            localName === targetName) ||
          // namespace import case
          (isImportNamespaceSpecifier(targetSpecifier) &&
            isImportNamespaceSpecifier(sourceSpecifier)) ||
          // default import case
          (isImportDefaultSpecifier(targetSpecifier) &&
            isImportDefaultSpecifier(sourceSpecifier))
        ) {
          handler(ipath, refPaths);
        }
      });
    },
  });
};
