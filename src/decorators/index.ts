import 'reflect-metadata';
import { DescribeRequestParams } from '../interfaces';
import ClassRegister from './register';

/**
 * Decorate a class with api blueprint information
 *
 * Use `GenerateAPIBlueprint` to create a apib string or file
 *
 */
export const DescribeRequest = <H = unknown, B = unknown, R = unknown, P = unknown>({
  group,
  path,
  method,
  body,
  headers,
  response,
  name,
  requestGroup,
  responses,
  description,
  parameters
}: DescribeRequestParams<H, B, R, P>) => {
  return (target: any) => {
    ClassRegister.addClass(target);
    Reflect.defineMetadata('Group', group, target);
    Reflect.defineMetadata('Path', path, target);
    Reflect.defineMetadata('Method', method, target);
    Reflect.defineMetadata('Body', body, target);
    Reflect.defineMetadata('Headers', headers, target);
    Reflect.defineMetadata('Response', response, target);
    Reflect.defineMetadata('Responses', responses, target);
    Reflect.defineMetadata('Name', name, target);
    Reflect.defineMetadata('RequestGroup', requestGroup, target);
    Reflect.defineMetadata('Description', description, target);
    Reflect.defineMetadata('Parameters', parameters, target);
    return target;
  };
};
