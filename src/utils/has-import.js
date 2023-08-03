// @flow
import type {ParserOptions} from './parse-js.js';
import {visitJsImport} from './visit-js-import.js';
import type {BabelPath, Program} from '@ganemone/babel-flow-types';

export const hasImport = (
  path: BabelPath<Program>,
  code: string,
  options: ParserOptions
) => {
  let matched = false;
  visitJsImport(
    path,
    code,
    () => {
      matched = true;
    },
    options
  );
  return matched;
};
