import { expect } from 'chai';
import { DescribeRequest } from '../src';
import ClassRegister from '../src/decorators/register';

class TestSubject {}
class TestSubject2 {}

type ReturnType = { status: string };

const decorateClasses = () => {
  DescribeRequest<any, any, ReturnType>({
    group: 'Auth',
    method: 'POST',
    name: 'Authenticate User',
    path: '/v1/auth/login',
    requestGroup: 'Login',
    headers: {
      'x-random': 'string',
    },
    response: {
      status: 'OK',
    },
  })(TestSubject);
  DescribeRequest<any, any, { 200: ReturnType; 400: ReturnType; 500: ReturnType }>({
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
  })(TestSubject2);
};

describe('Decorators', () => {
  beforeEach(() => {
    ClassRegister.reset();
    decorateClasses();
  });

  it('Should add metadata', () => {
    expect(Reflect.getMetadata('Group', TestSubject)).equals('Auth');
    expect(Reflect.getMetadata('Method', TestSubject)).equals('POST');
    expect(Reflect.getMetadata('Name', TestSubject)).equals('Authenticate User');
    expect(Reflect.getMetadata('Path', TestSubject)).equals('/v1/auth/login');
    expect(Reflect.getMetadata('RequestGroup', TestSubject)).equals('Login');
    expect(Reflect.getMetadata('Response', TestSubject)).deep.equals({
      status: 'OK',
    });
    expect(Reflect.getMetadata('Headers', TestSubject)).deep.equals({
      'x-random': 'string',
    });
  });

  it('Should add more metadata', () => {
    expect(Reflect.getMetadata('Group', TestSubject2)).equals('Things');
    expect(Reflect.getMetadata('Method', TestSubject2)).equals('GET');
    expect(Reflect.getMetadata('Name', TestSubject2)).equals('Get Various Things');
    expect(Reflect.getMetadata('Path', TestSubject2)).equals('/v1/things');
    expect(Reflect.getMetadata('RequestGroup', TestSubject2)).equals('VariousThings');
    expect(Reflect.getMetadata('Responses', TestSubject2)).deep.equals({
      200: {
        status: 'OK',
      },
      400: {
        status: 'NOT OK DUDE',
      },
      500: {
        status: 'DEFINITIVELY NOT OK',
      },
    });
    expect(Reflect.getMetadata('Headers', TestSubject2)).deep.equals({
      'x-random': 'string',
    });
  });

  it('Should get all decorated classes', () => {
    const classes = ClassRegister.getAll();
    expect(classes).length(2);
  });
});
