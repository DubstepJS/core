/* @flow */

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
  const {message, step} = new StepperError('a', 'b', 0);
  expect(message).toBe('a');
  expect(step).toBe('b');
});
