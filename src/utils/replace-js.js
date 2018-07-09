/* @flow */

import template from '@babel/template';
import {parseJs} from './parse-js.js';

export const replaceJs = (
  path: NodePath,
  source: string,
  target: string,
  wildcards: Array<string> = [],
) => {
  const sourcePath = parseJs(source);
  const sourceNode = sourcePath.node.body[0];
  const node =
    sourceNode.type === 'ExpressionStatement'
      ? sourceNode.expression
      : sourceNode;
  const matched = new Map();
  const spreads = {};
  const interpolations = {};
  for (const name of wildcards) interpolations[name] = null;
  path.traverse({
    [node.type](path) {
      if (matched.get(node)) return; //prevent traversal if replaced with same code
      if (match(path.node, node, interpolations, spreads)) {
        const transformed = template(target)(interpolations);
        if (Array.isArray(transformed)) {
          for (const statement of transformed) {
            if (match(node, statement)) matched.set(node, true);
          }
          path.replaceWithMultiple(transformed);
        } else {
          if (match(node, transformed)) matched.set(node, true);
          path.replaceWith(transformed);
        }
      }
    },
  });
  path.traverse({
    Identifier(identifierPath) {
      const args = spreads[identifierPath.node.name];
      const parent = identifierPath.parentPath;
      if (args !== undefined && parent.node.type === 'SpreadElement') {
        parent.replaceWithMultiple(args);
      }
    },
  });
};

function match(a, b, interpolations = {}, spreads = {}) {
  if (isInterpolation(b, interpolations)) {
    interpolations[b.name] = a;
    return true;
  }
  if (a.type !== b.type) return false;
  for (const key in a) {
    if (isEquivalentJSXText(a, b, key) || isMetaData(key)) {
      continue;
    } else if (Array.isArray(a[key])) {
      if (!Array.isArray(b[key])) return false;
      for (let i = 0; i < a[key].length; i++) {
        if (isSpreadInterpolation(b[key][i], interpolations)) {
          const name = b[key][i].argument.name;
          interpolations[name] = {type: 'Identifier', name};
          spreads[name] = a[key];
          return true;
        }
        const matched = match(a[key][i], b[key][i], interpolations, spreads);
        if (!matched) return false;
      }
    } else if (isNode(a[key]) && isNode(b[key])) {
      const matched = match(a[key], b[key], interpolations, spreads);
      if (!matched) return false;
    } else if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function isInterpolation(node, interpolations) {
  return node.type === 'Identifier' && interpolations[node.name] === null;
}

function isSpreadInterpolation(node, interpolations) {
  return (
    node.type === 'SpreadElement' &&
    node.argument.type === 'Identifier' &&
    interpolations[node.argument.name] === null
  );
}

function isNode(node) {
  return node != null && typeof node.type === 'string';
}

function isEquivalentJSXText(a, b, key) {
  // JSX text node might have different values depending on indentation
  return (
    a.type === 'JSXText' && key === 'value' && a.value.trim() === b.value.trim()
  );
}

function isMetaData(key) {
  // these fields will likely always be different, so ignore them
  return key.match(/start|end|loc|importKind|comment|lines|raw|extra|__/i);
}
