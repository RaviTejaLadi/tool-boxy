export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export type JwtPart = 'header' | 'payload' | 'signature';

function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

export function decodeJwt(token: string): { data: DecodedJwt | null; error: string } {
  if (!token.trim()) {
    return { data: null, error: '' };
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        data: null,
        error: 'Invalid JWT format. A JWT should have 3 parts separated by dots.',
      };
    }

    const header = JSON.parse(decodeBase64Url(parts[0])) as Record<string, unknown>;
    const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;
    const signature = parts[2];

    return {
      data: {
        header,
        payload,
        signature,
        raw: {
          header: parts[0],
          payload: parts[1],
          signature: parts[2],
        },
      },
      error: '',
    };
  } catch {
    return {
      data: null,
      error: 'Failed to decode JWT. Please check if the token is valid.',
    };
  }
}

export function formatPart(data: DecodedJwt, part: JwtPart): string {
  if (part === 'signature') return data.signature;
  return JSON.stringify(data[part], null, 2);
}
