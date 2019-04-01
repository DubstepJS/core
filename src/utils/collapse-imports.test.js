// @flow
import {collapseImports} from './collapse-imports';
import {parseJs} from './parse-js';
import {generateJs} from './generate-js';

test('collapseImports', () => {
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
