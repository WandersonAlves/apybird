export interface DescribeRequestParams<H = unknown, B = unknown, R = unknown> {
  /**
   * Group of request. Translates to `# Group <value>`
   */
  group: string;
  /**
   * Path of request. Translates to `## VariousThings [<value>]`
   */
  path: string;
  /**
   * Method of the request. Translates to `### <value> Get Various Things [<value>]`
   */
  method: string;
  /**
   * Name of the request. Translates to `### GET <value> [GET]`
   */
  name: string;
  /**
   * Group of request in case multiple methods point to the same route.
   * Translates to `## <value> [/v1/things]`
   */
  requestGroup: string;
  headers?: H;
  body?: B;
  /**
   * The default 200 response.If you use `responses`, it'll be used instead of this
   */
  response?: R;
  /**
   * Responses object. The keys of the object are the status code
   *
   * @example
   * {
   *  200: {
   *    status: 'OK'
   *  }
   *  500: {
   *    status: 'NOT OK'
   *  }
   * }
   */
  responses?: {
    [k: number]: any;
  };
}

export interface DescribeAPIParams {
  name: string;
  description: string;
}

export interface GroupedTargets {
  [k: string]: (new () => any)[];
}

export interface GroupedByPath {
  [k: string]: GroupedTargets;
}

export type Keys = { [k: string]: any };
