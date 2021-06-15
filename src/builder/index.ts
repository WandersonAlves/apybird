import ClassRegister from '../decorators/register';
import { execSync } from 'child_process';
import { BuilderParams } from '../interfaces';
import { GenerateAPIBlueprint } from '..';

export const BuildApybirdDoc = (details: BuilderParams) => {
  const result = execSync(`find . -name '${details.pattern || '*Case.ts'}'`);
  const classes = [];
  try {
    console.info(result.toString());
    result
      .toString()
      .split('\n')
      .forEach(_module => {
        if (_module) {
          classes.push(import(`.${_module}`));
        }
      });
  } catch (e) {}

  if (!classes.length) {
    console.error("can't find any apybird decorated classes");
    process.exit(1);
  }

  Promise.all(classes).then(_result => {
    GenerateAPIBlueprint(
      {
        name: details.name,
        description: details.description,
      },
      ...ClassRegister.getAll(),
    ).toFile(details.filePath);
    console.info('Done!');
  });
};
