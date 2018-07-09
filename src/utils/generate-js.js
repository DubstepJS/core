/* @flow */

import generate from '@babel/generator';
import prettier from 'prettier';
import {writeFile} from './write-file.js';

export type GenerateJsOptions = ?{
  formatter: ?('babel' | 'prettier'),
  formatterOptions: ?Object,
};

export const generateJs = (path: NodePath, options: GenerateJsOptions) => {
  const formatter = options ? options.formatter : 'prettier';
  const formatterOptions = options ? options.formatterOptions : {};
  switch (formatter) {
    case 'babel':
      return generate(path.node, formatterOptions);
    case 'prettier':
    default:
      // placeholder is needed to prevent prettier from short-circuiting before the parser runs
      return prettier.format('__placeholder__', {
        parser() {
          return path.node;
        },
        ...formatterOptions,
      });
  }
};
