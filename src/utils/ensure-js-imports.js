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

export const ensureJsImports = (path: NodePath, code: string) => {
  let specifierLists = [];
  parseJs(code).traverse({
    ImportDeclaration(newPath) {
      const specifierList = {};
      specifierLists.push(specifierList);

      let matched = false;
      path.traverse({
        ImportDeclaration(path) {
          const specifiers = path.node.specifiers;
          const newSpecifiers = newPath.node.specifiers;
          if (path.node.source.value === newPath.node.source.value) {
            matched = true;
            // add default specifier if it's missing
            const pathHasDefault = hasDefaultSpecifier(path.node);
            const newPathHasDefault = hasDefaultSpecifier(newPath.node);
            if (!pathHasDefault && newPathHasDefault) {
              specifiers.unshift(newSpecifiers[0]);
              specifierList.default = newSpecifiers[0].local.name;
            } else if (pathHasDefault) {
              specifierList.default = specifiers[0].local.name;
            }

            // merge import specifiers
            const mergeable = newPath.node.specifiers.filter(specifier => {
              if (specifier.type !== 'ImportSpecifier') return false;
              const found = path.node.specifiers.find(old => {
                if (old.type !== 'ImportSpecifier') return false;
                return old.imported.name === specifier.imported.name;
              });
              if (!found) return true;
            });
            specifiers.push(...mergeable);
            for (const specifier of specifiers) {
              if (specifier.type === 'ImportSpecifier') {
                specifierList[specifier.imported.name] = specifier.local.name;
              }
            }
          }
        },
      });

      if (!matched) {
        // insert declaration
        const index = path.node.body.findIndex(node => {
          return node.type !== 'ImportDeclaration';
        });
        const offset = index < 0 ? path.node.body.length : index;
        path.node.body.splice(offset, 0, newPath.node);
        const specifiers = newPath.node.specifiers;
        if (hasDefaultSpecifier(newPath.node)) {
          specifierList.default = specifiers[0].local.name;
        }
        for (const specifier of specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            specifierList[specifier.imported.name] = specifier.local.name;
          }
        }
      }
    },
  });
  return specifierLists;
};
function hasDefaultSpecifier(node) {
  return (
    node.specifiers.length > 0 &&
    node.specifiers[0].type === 'ImportDefaultSpecifier'
  );
}
