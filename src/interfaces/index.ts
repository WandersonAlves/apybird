export interface DescribeRequestParams<H = unknown, B = unknown, R = unknown> {
  group: string;
  path: string;
  method: string;
  name: string;
  requestGroup: string;
  headers?: H;
  body?: B;
  response?: R;
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
