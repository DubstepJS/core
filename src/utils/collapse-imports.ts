import type {NodePath} from '@babel/traverse';
import type {Program, ImportDeclaration, Statement} from '@babel/types';

export function collapseImports(program: NodePath<Program>): NodePath<Program> {
  const importStatements = program.node.body.filter(item => {
    return item.type === 'ImportDeclaration';
  }) as Array<ImportDeclaration>;
  const filtered: Statement[] = [];
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
