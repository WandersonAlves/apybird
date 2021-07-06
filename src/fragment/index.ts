import 'reflect-metadata';
import { GroupedByPath, Keys } from '../interfaces';
import { jsonString } from '../utils';

interface BlueprintFragmentRequest {
  method: string;
  name: string;
  body?: Keys;
  headers?: Keys;
  response?: Keys;
  responses?: {
    [k: number]: any;
  },
  description?: string;
}

export default class BlueprintFragment {
  static totalEndpoints = 0;
  static totalGroups = 0;
  static apiName(name: string, description: string) {
    let str = 'FORMAT: 1A\n';
    str += `# ${name}\n${description}\n`;
    return str;
  }

  static apiGroups(groupTargets: GroupedByPath) {
    let str = '';
    Object.entries(groupTargets).forEach(([groupName, _groupTargets]) => {
      str += `# Group ${groupName}\n`;
      BlueprintFragment.totalGroups++;
      Object.entries(_groupTargets).forEach(([pathName, _requestTargets]) => {
        const { requestGroup } = BlueprintFragment.getMeta(_requestTargets[0]);
        str += `## ${requestGroup} [${pathName}]\n`;
        _requestTargets.forEach(_reqTarget => {
          const { method, name, body, headers, response, responses, description } = BlueprintFragment.getMeta(_reqTarget);
          const build = BlueprintFragment.request(
            { response, headers, body, name, method, responses, description },
            _reqTarget.name,
          );
          BlueprintFragment.totalEndpoints++;
          str += build;
        });
      });
    });
    return str;
  }

  static getMeta(target: new () => any) {
    const group: string = Reflect.getMetadata('Group', target);
    const name: string = Reflect.getMetadata('Name', target);
    const path: string = Reflect.getMetadata('Path', target);
    const method: string = Reflect.getMetadata('Method', target);
    const body: Keys = Reflect.getMetadata('Body', target);
    const headers: Keys = Reflect.getMetadata('Headers', target);
    const response: Keys = Reflect.getMetadata('Response', target);
    const requestGroup: string = Reflect.getMetadata('RequestGroup', target);
    const responses: string = Reflect.getMetadata('Responses', target);
    const description: string = Reflect.getMetadata('Description', target);

    return {
      group,
      name,
      path,
      method,
      body,
      headers,
      response,
      requestGroup,
      responses,
      description,
    };
  }

  private static request({ method, name, body, headers, response, responses, description }: BlueprintFragmentRequest, className: string) {
    let requestFragment = '';
    requestFragment += `### ${method} ${name} [${method}]\n`;
    if (description) {
      requestFragment += `${description}\n`
    }
    requestFragment += '+ Request (application/json)\n';
    if (body) {
      requestFragment += '  + Body\n';
      requestFragment += `  ${jsonString(body)}\n`;
    }
    if (headers) {
      requestFragment += `  + Headers\n`;
      requestFragment += `  ${Object.entries(headers)
        .map(([key, value]) => ` ${key}:${value}`)
        .join('\n')}\n`;
    }
    if (response && !responses) {
      requestFragment += '+ Response 200 (application/json)';
      requestFragment += `\n${jsonString(response)}`;
    }
    else if (responses) {
      Object.entries(responses).forEach(([statusCode, resp]) => {
        requestFragment += `+ Response ${statusCode} (application/json)`;
        requestFragment += `\n${jsonString(resp)}`;
      })
    }
    else {
      throw new Error(`Neither "response" or "responses" object provided into ${className} class`);
    }
    return requestFragment;
  }
}
