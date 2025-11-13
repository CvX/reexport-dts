/* eslint-disable qunit/require-expect */
import { expect, test } from "vitest";
import processDts from "./process-dts.js";

test("todo", () => {
  expect(
    processDts(
      "chart.js",
      ".",
      `
// ignore imports
import { TimeUnit } from './adapters';

// re-export
export { Color } from './color';

// export interface
export interface ScriptableContext<TType extends ChartType> {
  active: boolean;
}

// export type
export type Scriptable<T, TContext> = T | ((ctx: TContext, options: AnyObject) => T);

// export declare class
export declare class Chart<
  TType extends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
  > {
  readonly platform: BasePlatform;
}

// export const
export const registerables: readonly ChartComponentLike[];

// export declare type
export declare type ChartItem =
  | string
  | CanvasRenderingContext2D;

// export declare enum
export declare enum UpdateModeEnum {
  resize = 'resize',
  reset = 'reset',
}

// export class
export class DatasetController<
  TType extends ChartType = ChartType
> {
  constructor(chart: Chart, datasetIndex: number);
}

// export const enum
export const enum DecimationAlgorithm {
  lttb = 'lttb',
  minmax = 'min-max',
}
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "chart.js" {
      export {
        Color,
        ScriptableContext,
        Scriptable,
        Chart,
        registerables,
        ChartItem,
        UpdateModeEnum,
        DatasetController,
        DecimationAlgorithm,
      } from "@types/chart.js";
    }
    "
  `);
});
