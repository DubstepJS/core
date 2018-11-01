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
import {parseJs} from './parse-js';
import {
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportSpecifier,
} from '@babel/types';

export const visitJsImport = (
  path: NodePath,
  source: string,
  handler: (path: NodePath, refPaths: Array<NodePath>) => void,
) => {
  const sourcePath = parseJs(source);
  const sourceNode = sourcePath.node.body[0];
  if (sourceNode.type !== 'ImportDeclaration') {
    throw new Error(
      `Expected source with type ImportDeclaration. Received: ${
        sourceNode.type
      }`,
    );
  }
  const specifiers = sourceNode.specifiers;
  if (specifiers.length !== 1) {
    throw new Error(
      `Expected exactly one import specifier. Received: ${specifiers.length}`,
    );
  }
  const sourceSpecifier = specifiers[0];
  const localName = specifiers[0].local.name;
  path.traverse({
    ImportDeclaration(ipath: NodePath) {
      const sourceName = ipath.get('source').node.value;
      if (sourceName !== sourceNode.source.value) {
        return;
      }
      ipath.get('specifiers').forEach(targetSpecifier => {
        const targetName = targetSpecifier.get('local').node.name;
        const binding = ipath.scope.bindings[targetName];
        const refPaths = binding ? binding.referencePaths : [];
        if (
          isImportSpecifier(targetSpecifier) &&
          isImportSpecifier(sourceSpecifier) &&
          localName === targetName
        ) {
          return handler(ipath, refPaths);
        }
        if (
          isImportNamespaceSpecifier(targetSpecifier) &&
          isImportNamespaceSpecifier(sourceSpecifier)
        ) {
          return handler(ipath, refPaths);
        }
        if (
          isImportDefaultSpecifier(targetSpecifier) &&
          isImportDefaultSpecifier(sourceSpecifier)
        ) {
          return handler(ipath, refPaths);
        }
      });
    },
  });
};
