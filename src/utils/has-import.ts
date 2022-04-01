import {visitJsImport} from './visit-js-import';
import type {BabelPath, Program} from '@ganemone/babel-flow-types';

export const hasImport = (path: BabelPath<Program>, code: string) => {
  let matched = false;
  visitJsImport(path, code, () => {
    matched = true;
  });
  return matched;
};
