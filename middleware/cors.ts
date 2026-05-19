export interface CorsOptions {
  origin: string | string[] | boolean | undefined;
  methods?: string | string[];
  allowedHeaders?: string | string[];
  exposedHeaders?: string | string[];
  credentials?: boolean;
  maxAge?: number;
}

interface CorsResponse {
  setHeader(name: string, value: string): void;
}

type CorsNext = (err?: unknown) => void;

const joinHeaderValue = (value: string | string[]): string =>
  Array.isArray(value) ? value.join(', ') : value;

const formatOrigin = (
  origin: CorsOptions['origin'],
): string | undefined => {
  if (origin === undefined) return undefined;
  if (typeof origin === 'boolean') return origin ? '*' : undefined;
  return Array.isArray(origin) ? origin.join(', ') : origin;
};

export function cors(options: CorsOptions) {
  return (_req: unknown, res: CorsResponse, next: CorsNext): void => {
    const originHeader = formatOrigin(options.origin);
    if (originHeader !== undefined) {
      res.setHeader('Access-Control-Allow-Origin', originHeader);
    }
    if (options.methods !== undefined) {
      res.setHeader(
        'Access-Control-Allow-Methods',
        joinHeaderValue(options.methods),
      );
    }
    if (options.allowedHeaders !== undefined) {
      res.setHeader(
        'Access-Control-Allow-Headers',
        joinHeaderValue(options.allowedHeaders),
      );
    }
    if (options.exposedHeaders !== undefined) {
      res.setHeader(
        'Access-Control-Expose-Headers',
        joinHeaderValue(options.exposedHeaders),
      );
    }
    if (options.credentials === true) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    if (options.maxAge !== undefined) {
      res.setHeader('Access-Control-Max-Age', String(options.maxAge));
    }
    next();
  };
}
