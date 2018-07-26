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

export const removeJsImports = (path: NodePath, code: string) => {
  parseJs(code).traverse({
    ImportDeclaration(obsoletePath) {
      path.traverse({
        ImportDeclaration(targetPath) {
          if (targetPath.node.source.value === obsoletePath.node.source.value) {
            const filtered = targetPath.node.specifiers.filter(specifier => {
              const obsoleteSpecifiers = obsoletePath.node.specifiers;
              const ofSameType = obsoleteSpecifiers.filter(s => {
                return s.type === specifier.type;
              });
              if (specifier.type === 'ImportDefaultSpecifier') {
                const name = specifier.local.name;
                const match = ofSameType.find(s => name === s.local.name);
                if (match) remove(path, match.local.name);
                return !match;
              } else if (specifier.type === 'ImportSpecifier') {
                const name = specifier.imported.name;
                const match = ofSameType.find(s => name === s.imported.name);
                if (match) remove(path, match.local.name);
                return !match;
              }
              return false;
            });
            if (filtered.length > 0) targetPath.node.specifiers = filtered;
            else targetPath.remove();
          }
        },
      });
    },
  });
};

function remove(path, name) {
  const refPaths = path.scope.bindings[name].referencePaths;
  for (const refPath of refPaths) {
    if (refPath.node.type !== 'ImportDeclaration') {
      refPath.getStatementParent().remove();
    }
  }
}
