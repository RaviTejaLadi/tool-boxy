import type { FlexContainerConfig, FlexItemConfig } from '../constants/patterns';

export interface FlexboxCssInput {
  container: FlexContainerConfig;
  items: FlexItemConfig[];
}

function itemStyleLines(item: FlexItemConfig, defaults: FlexItemConfig): string[] {
  const lines: string[] = ['  background: #f4f4f5;', '  border: 1px solid #e4e4e7;', '  box-sizing: border-box;'];

  const width = item.width ?? defaults.width ?? 80;
  if (width !== 'auto') lines.push(`  width: ${width}px;`);
  else lines.push('  width: auto;');

  const height = item.height ?? defaults.height ?? 80;
  if (height !== 'auto') lines.push(`  height: ${height}px;`);
  else lines.push('  height: auto;');

  const flexGrow = item.flexGrow ?? defaults.flexGrow ?? 0;
  if (flexGrow !== 0) lines.push(`  flex-grow: ${flexGrow};`);

  const flexShrink = item.flexShrink ?? defaults.flexShrink ?? 1;
  if (flexShrink !== 1) lines.push(`  flex-shrink: ${flexShrink};`);

  const flexBasis = item.flexBasis ?? defaults.flexBasis ?? 'auto';
  if (flexBasis !== 'auto') lines.push(`  flex-basis: ${flexBasis};`);

  const alignSelf = item.alignSelf ?? defaults.alignSelf ?? 'auto';
  if (alignSelf !== 'auto') lines.push(`  align-self: ${alignSelf};`);

  const minWidth = item.minWidth ?? defaults.minWidth;
  if (minWidth !== undefined) lines.push(`  min-width: ${minWidth}px;`);

  const minHeight = item.minHeight ?? defaults.minHeight;
  if (minHeight !== undefined) lines.push(`  min-height: ${minHeight}px;`);

  return lines;
}

function itemsShareSameStyles(items: FlexItemConfig[]): boolean {
  if (items.length <= 1) return true;
  const [first, ...rest] = items;
  return rest.every(
    (item) =>
      (item.width ?? 80) === (first.width ?? 80) &&
      (item.height ?? 80) === (first.height ?? 80) &&
      (item.flexGrow ?? 0) === (first.flexGrow ?? 0) &&
      (item.flexShrink ?? 1) === (first.flexShrink ?? 1) &&
      (item.flexBasis ?? 'auto') === (first.flexBasis ?? 'auto') &&
      (item.alignSelf ?? 'auto') === (first.alignSelf ?? 'auto') &&
      (item.minWidth ?? undefined) === (first.minWidth ?? undefined) &&
      (item.minHeight ?? undefined) === (first.minHeight ?? undefined)
  );
}

export function buildFlexboxCss(input: FlexboxCssInput): string {
  const { container, items } = input;
  const defaults: FlexItemConfig = { label: '' };

  const containerLines = [
    '.flex-container {',
    '  display: flex;',
    '  background: #fafafa;',
    '  border: 1px dashed #d4d4d8;',
    `  flex-direction: ${container.flexDirection};`,
    `  flex-wrap: ${container.flexWrap};`,
    `  justify-content: ${container.justifyContent};`,
    `  align-items: ${container.alignItems};`,
    `  align-content: ${container.alignContent};`,
    `  gap: ${container.gap}px;`,
  ];

  if (container.minHeight !== undefined) {
    containerLines.push(`  min-height: ${container.minHeight}px;`);
  }
  if (container.padding !== undefined) {
    containerLines.push(`  padding: ${container.padding}px;`);
  }

  containerLines.push('}');

  const blocks: string[] = [containerLines.join('\n')];

  if (itemsShareSameStyles(items)) {
    const shared = items[0] ?? defaults;
    const itemLines = ['', '.flex-item {', ...itemStyleLines(shared, defaults), '}'];
    blocks.push(itemLines.join('\n'));
  } else {
    items.forEach((item, index) => {
      const lines = itemStyleLines(item, defaults);
      if (lines.length === 0) return;
      blocks.push('', `.flex-item:nth-child(${index + 1}) {`, ...lines, '}');
    });
  }

  return blocks.join('\n');
}

export function buildFlexboxHtml(items: FlexItemConfig[]): string {
  const children = items.map((item) => `  <div class="flex-item">${item.label}</div>`).join('\n');
  return `<div class="flex-container">\n${children}\n</div>`;
}
