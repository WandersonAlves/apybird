#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { argv, argv0 } from 'process';
import { ClassRegister, GenerateAPIBlueprint } from '../lib';

let apybirdSpec;
try {
  apybirdSpec = JSON.parse(readFileSync('.apybird.json').toString());
}
catch (e) {
  console.error('apybird JSON file not found')
  console.error(e);
  process.exit(1);
}

const result = execSync(`find . -name '${argv0 || '*Case.ts'}'`);
const classes = [];
try {
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
  console.error("can't find any apybird decorated classes")
  process.exit(1);
}

Promise.all(classes).then(_result => {
  GenerateAPIBlueprint(
    {
      name: apybirdSpec.name,
      description: apybirdSpec.description,
    },
    ...ClassRegister.getAll(),
  ).toFile(argv[1]);
  console.info('Done!');
});
