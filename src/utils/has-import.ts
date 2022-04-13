import {visitJsImport} from './visit-js-import';
import type {NodePath} from '@babel/traverse';
import type {Program} from '@babel/types';

export const hasImport = (path: NodePath<Program>, code: string) => {
  let matched = false;
  visitJsImport(path, code, () => {
    matched = true;
  });
  return matched;
};
