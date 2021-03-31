import 'reflect-metadata';
import { DescribeRequestParams } from '../interfaces';

/**
 * Decorate a class with api blueprint information
 *
 * Use `GenerateAPIBlueprint` to create a apib string or file
 *
 */
export const DescribeRequest = <H = unknown, B = unknown, R = unknown>({
  group,
  path,
  method,
  body,
  headers,
  response,
  name,
  requestGroup,
  responses,
}: DescribeRequestParams<H, B, R>) => {
  return (target: any) => {
    Reflect.defineMetadata('Group', group, target);
    Reflect.defineMetadata('Path', path, target);
    Reflect.defineMetadata('Method', method, target);
    Reflect.defineMetadata('Body', body, target);
    Reflect.defineMetadata('Headers', headers, target);
    Reflect.defineMetadata('Response', response, target);
    Reflect.defineMetadata('Responses', responses, target);
    Reflect.defineMetadata('Name', name, target);
    Reflect.defineMetadata('RequestGroup', requestGroup, target);
    return target;
  };
};
