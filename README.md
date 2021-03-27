# apybird

Build API Blueprint file (.apib) from decorators!

## Usage

1. `yarn add apybird`
2. Decorate your class like this:

```typescript
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
```

3. Generate your api blueprint
```typescript
import { GenerateAPIBlueprint } from 'apybird';

GenerateAPIBlueprint(
  { name: 'API Doc', description: 'Best DOC!!!!' },
  EndpointA,
  EndpointB,
  EndpointC,
  EndpointD,
  EndpointE,
).toString();

// OR

GenerateAPIBlueprint(
  { name: 'API Doc', description: 'Best DOC!!!!' },
  EndpointA,
  EndpointB,
  EndpointC,
  EndpointD,
  EndpointE,
).toFile('<file-path>');
```

4. Use your blueprint where you want
```apib
FORMAT: 1A

# API Doc
Best DOC!!!!

# Group Things
## VariousThings [/v1/things]
### GET Get Various Things [GET]
+ Request (application/json)
  + Headers
   x-random:srtring
+ Response 200 (application/json)
{
  "data": []
}
### DELETE Remove a thing [DELETE]
+ Request (application/json)
  + Headers
   x-random:srtring
+ Response 200 (application/json)
{
  "data": []
}
# Group Auth
## Login [/v1/auth/login]
### POST Authenticate User [POST]
+ Request (application/json)
  + Headers
   x-random:srtring
+ Response 200 (application/json)
{
  "data": []
}
## RenewToken [/v1/auth/renew-token]
### POST Renew Token [POST]
+ Request (application/json)
  + Headers
   x-random:srtring
+ Response 200 (application/json)
{
  "data": []
}
# Group Misc
## RandomReq [/v1/misc/]
### PUT Random Req [PUT]
+ Request (application/json)
  + Headers
   x-random:srtring
+ Response 200 (application/json)
{
  "data": []
}
```
