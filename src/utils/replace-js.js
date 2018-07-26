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
