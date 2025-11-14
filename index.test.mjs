/* eslint-disable qunit/require-expect */
import { expect, test } from "vitest";
import processDts from "./process-dts.js";

test("chart.js exports", () => {
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
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "chart.js" {
      export {
        Color,
        ScriptableContext,
        Scriptable,
        Chart,
        ChartItem,
        UpdateModeEnum,
        DatasetController,
      } from "@types/chart.js";
    }
    "
  `);
});

test("more chart.js exports", () => {
  expect(
    processDts(
      "chart.js",
      ".",
      `
// export const
export const registerables: readonly ChartComponentLike[];

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
        registerables,
        DecimationAlgorithm,
      } from "@types/chart.js";
    }
    "
  `);
});

test("no exports", () => {
  expect(
    processDts(
      "chart.js",
      ".",
      `
interface RadialParsedData {
  r: number;
}
`
    )
  ).toStrictEqual(undefined);
});

test("photoswipe exports", () => {
  expect(
    processDts(
      "photoswipe",
      "./lightbox",
      `
export default PhotoSwipeLightbox;
export type Type<T> = import('../types.js').Type<T>;
declare class PhotoSwipeLightbox extends PhotoSwipeBase {
}
  `
    )
  ).toMatchInlineSnapshot(`
    "declare module "photoswipe/lightbox" {
      export {
        default,
        Type,
      } from "@types/photoswipe/lightbox";
    }
    "
  `);
});

test("morphlex exports", () => {
  expect(
    processDts(
      "morphlex",
      ".",
      `
interface Options {
	ignoreActiveValue?: boolean;
}
export declare function morph(node: ChildNode, reference: ChildNode | string, options?: Options): void;
export declare function morphInner(element: Element, reference: Element | string, options?: Options): void;
export {};
  `
    )
  ).toMatchInlineSnapshot(`
    "declare module "morphlex" {
      export {
        morph,
        morphInner,
      } from "@types/morphlex";
    }
    "
  `);
});
