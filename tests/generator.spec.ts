import { expect } from 'chai';
import { DescribeRequest, GenerateAPIBlueprint } from '../src';
import ClassRegister from '../src/decorators/register';
import BlueprintFragment from '../src/fragment';

@DescribeRequest<any, any, any>({
  group: 'TestGroup',
  method: 'GET',
  name: 'Clients',
  path: '/v1/test',
  requestGroup: 'TestClients',
  response: { hello: 'test' },
})
class TestSubject {}

describe('Generator', () => {
  beforeEach(() => {
    BlueprintFragment.totalEndpoints = 0;
    BlueprintFragment.totalGroups = 0;
    ClassRegister.reset();
  });
  it('Should add total endpoints and groups to apiName fragment section', () => {
    const result = GenerateAPIBlueprint(
      {
        description: (totalEndpoints, totalGroups) => `Total of: ${totalEndpoints} endpoints and ${totalGroups} groups`,
        name: 'TestAPI',
      },
      TestSubject,
    ).toString();
    expect(result).contain('Total of: 1 endpoints and 1 groups');
  });
});
