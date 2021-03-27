import { GenerateAPIBlueprint, DescribeRequest } from '.';
@DescribeRequest({
  group: 'Things',
  method: 'GET',
  name: 'Get Various Things',
  path: '/v1/things',
  requestGroup: 'VariousThings',
  headers: {
    'x-random': 'srtring',
  },
  response: {
    data: [],
  },
})
class EndpointA {}

@DescribeRequest({
  group: 'Things',
  method: 'DELETE',
  name: 'Remove a thing',
  path: '/v1/things',
  requestGroup: 'VariousThings',
  headers: {
    'x-random': 'srtring',
  },
  response: {
    data: [],
  },
})
class EndpointB {}

@DescribeRequest({
  group: 'Auth',
  method: 'POST',
  name: 'Authenticate User',
  path: '/v1/auth/login',
  requestGroup: 'Login',
  headers: {
    'x-random': 'srtring',
  },
  response: {
    data: [],
  },
})
class EndpointC {}

@DescribeRequest({
  group: 'Auth',
  method: 'POST',
  name: 'Renew Token',
  path: '/v1/auth/renew-token',
  requestGroup: 'RenewToken',
  headers: {
    'x-random': 'srtring',
  },
  response: {
    data: [],
  },
})
class EndpointD {}

@DescribeRequest({
  group: 'Misc',
  method: 'PUT',
  name: 'Random Req',
  path: '/v1/misc/',
  requestGroup: 'RandomReq',
  headers: {
    'x-random': 'srtring',
  },
  response: {
    data: [],
  },
})
class EndpointE {}

console.log(
  GenerateAPIBlueprint(
    { name: 'API Doc', description: 'Best DOC!!!!' },
    EndpointA,
    EndpointB,
    EndpointC,
    EndpointD,
    EndpointE,
  ).toString(),
);
