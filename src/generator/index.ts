import { writeFileSync } from 'fs';
import BlueprintFragment from '../fragment';
import { DescribeAPIParams, GroupedByPath } from '../interfaces';

/**
 * Generates api blueprint spec from decorated classes with `DescribeRequest`
 *
 * @example
 * GenerateAPIBlueprint(
    { name: 'API Doc', description: 'Best DOC!!!!' },
    EndpointA,
    EndpointB,
    EndpointC,
    EndpointD,
    EndpointE,
  ).toString()
 *
 * @param params.name Name of the API
 * @param params.description Description of the API
 * @param targets A array with decorated classes
 * @returns `toString()`and `toFile()`
 */
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

  let str = BlueprintFragment.apiGroups(groupTargets);

  const formatedDescription =
    typeof description === 'function'
      ? description(BlueprintFragment.totalEndpoints, BlueprintFragment.totalGroups)
      : description;

  str = BlueprintFragment.apiName(name, formatedDescription) + str;

  return {
    toString: () => str,
    toFile: (filePath: string) => {
      writeFileSync(filePath, str);
    },
  };
};
