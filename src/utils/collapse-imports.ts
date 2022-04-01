// @flow
import type {
  BabelPath,
  Program,
  ImportDeclaration,
} from '@ganemone/babel-flow-types';

export function collapseImports(
  program: BabelPath<Program>
): BabelPath<Program> {
  // $FlowFixMe
  const importStatements: Array<ImportDeclaration> = program.node.body.filter(
    item => {
      return item.type === 'ImportDeclaration';
    }
  );
  let filtered = [];
  for (let index = 0; index < importStatements.length; index++) {
    const statement = importStatements[index];
    const source = statement.source.value;
    const importKind = statement.importKind;
    for (
      let nextIndex = index + 1;
      nextIndex < importStatements.length;
      nextIndex++
    ) {
      const nextStatement = importStatements[nextIndex];
      if (
        nextStatement.source.value === source &&
        nextStatement.importKind === importKind
      ) {
        statement.specifiers = statement.specifiers.concat(
          nextStatement.specifiers
        );
        filtered.push(nextStatement);
      }
    }
  }
  program.node.body = program.node.body.filter(item => {
    return filtered.indexOf(item) === -1;
  });
  return program;
}
