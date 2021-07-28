import 'reflect-metadata';
import { BlueprintParametersSchema, GroupedByPath, Keys } from '../interfaces';
import { jsonString } from '../utils';

interface BlueprintFragmentRequest<B, H, R, P> {
  method: string;
  name: string;
  body?: B;
  headers?: H;
  response?: R;
  parameters?: {
    [Prop in keyof P]: BlueprintParametersSchema;
  };
  responses?: {
    [Property in keyof R]: R[Property];
  };
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
    Object.entries(groupTargets)
      .sort(([a], [b]) => {
        return a < b ? -1 : a > b ? 1 : 0;
      })
      .forEach(([groupName, _groupTargets]) => {
        str += `# Group ${groupName}\n`;
        BlueprintFragment.totalGroups++;
        Object.entries(_groupTargets)
          .sort(([a], [b]) => {
            return a < b ? -1 : a > b ? 1 : 0;
          })
          .forEach(([pathName, _requestTargets]) => {
            const { requestGroup } = BlueprintFragment.getMeta(_requestTargets[0]);
            str += `## ${requestGroup} [${pathName}]\n`;
            _requestTargets.forEach(_reqTarget => {
              const build = BlueprintFragment.request(BlueprintFragment.getMeta(_reqTarget), _reqTarget.name);
              BlueprintFragment.totalEndpoints++;
              str += build;
            });
          });
      });
    return str;
  }

  static getMeta<H, B, R, P>(target: new () => any) {
    const group: string = Reflect.getMetadata('Group', target);
    const name: string = Reflect.getMetadata('Name', target);
    const path: string = Reflect.getMetadata('Path', target);
    const method: string = Reflect.getMetadata('Method', target);
    const body: B = Reflect.getMetadata('Body', target);
    const headers: H = Reflect.getMetadata('Headers', target);
    const response: R = Reflect.getMetadata('Response', target);
    const requestGroup: string = Reflect.getMetadata('RequestGroup', target);
    const responses: R = Reflect.getMetadata('Responses', target);
    const description: string = Reflect.getMetadata('Description', target);
    const parameters: P = Reflect.getMetadata('Parameters', target);

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
      parameters,
    };
  }

  private static request<H, B, R, P>(blueprintFragment: BlueprintFragmentRequest<H, B, R, P>, className: string) {
    const { method, name, body, headers, response, responses, description, parameters } = blueprintFragment;
    let requestFragment = '';
    if (parameters) {
      requestFragment += '+ Parameters\n';
      requestFragment += `${Object.entries(parameters)
        .map(
          ([key, value]: [key: string, value: BlueprintParametersSchema]) =>
            {
              const defaultValue = value.defaultValue || '';
              const type = value.type;
              const optional = value.optional ? `,optional` : '';
              const description = value.description;
              const typeAndOptional = `(${type}${optional})`;
              return `    + ${key}: ${defaultValue} ${typeAndOptional} - ${description}`;
            },
        )
        .join('\n')}\n`;
    }
    requestFragment += `### ${method} ${name} [${method}]\n`;
    if (description) {
      requestFragment += `${description}\n`;
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
    if (response !== undefined && response !== null && !responses) {
      requestFragment += '+ Response 200 (application/json)';
      requestFragment += `\n${jsonString(response)}`;
    } else if (typeof responses === 'object') {
      Object.entries(responses).forEach(([statusCode, resp]) => {
        requestFragment += `+ Response ${statusCode} (application/json)`;
        requestFragment += `\n${jsonString(resp)}`;
      });
    } else {
      throw new Error(`Neither "response" or "responses" object provided into ${className} class`);
    }
    return requestFragment;
  }
}
