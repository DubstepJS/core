// @flow
export type Preset = Array<Step>;
export type Step = {name: string, step: AsyncFunction};
export type AsyncFunction = () => Promise<any>;
export type StepperOptions = ?{from: ?number, to: ?number};
export type StepperEventType = 'progress';
export type StepperEventHandler = ({
  index: number,
  total: number,
  step: string,
}) => void;
