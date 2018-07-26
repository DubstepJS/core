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

import {Stepper, step, StepperError} from './index.js';

test('test', () => {
  const fn = async () => {};
  expect(step('a', fn)).toEqual({name: 'a', step: fn});
});

test('Stepper', async () => {
  const a = jest.fn();
  const b = jest.fn();
  const progress = jest.fn();
  const noop = jest.fn();
  const stepper = new Stepper([step('a', a), step('b', b)]);
  stepper.on('progress', progress);
  stepper.on(eval('"invalid"'), noop); // eval prevents flow nag when attempting to cover else branch
  expect(stepper.progress.size).toBe(1);

  await stepper.run({from: 0, to: 2});
  expect(a.mock.calls.length).toBe(1);
  expect(b.mock.calls.length).toBe(1);
  expect(progress.mock.calls).toEqual([
    [{index: 0, total: 2, step: 'a'}],
    [{index: 1, total: 2, step: 'b'}],
  ]);

  stepper.off('progress', progress);
  stepper.off(eval('"invalid"'), noop); // eval prevents flow nag when attempting to cover else branch
  expect(stepper.progress.size).toBe(0);

  const failing = new Stepper([
    step('failing', async () => {
      throw new Error('error');
    }),
  ]);
  await expect(failing.run()).rejects.toThrow(StepperError);
  await expect(failing.run()).rejects.toThrow('error');
});

test('StepperError', () => {
  const {message, step} = new StepperError(new Error('a'), 'b', 0);
  expect(message).toBe('a');
  expect(step).toBe('b');
});
