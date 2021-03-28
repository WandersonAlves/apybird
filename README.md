![logo](https://github.com/apiaryio/api-blueprint/raw/master/assets/logo_apiblueprint.png)

<sub>API Blueprint logo</sub>

# apybird :bird:

Build API Blueprint file (.apib) from decorators! Simple and easy

## Motivation

I haven't found a decorator solution to build a API Blueprint spec. So a decide do make one myself. The filosophy is to use generics to ensure always up to date documentation about headers, body and response. So when data needs to change, you change your interface, and TypeScript will show a error telling you about the change, so you'll update your docs always as needed because your build will break if you not do.

## Usage

1. `yarn add apybird`
2. Decorate your class like this:

```typescript
// Without the generics, TypeScript will not tell you to update your doc :D
@DescribeRequest<HeaderInterface, BodyInterface, ResponseInterface>({
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

## TODO

- Unit tests
- Documentation on code and better markdown docs
- Nice logo?
- Cover more api blueprint syntax