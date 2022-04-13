export type Preset = Array<Step>;
export type Step = {
  name: string;
  step: AsyncFunction;
};
export type AsyncFunction = () => Promise<any>;
export type StepperOptions =
  | {
      from: number | undefined | null;
      to: number | undefined | null;
    }
  | undefined
  | null;
export type StepperEventType = 'progress';
export type StepperEventHandler = (a: {
  index: number;
  total: number;
  step: string;
}) => void;
