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
import { BuildApybirdDoc } from 'apybird';

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

`BuildApybirdDoc` accepts a param that matchs `BuilderParams`:

> BuilderParams.name **REQUIRED**
The name of your API

> BuilderParams.description **REQUIRED**
Some description for your API

> BuilderParams.filePath **REQUIRED**
Where should `apybird` place your documentation

> BuilderParams.pattern **OPTIONAL**
Change the default pattern ('*Case.ts') to something else

```typescript
BuildApybirdDoc({
  name: 'awesome-api',
  description: 'Fancy description',
  filePath: './docs/api.apib',
  pattern: '*Case.ts'
});
```

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
```(node:91013) UnhandledPromiseRejectionWarning: Error: @inject called with undefined this could mean that the class undefined has a circular dependency problem. You can use a LazyServiceIdentifer to  overcome this limitation.```

You can fix this by separating the `Range` function into another file that not imports something that uses the `inversifyjs` container

> Webpack build brokes after using apybird

Just add `externals` to webpack:

```js
const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    app: './dist/index.js',
  },
  // Add this field
  externals: {
    apybird: 'apybird'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'build.js',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: true,
    removeAvailableModules: true,
    mangleExports: 'size'
  },
};
```

## TODO

- Unit tests
- Documentation on code and better markdown docs
- Nice logo?
- Cover more api blueprint syntax
