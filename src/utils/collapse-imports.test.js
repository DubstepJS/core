// @flow
import { collapseImports } from "./collapse-imports";
import { parseJs } from "./parse-js";
import { generateJs } from "./generate-js";

test("collapseImports", () => {
  expect(
    generateJs(
      collapseImports(
        parseJs(`
  import A, {B} from 'a';
  import {C} from 'c';
  import {D, E} from 'a';
  import F from 'c';
  
  console.log(F);
  `)
      )
    )
  ).toMatchInlineSnapshot(`
"
  import A, { B, D, E } from 'a';
  import F, { C } from 'c';

  console.log(F);
  "
`);
});

test("collapseImports with type imports", () => {
  expect(
    generateJs(
      collapseImports(
        parseJs(`
  import A, {B} from 'a';
  import type C, {D} from 'a';
  import type {E} from 'a';
  import {type F, G} from 'a';
  import test from 'b';

  console.log(F);
  `)
      )
    )
  ).toMatchInlineSnapshot(`
"
  import A, { B, type F, G } from 'a';
  import type C, { D, E } from 'a';
  import test from 'b';

  console.log(F);
  "
`);
});
