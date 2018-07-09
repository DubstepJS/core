/* @flow */

import type {StepperError} from '../core/index.js';
import {withJsonFile} from './with-json-file';

export const createRestorePoint = (file: string, e: StepperError) => {
  return withJsonFile(file, async data => {
    data.message = e.message;
    data.stack = e.stack;
    data.step = e.step;
    data.index = e.index;
  });
};
