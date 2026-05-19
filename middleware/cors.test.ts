import { describe, it, expect } from 'vitest';
import { cors, type CorsOptions } from './cors';

/**
 * captureHeaders — runs the cors middleware against a mock req/res and returns
 * the captured response headers as a plain, key-sorted object suitable for
 * deterministic snapshotting.
 *
 * @param options       CorsOptions passed to the cors middleware factory
 * @param requestInit   Optional request shape (method + headers) so we can
 *                      exercise both simple and preflight (OPTIONS) paths.
 */
function captureHeaders(
  options: CorsOptions,
  requestInit: { method?: string; headers?: Record<string, string> } = {},
): Record<string, string> {
  const captured: Record<string, string> = {};

  const req = {
    method: requestInit.method ?? 'GET',
    headers: requestInit.headers ?? {},
  };

  const res = {
    setHeader(name: string, value: string): void {
      captured[name] = value;
    },
  };

  let nextCalled = false;
  let nextError: unknown = undefined;
  cors(options)(req, res, (err?: unknown) => {
    nextCalled = true;
    nextError = err;
  });

  // Sanity guards: middleware MUST always invoke next() exactly once with no
  // error. These are baked into the snapshot via deterministic keys so any
  // regression surfaces immediately.
  if (!nextCalled) {
    throw new Error('cors middleware did not invoke next()');
  }
  if (nextError !== undefined) {
    throw new Error(`cors middleware passed an error to next(): ${String(nextError)}`);
  }

  // Sort keys for stable snapshots regardless of internal set order.
  return Object.fromEntries(
    Object.keys(captured)
      .sort()
      .map((k) => [k, captured[k]]),
  );
}

const PREFLIGHT: { method: string; headers: Record<string, string> } = {
  method: 'OPTIONS',
  headers: {
    origin: 'https://client.example.com',
    'access-control-request-method': 'POST',
    'access-control-request-headers': 'content-type, authorization',
  },
};

describe('cors() — wildcard origin', () => {
  it('emits Access-Control-Allow-Origin: * for origin "*" on a simple GET', () => {
    expect(captureHeaders({ origin: '*' })).toMatchSnapshot();
  });

  it('emits Access-Control-Allow-Origin: * for origin: true on a simple GET', () => {
    expect(captureHeaders({ origin: true })).toMatchSnapshot();
  });

  it('emits Access-Control-Allow-Origin: * for origin "*" on a preflight OPTIONS', () => {
    expect(captureHeaders({ origin: '*' }, PREFLIGHT)).toMatchSnapshot();
  });
});

describe('cors() — string origin', () => {
  it('echoes a single string origin on a simple GET', () => {
    expect(
      captureHeaders({ origin: 'https://app.example.com' }),
    ).toMatchSnapshot();
  });

  it('echoes a single string origin on a preflight OPTIONS', () => {
    expect(
      captureHeaders({ origin: 'https://app.example.com' }, PREFLIGHT),
    ).toMatchSnapshot();
  });

  it('echoes \'https://example.com\' on a simple GET', () => {
    expect(captureHeaders({ origin: 'https://example.com' })).toMatchSnapshot();
  });
});

describe('cors() — array origin', () => {
  it('joins an array origin with ", " on a simple GET', () => {
    expect(
      captureHeaders({
        origin: [
          'https://app.example.com',
          'https://admin.example.com',
          'https://staging.example.com',
        ],
      }),
    ).toMatchSnapshot();
  });

  it('joins an array origin with ", " on a preflight OPTIONS', () => {
    expect(
      captureHeaders(
        {
          origin: [
            'https://app.example.com',
            'https://admin.example.com',
          ],
        },
        PREFLIGHT,
      ),
    ).toMatchSnapshot();
  });

  it('handles a single-element array origin', () => {
    expect(
      captureHeaders({ origin: ['https://only.example.com'] }),
    ).toMatchSnapshot();
  });
});

describe('cors() — boolean false origin', () => {
  it('emits NO Access-Control-Allow-Origin when origin is false (simple GET)', () => {
    expect(captureHeaders({ origin: false })).toMatchSnapshot();
  });

  it('emits NO Access-Control-Allow-Origin when origin is false (preflight)', () => {
    expect(captureHeaders({ origin: false }, PREFLIGHT)).toMatchSnapshot();
  });

  it('still emits other CORS headers when origin is false but methods are set', () => {
    expect(
      captureHeaders({ origin: false, methods: ['GET', 'POST'] }),
    ).toMatchSnapshot();
  });
});

