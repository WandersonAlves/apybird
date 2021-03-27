import 'reflect-metadata';
import { DescribeRequestParams } from '../interfaces';

export const DescribeRequest = <H, B, R>({
  group,
  path,
  method,
  body,
  headers,
  response,
  name,
  requestGroup,
}: DescribeRequestParams<H, B, R>) => {
  return (target: new () => any) => {
    Reflect.defineMetadata('Group', group, target);
    Reflect.defineMetadata('Path', path, target);
    Reflect.defineMetadata('Method', method, target);
    Reflect.defineMetadata('Body', body, target);
    Reflect.defineMetadata('Headers', headers, target);
    Reflect.defineMetadata('Response', response, target);
    Reflect.defineMetadata('Name', name, target);
    Reflect.defineMetadata('RequestGroup', requestGroup, target);
    return target;
  };
};
