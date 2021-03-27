import 'reflect-metadata';
import { writeFileSync } from 'fs';
import BlueprintFragment from '../fragment';
import { DescribeAPIParams, GroupedByPath } from '../interfaces';

export const GenerateAPIBlueprint = (params: DescribeAPIParams, ...targets: (new () => any)[]) => {
  const groupTargets: GroupedByPath = {};
  const { name, description } = params;

  targets.forEach(target => {
    const { group, path } = BlueprintFragment.getMeta(target);

    if (groupTargets[group] === undefined) {
      groupTargets[group] = {};
    }
    if (groupTargets[group][path] === undefined) {
      groupTargets[group][path] = [];
    }
    groupTargets[group][path].push(target);
  });

  let str = BlueprintFragment.apiName(name, description);
  str += BlueprintFragment.apiGroups(groupTargets);

  return {
    toString: () => str,
    toFile: (filePath: string) => {
      writeFileSync(filePath, str);
    },
  };
};