describe('cors() — methods', () => {
  it('passes through a methods string verbatim', () => {
    expect(
      captureHeaders({ origin: '*', methods: 'GET,POST,PUT' }),
    ).toMatchSnapshot();
  });

  it('joins a methods array with ", "', () => {
    expect(
      captureHeaders({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      }),
    ).toMatchSnapshot();
  });

  it('handles a single-element methods array', () => {
    expect(
      captureHeaders({ origin: '*', methods: ['GET'] }),
    ).toMatchSnapshot();
  });
});

describe('cors() — allowedHeaders', () => {
  it('passes through an allowedHeaders string verbatim', () => {
    expect(
      captureHeaders({
        origin: '*',
        allowedHeaders: 'Content-Type,Authorization',
      }),
    ).toMatchSnapshot();
  });

  it('joins an allowedHeaders array with ", "', () => {
    expect(
      captureHeaders({
        origin: '*',
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'X-Trace-Id',
        ],
      }),
    ).toMatchSnapshot();
  });
});

describe('cors() — exposedHeaders', () => {
  it('passes through an exposedHeaders string verbatim', () => {
    expect(
      captureHeaders({
        origin: '*',
        exposedHeaders: 'X-Total-Count,X-Page',
      }),
    ).toMatchSnapshot();
  });

  it('joins an exposedHeaders array with ", "', () => {
    expect(
      captureHeaders({
        origin: '*',
        exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Trace-Id'],
      }),
    ).toMatchSnapshot();
  });
});

describe('cors() — credentials', () => {
  it('emits Access-Control-Allow-Credentials: true when credentials is true', () => {
    expect(
      captureHeaders({ origin: 'https://app.example.com', credentials: true }),
    ).toMatchSnapshot();
  });

  it('emits NO Access-Control-Allow-Credentials when credentials is false', () => {
    expect(
      captureHeaders({ origin: 'https://app.example.com', credentials: false }),
    ).toMatchSnapshot();
  });

  it('emits NO Access-Control-Allow-Credentials when credentials is omitted', () => {
    expect(
      captureHeaders({ origin: 'https://app.example.com' }),
    ).toMatchSnapshot();
  });
});

describe('cors() — maxAge', () => {
  it('emits Access-Control-Max-Age as a stringified number', () => {
    expect(
      captureHeaders({ origin: '*', maxAge: 600 }),
    ).toMatchSnapshot();
  });

  it('emits Access-Control-Max-Age: 0 when maxAge is 0', () => {
    expect(
      captureHeaders({ origin: '*', maxAge: 0 }),
    ).toMatchSnapshot();
  });

  it('emits a large maxAge value verbatim', () => {
    expect(
      captureHeaders({ origin: '*', maxAge: 86400 }),
    ).toMatchSnapshot();
  });
});

describe('cors() — full combo', () => {
  it('emits every header when every option is provided (simple GET)', () => {
    expect(
      captureHeaders({
        origin: ['https://app.example.com', 'https://admin.example.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Trace-Id'],
        exposedHeaders: ['X-Total-Count', 'X-Page'],
        credentials: true,
        maxAge: 3600,
      }),
    ).toMatchSnapshot();
  });

  it('emits every header when every option is provided (preflight OPTIONS)', () => {
    expect(
      captureHeaders(
        {
          origin: ['https://app.example.com', 'https://admin.example.com'],
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization', 'X-Trace-Id'],
          exposedHeaders: ['X-Total-Count', 'X-Page'],
          credentials: true,
          maxAge: 3600,
        },
        PREFLIGHT,
      ),
    ).toMatchSnapshot();
  });
});

describe('cors() — empty options', () => {
  it('emits NO headers when origin is undefined and nothing else is set', () => {
    expect(
      captureHeaders({ origin: undefined }),
    ).toMatchSnapshot();
  });

  it('emits NO headers on a preflight when options are empty', () => {
    expect(
      captureHeaders({ origin: undefined }, PREFLIGHT),
    ).toMatchSnapshot();
  });
});
