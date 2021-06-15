import { expect } from 'chai';
import { DescribeRequest } from '../src';
import BlueprintFragment from '../src/fragment';
import { jsonString } from '../src/utils';

class TestSubject {}

describe('Fragments', () => {
  beforeEach(() => {
    Reflect.deleteMetadata('Group', TestSubject);
    Reflect.deleteMetadata('Name', TestSubject);
    Reflect.deleteMetadata('Path', TestSubject);
    Reflect.deleteMetadata('Method', TestSubject);
    Reflect.deleteMetadata('Body', TestSubject);
    Reflect.deleteMetadata('Headers', TestSubject);
    Reflect.deleteMetadata('Response', TestSubject);
    Reflect.deleteMetadata('RequestGroup', TestSubject);
    Reflect.deleteMetadata('Responses', TestSubject);
  });

  describe('RequestFragment', () => {
    it("Should build fragment with '###' and '+ Request' part", () => {
      const description = 'Just a random description to prove that it works';
      const fragment = BlueprintFragment['request'](
        {
          method: 'GET',
          name: 'Testing Fragments',
          response: {
            data: [],
          },
          description
        },
        'TestSubject',
      );
      expect(fragment).contain('### GET Testing Fragments [GET]');
      expect(fragment).contain('+ Request (application/json');
      expect(fragment).contains(description);
    });

    it("Should build fragment with '+ Body' and '+ Headers' part", () => {
      const fragment = BlueprintFragment['request'](
        {
          method: 'GET',
          name: 'Testing Fragments',
          body: {
            email: 'string',
            password: 'hash-string',
          },
          headers: {
            'x-test-key': 'mocha + chai are awesome',
          },
          response: {
            data: [],
          },
        },
        'TestSubject',
      );
      expect(fragment).contain('+ Body');
      expect(fragment).contain(
        jsonString({
          email: 'string',
          password: 'hash-string',
        }),
      );
      expect(fragment).contains('+ Headers');
      expect(fragment).contains('x-test-key:mocha + chai are awesome');
    });

    it("Should build fragment with + 'Response 200'", () => {
      const fragment = BlueprintFragment['request'](
        {
          method: 'GET',
          name: 'Testing Fragments',
          body: {
            email: 'string',
            password: 'hash-string',
          },
          headers: {
            'x-test-key': 'mocha + chai are awesome',
          },
          response: {
            data: [],
          },
        },
        'TestSubject',
      );
      expect(fragment).contains(jsonString({ data: [] }));
      expect(fragment).not.contains(jsonString('Response 500'));
    });

    it('Should build fragmetn with multiple response types', () => {
      const fragment = BlueprintFragment['request'](
        {
          method: 'GET',
          name: 'Testing Fragments',
          body: {
            email: 'string',
            password: 'hash-string',
          },
          headers: {
            'x-test-key': 'mocha + chai are awesome',
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
        },
        'TestSubject',
      );

      expect(fragment).contains(
        jsonString({
          status: 'DEFINITIVELY NOT OK',
        }),
      );

      expect(fragment).contains(
        jsonString({
          status: 'NOT OK DUDE',
        }),
      );

      expect(fragment).contains(
        jsonString({
          status: 'OK',
        }),
      );
    });

    it("Should throw a error when 'response' and 'responses' are undefined", () => {
      expect(() =>
        BlueprintFragment['request'](
          {
            method: 'GET',
            name: 'Testing Fragments',
          },
          'TestSubject',
        ),
      ).to.throw(/Neither "response" or "responses" object provided into TestSubject class/);
    });
  });

  describe('ApiName', () => {
    it("Should add apib's base", () => {
      const result = BlueprintFragment.apiName('Best API', 'mocha + chai = <3');
      expect(result).contains('FORMAT: 1A');
      expect(result).contains('# Best API\nmocha + chai = <3');
    })
  })

  describe('ApiGroups', () => {
    it("Should build fragment with '# Group' and '## Login ['/v1/auth/login']'", () => {
      DescribeRequest({
        group: 'Auth',
        method: 'POST',
        name: 'Authenticate User',
        path: '/v1/auth/login',
        requestGroup: 'Login',
        headers: {
          'x-random': 'string',
        },
        response: {
          data: [],
        },
      })(TestSubject);
      const result = BlueprintFragment.apiGroups({
        Auth: {
          '/v1/auth/login': [TestSubject],
        },
      });
      expect(result).contains('# Group Auth');
      expect(result).contains('## Login [/v1/auth/login]');
    });
  });

  describe('GetMeta', () => {
    it('Should get metadata', () => {
      DescribeRequest({
        group: 'Auth',
        method: 'POST',
        name: 'Authenticate User',
        path: '/v1/auth/login',
        requestGroup: 'Login',
        headers: {
          'x-random': 'string',
        },
        response: {
          data: [],
        },
      })(TestSubject);

      const { headers, name, method, path, requestGroup, group, response } = BlueprintFragment.getMeta(TestSubject);
      expect(group).equals('Auth');
      expect(method).equals('POST');
      expect(name).equals('Authenticate User');
      expect(path).equals('/v1/auth/login');
      expect(requestGroup).equals('Login');
      expect(response).deep.equals({
        data: [],
      });
      expect(headers).deep.equals({
        'x-random': 'string',
      });
    });
  });
});
