/* @flow */

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
