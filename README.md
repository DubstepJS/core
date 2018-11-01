# Dubstep

[![Build status](https://badge.buildkite.com/843d29b4898b20cd38d3a6509875979fbbd43314095540ed6c.svg)](https://buildkite.com/uberopensource/at-dubstep-slash-core)

A batteries-included step runner library, suitable for creating migration tooling, codemods, scaffolding CLIs, etc.

Dubstep has utility functions for file system operations, Babel-based codemodding, Git operations and others.

License: MIT

[Installation](#installation) | [Usage](#usage) | [API](#api) | [Recipes](#recipes) | [Motivation](#motivation)

---

## Installation

```sh
yarn add @dubstep/core
```

---

## Usage

```js
import {
  Stepper,
  step,
  gitClone,
  findFiles,
  withTextFile,
  getRestorePoint,
  removeFile,
  createRestorePoint,
} from '@dubstep/core';
import inquirer from 'inquirer';

async function run() {
  const state = {name: ''};
  const stepper = new Stepper([
    step('name', async () => {
      state.name = await inquirer.prompt({message: 'Name:', type: 'input'});
    }),
    step('clone', async () => {
      gitClone('some-scaffold-template.git', state.name);
    }),
    step('customize', async () => {
      const files = await findFiles('.', f => /src/.test(f));
      for (const file of files) {
        withTextFile(file, text => text.replace(/{{name}}/g, state.name));
      }
    }),
  ]);
  stepper
    .run({from: await getRestorePoint(restoreFile)})
    .then(() => removeFile(reportFile))
    .catch(e => createRestorePoint(reportFile, e));
}
run();
```

## API

[Core](#core) | [Utilities](#utilities) | [top](#dubstep)

All API entities are available as non-default import specifiers, e.g. `import {Stepper} from '@dubstep/core'`;

Utilities can also be imported individually, e.g. `import {findFiles} from '@dubstep/core/find-files'`;

### Core

#### Stepper

```js
import {Stepper} from '@dubstep/core';

class Stepper {
  constructor(preset: Preset)
  run(options: StepperOptions): Promise<void> // rejects w/ StepperError
  on(type: 'progress', handler: StepperEventHandler)
  off(type: 'progress', handler: StepperEventHandler)
}

type Preset = Array<Step>
type StepperOptions = ?{from: ?number, to: ?number}
type StepperEventHandler = ({index: number, total: number, step: string}) => void
```

A stepper can take a list of steps, run them in series and emit progress events.

#### step

```js
import {step} from '@dubstep/core';

step = (name: string, step: AsyncFunction) => Step;

type Step = {name: string, step: AsyncFunction};
type AsyncFunction = () => Promise<void>;
```

A step consists of a descriptive name and an async function.

#### StepperError

```js
import {StepperError} from '@dubstep/core';

class StepperError extends Error {
  constructor(error: Error, step: string, index: number),
  step: string,
  index: number,
  message: string,
  stack: string,
}
```

A stepper error indicates what step failed. It can be used for resuming execution via restore points.

### Utilities

[File system](#file-system) | [Babel](#babel) | [Git](#git) | [Restore points](#restore-points) | [Misc](#misc)

#### File system

##### findFiles

```js
import {findFiles} from '@dubstep/core';

findFiles = (root: string, filter: string => boolean) => Promise<Array<string>>;
```

Resolves to a list of file names that are descendants of `root` and match the condition from the `filter` function.

##### moveFile

```js
import {moveFile} from '@dubstep/core';

moveFile = (oldName: string, newName: string) => Promise<void>;
```

Moves an existing file or directory to the location specified by `newName`. If the file specified by `oldName` doesn't exist, it no-ops.

##### readFile

```js
import {readFile} from '@dubstep/core';

readFile = (file: string) => Promise<string>;
```

Reads the specified file into a UTF-8 string. If the file doesn't exist, the function throws a ENOENT error.

##### removeFile

```js
import {removeFile} from '@dubstep/core';

removeFile = (file: string) => Promise<void>;
```

Removes the specified file. If the file doesn't exist, it no-ops.

##### withIgnoreFile

```js
import {withIgnoreFile} from '@dubstep/core';

withIgnoreFile = (file: string, fn: IgnoreFileMutation) => Promise<void>;
type IgnoreFileMutation = (data: Array<string>) => Promise<?Array<string>>;
```

Opens a file, parses each line into a string, and calls `fn` with the array of lines. Then, writes the return value or the array back into the file.

If the file does not exist, `fn` is called with an empty array, and the file is created (including missing directories).

##### withJsFile

```js
import {withJsFile} from '@dubstep/core';

withJsFile = (file: string, fn: JsFileMutation) => Promise<void>;
type JsFileMutation = NodePath => void;
```

Opens a file, parses each line into a Babel NodePath, and calls `fn` with NodePath. Then, writes the modified AST back into the file.

If the file does not exist, `fn` is called with a empty program NodePath, and the file is created (including missing directories).

See the [Babel handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) for more information on `NodePath`'s API.

##### withJsFiles

```js
import {withJsFiles} from '@dubstep/core';

withJsFiles = (root: string, regexp: RegExp, fn: JsFileMutation) => Promise<void>;
type JsFileMutation = NodePath => void;
```

Runs `withJsFile` only on files that are descendant of `root` and whose absolute path match `regexp`.

See the [Babel handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) for more information on `NodePath`'s API.

##### withJsonFile

```js
import {withJsonFile} from '@dubstep/core';

withJsonFile = (file: string, fn: JsonFileMutation) => Promise<void>;
type JsonFileMutation = (data: any) => Promise<any>;
```

Opens a file, parses each line into a Javascript data structure, and calls `fn` with it. Then, writes the return value or modified data structure back into the file.

If the file does not exist, `fn` is called with an empty object, and the file is created (including missing directories).

##### withTextFile

```js
import {withTextFile} from '@dubstep/core';

withTextFile = (file: string, fn: TextFileMutation) => Promise<void>;
type TextFileMutation = (data: string) => Promise<?string>;
```

Opens a file, parses each line into a string, and calls `fn` with it. Then, writes the return value back into the file.

If the file does not exist, `fn` is called with an empty string, and the file is created.

##### writeFile

```js
import {writeFile} from '@dubstep/core';

writeFile = (file: string, data: string) => Promise<void>;
```

Writes `data` to `file`. If the file doesn't exist, it's created (including missing directories)

---

### Babel

##### ensureJsImports

```js
import {ensureJsImports} from '@dubstep/core';

ensureJsImports = (path: NodePath, code: string) => Array<Object<string, string>>;
```

If an import declaration in `code` is missing in the program, it's added. If it's already present, specifiers are added if not present. Note that the `NodePath` should be for a Program node, and that it is mutated in-place.

Returns a list of maps of specifier local names. The default specifier is bound to the key `default`.

If a specifier is already declared in `path`, but there's a conflicting specifier in `code`, the one in `path` is retained and returned in the output map. For example:

```js
// default specifier is already declared as `a`, but trying to redeclare it as `foo`
ensureJsImports(parseJs(`import a from 'a';`), `import foo from 'a'`);
// > {default: 'a'};
```

A `NodePath` can be obtained from `withJsFile`, `withJsFiles` or `parseJs`.

##### visitJsImport

```js
import {visitJsImport} from '@dubstep/core';

visitJsImport = (
  path: NodePath,
  code: string,
  handler: (importPath: NodePath, refPaths: Array<NodePath>) => void)
: void
```

This function is useful when applying codemods to specific modules which requires modifying the ast surrounding 
specific modules and their usage. This module works robustly across various styles of importing. For example:

```js
visitJsImport(
  parseJs(`
    import {a} from 'a';
    a('test')
    console.log(a);
  `),
  `import {a} from 'a';`,
  (importPath, refPaths) => {
    // importPath corresponds to the ImportDeclaration from 'a';
    // refPaths is a list of NodePaths corresponding to the usage of the a variable
  }
)
```

##### generateJs

```js
import {generateJs} from '@dubstep/core';

generateJs = (path: NodePath, options: GenerateJsObject) => string;
type GenerateJsOptions = ?{
  formatter: ?('babel' | 'prettier'),
  formatterOptions: ?Object,
};
```

Converts a Program `NodePath` into a Javascript code string. The default formatter is `prettier`. The `formatterOptions` object should be [prettier options map](https://prettier.io/docs/en/options.html) or a [babel generator options map](https://babeljs.io/docs/en/next/babel-generator.html#options) depending on which `formatter` is specified.

A `NodePath` can be obtained from `withJsFile`, `withJsFiles` or `parseJs`.

##### insertJsAfter

```js
import {insertJsAfter} from '@dubstep/core';

insertJsAfter = (path: NodePath, target: string, code: string, wildcards: Array<string>) => void
```

Inserts the statements in `code` after the `target` statement, transferring expressions contained in the `wildcards` list. Note that `path` should be a NodePath to a Program node..

```js
const path = parseJs(`const a = 1;`);
insertJsAfter(path, `const a = $VALUE`, `const b = 2;`, ['$VALUE']);

// before
const a = 1;

// after
const a = 1;
const b = 2;
```

It also supports spread wildcards:

```js
const path = parseJs(`const a = f(1, 2, 3);`);
insertJsAfter(path, `const a = f(...$ARGS)`, `const b = 2;`, ['$ARGS']);

// before
const a = f(1, 2, 3);

// after
const a = f(1, 2, 3);
const b = 2;
```

##### insertJsBefore

```js
import {insertJsBefore} from '@dubstep/core';

insertJsBefore = (path: NodePath, target: string, code: string, wildcards: Array<string>) => void
```

Inserts the statements in `code` before the `target` statement, transferring expressions contained in the `wildcards` list. Note that `path` should be a NodePath to a Program node..

```js
const path = parseJs(`const a = 1;`);
insertJsBefore(path, `const a = $VALUE`, `const b = 2;`, ['$VALUE']);

// before
const a = 1;

// after
const b = 2;
const a = 1;
```

It also supports spread wildcards:

```js
const path = parseJs(`const a = f(1, 2, 3);`);
insertJsBefore(path, `const a = f(...$ARGS)`, `const b = 2;`, ['$ARGS']);

// before
const a = f(1, 2, 3);

// after
const b = 2;
const a = f(1, 2, 3);
```

##### parseJs

```js
import {parseJs} from '@dubstep/core';

parseJs = (code: string, options: ParserOptions) => NodePath;
type ParserOptions = ?{mode: ?('typescript' | 'flow')};
```

Parses a Javascript code string into a `NodePath`. The default `mode` is `flow`. The parser configuration follows [Postel's Law](https://en.wikipedia.org/wiki/Robustness_principle), i.e. it accepts all syntax options supported by Babel in order to maximize its versatility.

See the [Babel handbook](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md) for more information on `NodePath`'s API.

##### removeJsImports

```js
import {removeJsImports} from '@dubstep/core';

removeJsImports = (path: NodePath, code: string) => void
```

Removes the specifiers declared in `code` for the relevant source. If the import declaration no longer has specifiers after that, the declaration is also removed. Note that `path` should be a NodePath for a Program node.

In addition, it removes all statements that reference the removed specifier local binding name.

A `NodePath` can be obtained from `withJsFile`, `withJsFiles` or `parseJs`.

##### replaceJs

```js
import {replaceJs} from '@dubstep/core';

replaceJs = (path: NodePath, source: string, target: string, wildcards: Array<string>) => void;
```

Replaces code matching `source` with the code in `target`, transferring expressions contained in the `wildcards` list. Note that `path` should be a NodePath to a Program node.

```js
replaceJs(
  parseJs(`complex.pattern('foo', () => 'user code')`),
  `complex.pattern('foo', $CALLBACK)`,
  `differentPattern($CALLBACK)`,
  ['$CALLBACK']
);

complex.pattern('foo', () => 'user code'); // before
differentPattern(() => 'user code'); // after
```

It also supports spread wildcards:

```js
replaceJs(
  parseJs('foo.bar(1, 2, 3);'),
  `foo.bar(...$ARGS)`,
  `transformed(...$ARGS)`,
  ['$ARGS']
);

foo.bar(1, 2, 3); // before
transformed(1, 2, 3); // after
```

---

#### Git

##### gitClone

```js
import {gitClone} from '@dubstep/core';

gitClone = (repo: string, target: string) => Promise<void>;
```

Clones a repo into the `target` directory. If the directory exists, it no-ops.

##### gitCommit

```js
import {gitCommit} from '@dubstep/core';

gitCommit = (message: string) => Promise<void>;
```

Creates a local commit containing all modified files with the specified message (but does not push it to origin).

---

#### Restore points

##### createRestorePoint

```js
import {createRestorePoint} from '@dubstep/core';

createRestorePoint = (file: string, e: StepperError) => Promise<void>;
```

Creates a restore file that stores `StepperError` information.

##### getRestorePoint

```js
import {getRestorePoint} from '@dubstep/core';

getRestorePoint = (file: string) => Promise<number>;
```

Resolves to the index of the failing step recorded in a restore file.

---

#### Misc

##### exec

```js
import {exec} from '@dubstep/core';

exec = (command: string) => Promise<string>;
```

Runs a CLI command in the shell and resolves to `stdout` output.

---

## Recipes

### Preset composition

```js
const migrateA = [
  step('foo', async () => gitClone('some-repo.git', 'my-thing')),
  step('bar', async () => moveFile('a', 'b')),
];
```

A task that needs to run the `migrateA` preset but also need to run a similar task `migrateB` could be expressed in terms of a new preset:

```js
const migrateAll = [...migrateA, ...migrateB];
```

We retain full programmatic control over the steps, and can compose presets with a high level of granularity:

```js
const migrateAndCommit = [
  ...migrateA,
  async () => gitCommit('migrate a'),
  ...migrateB,
  async () => gitCommit('migrate b'),
];
```

### Restore points

If a step in a preset fails, it may be desirable to resume execution of the preset from the failing step (as opposed to restarting from scratch). Resuming a preset can be useful, for example, if a manual step is needed in the middle of a migration in order to unblock further steps.

```js
const restoreFile = 'migration-report.json';
new Stepper([ /* ... */ ]).run({
  from: await getRestorePoint(restoreFile),
}).then(
  () => removeFile(restoreFile),
  e => createRestorePoint(restoreFile, e),
);
```

### Javascript codemods

```js
// fix-health-path-check.js
export const fixHealthPathCheck = async () => {
  await withJsFiles(
    '.',
    f => f.match(/src\/.\*\.js/),
    path => {
      return replaceJs(path, `ctx.url === '/health'`, `ctx.path === '/health'`);
    }
  );
};

// index.js
import {fixHealthPathCheck} from './fix-health-path-check';
new Stepper([
  step('fix health path check', () => fixHealthPathCheck()),
  // ...
]).run();
```

### Codemods with state

```js
// fix-health-path-check.js
export const fixHealthPathCheck = async ({path}) => {
  const old = '/health';
  withJsFiles('.', f => f.match(/src\/.*\.js/), path => {
    replaceJs(path, `ctx.url === '${old}'`, `ctx.path === '${path}'`)
  });
  return old;
}

// index.js
import {fixHealthPathCheck} from './fix-health-path-check';
const state = {path: '', old: ''};
new Stepper([
  step('get path', async () => {
    state.path = await inquirer.prompt({
      message: 'Replace with what',
      type: 'input',
    });
  }),
  step('fix health path check', () => {
    state.old = await fixIt({path: state.path});
  }),
  step('show old', async () => {
    console.log(state.old);
  })
]).run();
```

### Leveraging Babel APIs (e.g. @babel/template)

```js
import template from '@babel/template';

export const compatPluginRenderPageSkeleton = ({pageSkeletonConfig}) => {
  const build = template(`foo($VALUE)`);
  withJsFiles(
    '.',
    f => f.match(/src\/.\*\.js/),
    path => {
      path.traverse({
        FunctionExpression(path) {
          if (someCondition(path)) {
            path.replaceWith(build({VALUE: 1}));
          }
        },
      });
    }
  );
};
```

### Complex state management

Since the core step runner library is agnostic of state, it's possible to use state management libraries like Redux to make complex state machines more maintainable, and to leverage the ecosystem for things like file persistence.

```js
const rootReducer = (state, action) => ({
  who: action.type === 'IDENTIFY' ? action.who : state.who || '',
});
const store = redux.createStore(
  rootReducer,
  createPersistenceEnhancer('state.json') // save to disk on every action
);
new Stepper([
  step('who', async () => {
    const who = await inquirer.prompt({message: 'who?', type: 'input'});
    store.dispatch({type: 'IDENTIFY', who});
  }),
  step('resumable', async () => {
    const {who} = store.getState(); // restore state from disk if needed
    console.log(who);
  }),
]).run();
```

---

## Motivation

Maintaining Javascript codebases at scale can present some unique challenges. In large enough organizations, it's not uncommon to have dozens or even hundreds of projects. Even if projects were diligently maintained, it's common for a major version bump in a dependency to require code migrations. Keeping a large number of projects up-to-date with security updates and minimizing waste of development time on repetitive, generalizable code migrations are just some of the ways Dubstep can help maintain high code quality and productivity in large organizations.

Dubstep aims to provide reusable well-tested utilities for file operations, Javascript codemodding and other tasks related to codebase migrations and upgrades. It can also be used to implement granular scaffolding CLIs.

### Prior art

Dubstep aims to be a one-stop shop for generic codebase transformation tasks. It was designed by taking into consideration experience with the strengths and weaknesses of several existing tools.

Javascript-specific codemodding tools such as jscodeshift or babel-codemods can be limited when it comes to cross-file concerns and these tools don't provide adequate platforms for transformations that fall outside of the scope of Javascript parsing (for example, they can't handle JSON or .gitignore files).

Shell commands are often used for tasks involving heavy file manipulation, but large shell scripts typically suffer from poor portability/readability/testability. The Unix composition paradigm is also inefficient for composing Babel AST transformations.

Picking-and-choosing NPM packages can offer a myriad of functionality, but there's no cohesiveness between packages, and they often expose inconsistent API styles (e.g. callback-based). Dubstep can easily integrate with NPM packages by leveraging ES2017 async/await in its interfaces.

### Why migration tooling

Generallly speaking, there are two schools of thought when it comes to maintaining years-long projects at large organizations.

The "don't fix what ain't broken" approach is a conservative risk management strategy. It has the benefit that it requires little maintenance effort from a project owner, but it has the downside that projects become a source of technology fragmentation over time. With this approach, all technical debt that accumulates over the years eventually needs to be paid in one big lump sum (i.e. an expensive rewrite).

Another downside is that this approach doesn't work well with a push maintenance model. Typically, dependencies in small projects are managed via a pull model, i.e. the project owner updates dependencies at their own convenience. However, in typical large cross-team monorepos, dependencies are managed via a push model, i.e. whoever makes a change to a library is responsible to rolling out version bumps and relevant codemods to all downstreams using that library.

The "always update" approach aims to keep codebases always running on the latest-and-greatest versions of their dependencies, and to reduce duplication of effort (e.g. in bug fixes across duplicated code or fragmented/similar technologies). This approach pays off technical debt incrementally, but consistently across codebases, with the help of tooling to ensure that quality in codebases remains high as improvements are made to upstream libraries (both as patches and breaking changes). The downside of this approach is that it requires a higher investment in terms of maintenance effort, but this is typically offset by offloading the cost of migrations/codemods to a platform/infrastructure team, rather than having every project team waste time on similar/repetitive manual migration tasks.

Regardless of which maintenance model an organization uses, migration tooling can be useful anywhere non-trivial improvements need to be made. Some examples include moving away from proprietary frameworks towards easier-to-hire-for open source ones, or moving away from undesirable technologies towards desirable ones (e.g. if a company decides to migrate from Angular 1.x to React for whatever reason).

---
