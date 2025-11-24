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
      "lightbox",
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

test("export declare const", () => {
  expect(
    processDts(
      "foo",
      ".",
      `
export declare const globalId = "dt7948";
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "foo" {
      export {
        globalId,
      } from "@types/foo";
    }
    "
  `);
});

test("export multiple things", () => {
  expect(
    processDts(
      "foo",
      ".",
      `
import Diff from './diff/base.js';
import { diffChars, characterDiff } from './diff/character.js';
import { diffWords, diffWordsWithSpace, wordDiff, wordsWithSpaceDiff } from './diff/word.js';
export { Diff, diffChars, characterDiff, diffWords, wordDiff, wordsWithSpaceDiff };
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "foo" {
      export {
        Diff,
        diffChars,
        characterDiff,
        diffWords,
        wordDiff,
        wordsWithSpaceDiff,
      } from "@types/foo";
    }
    "
  `);
});

test("package name with a slash", () => {
  expect(
    processDts(
      "@glint/template",
      ".",
      `
export type ModifierLike<S = unknown> = Invokable<
  (element: Get<S, 'Element'>, ...args: InvokableArgs<Get<S, 'Args'>>) => ModifierReturn
>;
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "@glint/template" {
      export {
        ModifierLike,
      } from "@types/glint__template";
    }
    "
  `);
});

test("package with submodules starting with - and a name with a slash", () => {
  expect(
    processDts(
      "@glint/template",
      "-private",
      `
export type FlattenBlockParams<T> = {
  [K in keyof T]: T[K] extends { Params: { Positional: infer U } } ? U : T[K];
};
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "@glint/template/-private" {
      export {
        FlattenBlockParams,
      } from "@types/glint__template/-private";
    }
    "
  `);
});

test("a @types package", () => {
  expect(
    processDts(
      "@types/rsvp",
      ".",
      `
export default RSVP;
`
    )
  ).toMatchInlineSnapshot(`
    "declare module "rsvp" {
      export {
        default,
      } from "@types/rsvp";
    }
    "
  `);
});
