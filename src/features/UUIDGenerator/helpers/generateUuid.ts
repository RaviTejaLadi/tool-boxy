export type UuidVersion = 'v4' | 'v7';

export function generateUuidV4(): string {
  return crypto.randomUUID();
}

export function generateUuidV7(): string {
  // Custom implementation for v7 (timestamp-based)
  const timestamp = BigInt(Date.now()) * BigInt(10000) + BigInt(0x01b21dd213814000);
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);

  const hexTimestamp = timestamp.toString(16).padStart(16, '0');
  const hexRandom = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${hexTimestamp.slice(0, 8)}-${hexTimestamp.slice(8, 12)}-7${hexTimestamp.slice(13, 16)}-${(
    0x8 |
    (randomBytes[0] & 0x3)
  ).toString(16)}${hexRandom.slice(3, 6)}-${hexRandom.slice(6, 18)}`;
}

export function generateUuid(version: UuidVersion): string {
  return version === 'v4' ? generateUuidV4() : generateUuidV7();
}

export function generateBulkUuids(version: UuidVersion, count: number): string[] {
  const n = Math.min(Math.max(count, 1), 100);
  const uuids: string[] = [];
  for (let i = 0; i < n; i++) {
    uuids.push(generateUuid(version));
  }
  return uuids;
}
