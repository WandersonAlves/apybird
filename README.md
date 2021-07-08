![logo](https://github.com/apiaryio/api-blueprint/raw/master/assets/logo_apiblueprint.png)

<sub>API Blueprint logo</sub>

# apybird :bird:

Build API Blueprint file (.apib) from decorators! Simple and easy

## Motivation

I haven't found a decorator solution to build a API Blueprint spec. So a decide do make one myself. The filosophy is to use generics to ensure always up to date documentation about headers, body and response. So when data needs to change, you change your interface, and TypeScript will show a error telling you about the change, so you'll update your docs always as needed because your build will break if you not do.

## Usage

1. `yarn add apybird -D`
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
import { BuildApybirdDoc } from 'apybird/lib/builder';

BuildApybirdDoc({
  name: 'awesome-api',
  description: 'Fancy description',
  filePath: './docs/api.apib',
});
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

## API

### `BuildApybirdDoc (details: BuilderParams) => void`

`BuildApybirdDoc` accepts a parameter that matchs `BuilderParams` and is used to generate the API Blueprint file.

#### name - `string` (**REQUIRED**)

The name of your API

#### description - `string` (**REQUIRED**)

Some description for your API

#### filePath - `string` (**REQUIRED**)

Where should `apybird` place your documentation

#### pattern - `string` (**OPTIONAL**)

Change the default pattern (*Case.ts) to something else. The command that will use this is `find . -name '${details.pattern || '*Case.ts'}'`and can be found on`src/builder/index.ts`.

```typescript
BuildApybirdDoc({
  name: 'awesome-api',
  description: 'Fancy description',
  filePath: './docs/api.apib',
  pattern: '*Case.ts',
});
```

### `DescribeRequest<H,B,R>(params: DescribeRequestParams<H,B,R>) => void`

The `DescribeRequest` decorator is responsable for adding metadata to your class and later be used by `BuildApybirdDoc`.

#### group - `string` (**REQUIRED**)

Group of request. Translates to `# Group <value>`

#### path - `string` (**REQUIRED**)

Path of request. Translates to `## VariousThings [<value>]`

#### method - `string` (**REQUIRED**)

Method of the request. Translates to `### <value> Get Various Things [<value>]`

#### name - `string` (**REQUIRED**)

Name of the request. Translates to `### GET <value> [GET]`

#### requestGroup - `string`(**REQUIRED**)

Group of request in case multiple methods points to the same route. Translates to `## <value> [/v1/things]`

#### headers - `H` (**OPTIONAL**)

A object that represents the headers of the endpoint. Uses the `H` generic

#### body - `B` (**OPTIONAL**)

A object that represents the body of the endpoint. Uses the `B` generic

#### response - `R` (**OPTIONAL**)

The default 200 response. If you use `responses`, it'll be used instead of this. Uses the `R` generic

#### responses - `[Property in keyof R]: R[Property]` (**OPTIONAL**)

Responses object. The keys of the object are the status code

```ts
type ReturnType = { status: string };
@DescribeRequest<any, any, { 200: ReturnType; 400: ReturnType; 500: ReturnType }>({
  group: 'Things',
  method: 'GET',
  name: 'Get Various Things',
  path: '/v1/things',
  requestGroup: 'VariousThings',
  headers: {
    'x-random': 'string',
  },
  responses: {
    200: {
      status: 'OK',
    },
    400: {
      status: 'NOT OK DUDE',
    },
    500: {
      status: 'DEFINITIVELY NOT OK',
    },
  },
})
class TestSubject {}
```

#### description: `string` (**OPTIONAL**)

Describe the endpoint

## Know Issues

> If you're using `inversifyjs`, make sure that the classes that match the pattern used to build the docs **DON'T** import **ANY** file that uses something from `inversifyjs`.

```typescript
// SomeCase.ts matchs the default pattern "*Case.ts"
import { Range } from '../../../../utils'; // A import with the problem

@injectable()
export default class SomeCase implements UseCase {
  @inject(AxiosHttpHandle) private http: AxiosHttpHandle;
  @inject(PendingPaymentsCase) private pendingPayments: PendingPaymentsCase;

  @ExceptionHandler()
  async execute({ headers }: UseCaseParams<GetOrderMgmtSummaryHeaders>) {
    /** CODE ** /
  }
}

/**********************************/
// Utils.ts
// Some code that fetchs a class from a container
export const GenerateRoute = (obj: Newable, headerConvertion?: HeaderConvert) => ExpressRouterAdapter.adapt(GetFromContainer(obj), headerConvertion);
// And the Range function
export const Range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (v, k) => k + start);
```

This leads to:
`(node:91013) UnhandledPromiseRejectionWarning: Error: @inject called with undefined this could mean that the class undefined has a circular dependency problem. You can use a LazyServiceIdentifer to overcome this limitation.`

You can fix this by separating the `Range` function into another file that not imports something that uses the `inversifyjs` container

## TODO

- [x] Unit tests
- [ ] Documentation on code and better markdown docs
- [ ] Nice logo?
- [ ] Cover more api blueprint syntax (query and params of a endpoint)
