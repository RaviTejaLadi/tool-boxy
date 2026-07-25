export const HISTORY_LIMIT = 50;

export const EDITOR_FONT_SIZE = 13;
export const EDITOR_LINE_HEIGHT = 24;
export const EDITOR_GUTTER_BG = 'color-mix(in oklab, var(--muted) 60%, var(--background))';

/** Highlighting is skipped past this size so typing stays responsive. */
export const MAX_HIGHLIGHT_LENGTH = 120_000;

export type ViewMode = 'tree' | 'raw';

export const VIEW_TABS: { id: ViewMode; label: string }[] = [
  { id: 'tree', label: 'Tree View' },
  { id: 'raw', label: 'Raw JSON' },
];

export const SAMPLE_JSON = `{
  "repeat": [5, 7],
  "items": [
    {
      "objectId": "obj_1",
      "index": 0,
      "guid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "isActive": true,
      "balance": "$1,234.56",
      "picture": "http://placehold.it/32x32",
      "age": 28,
      "eyeColor": "blue",
      "name": { "first": "John", "surname": "Doe" },
      "gender": "male",
      "company": "ACME INC",
      "email": "john.doe@acme.com",
      "phone": "+1-555-123-4567",
      "address": "123 Main St",
      "state": "CA",
      "about": "Lorem ipsum dolor sit amet...",
      "registered": "2023-01-15T10:30:00Z",
      "date": "2024-01-01T12:00:00 UTC",
      "latitude": 34.0522,
      "longitude": -118.2437,
      "tags": ["work", "important"],
      "friends": [
        { "id": 1, "name": "Jane" },
        { "id": 2, "name": "Bob" }
      ],
      "greeting": "Hello, world!",
      "greet": "Welcome"
    },
    {
      "objectId": "obj_2",
      "index": 1,
      "guid": "8f9a4e3d-2b1c-4d5e-8f7a-6b5c4d3e2f1a",
      "isActive": false,
      "balance": "$3,456.78",
      "picture": "http://placehold.it/32x32",
      "age": 35,
      "eyeColor": "brown",
      "name": { "first": "Alice", "surname": "Smith" },
      "gender": "female",
      "company": "BETA CORP",
      "email": "alice.smith@beta.com",
      "phone": "+1-555-987-6543",
      "address": "456 Oak Ave",
      "state": "NY",
      "about": "Consectetur adipiscing elit...",
      "registered": "2023-05-20T08:15:00Z",
      "date": "2024-02-15T14:30:00 UTC",
      "latitude": 40.7128,
      "longitude": -74.006,
      "tags": ["personal", "urgent"],
      "friends": [
        { "id": 3, "name": "Charlie" }
      ],
      "greeting": "Hi there!",
      "greet": "Greetings"
    }
  ],
  "additional": [
    { "index": 0, "guid": "abc-123", "isActive": true, "balance": "$100.00" },
    { "index": 1, "guid": "def-456", "isActive": false, "balance": "$200.00" },
    { "index": 2, "guid": "ghi-789", "isActive": true, "balance": "$300.00" }
  ]
}
`;
