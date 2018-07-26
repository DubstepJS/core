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

export type Preset = Array<Step>;
export type Step = {name: string, step: AsyncFunction};
export type AsyncFunction = () => Promise<void>;
export type StepperOptions = ?{from: ?number, to: ?number};
export type StepperEventType = 'progress';
export type StepperEventHandler = ({
  index: number,
  total: number,
  step: string,
}) => void;

export class Stepper {
  preset: Preset;
  progress: Set<StepperEventHandler>;
  constructor(preset: Preset) {
    this.preset = preset;
    this.progress = new Set();
  }
  async run(options: StepperOptions) {
    const from = options && options.from ? options.from : 0;
    const to = options && options.to ? options.to : this.preset.length;
    const slice = this.preset.slice(from, to);
    for (let i = 0; i < slice.length; i++) {
      const {name, step} = this.preset[i];
      await Promise.resolve()
        .then(step)
        .catch(e => {
          throw new StepperError(e, name, from + i);
        });
      for (const fn of this.progress) {
        fn({index: from + i, total: to - from, step: name});
      }
    }
  }
  on(type: StepperEventType, fn: StepperEventHandler) {
    if (type === 'progress') this.progress.add(fn);
  }
  off(type: StepperEventType, fn: StepperEventHandler) {
    if (type === 'progress') this.progress.delete(fn);
  }
}

export const step = (name: string, step: AsyncFunction): Step => ({name, step});

export class StepperError extends Error {
  step: string;
  index: number;
  constructor(error: Error, step: string, index: number) {
    super(error.message);
    this.stack = error.stack;
    this.step = step;
    this.index = index;
  }
}

export * from '../utils/create-restore-point.js';
export * from '../utils/ensure-js-imports.js';
export * from '../utils/exec.js';
export * from '../utils/find-files.js';
export * from '../utils/generate-js.js';
export * from '../utils/get-restore-point.js';
export * from '../utils/git-clone.js';
export * from '../utils/git-commit.js';
export * from '../utils/insert-js-after.js';
export * from '../utils/insert-js-before.js';
export * from '../utils/move-file.js';
export * from '../utils/parse-js.js';
export * from '../utils/read-file.js';
export * from '../utils/remove-file.js';
export * from '../utils/remove-js-imports.js';
export * from '../utils/replace-js.js';
export * from '../utils/with-ignore-file.js';
export * from '../utils/with-js-file.js';
export * from '../utils/with-json-file.js';
export * from '../utils/with-text-file.js';
export * from '../utils/write-file.js';
