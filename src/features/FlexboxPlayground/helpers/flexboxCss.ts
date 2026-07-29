export interface FlexboxCssInput {
  flexDirection: string;
  flexWrap: string;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  gap: number;
  itemWidth: number;
  itemHeight: number;
  itemGrow: number;
  itemShrink: number;
  itemBasis: string;
  alignSelf: string;
}

export function buildFlexboxCss(input: FlexboxCssInput): string {
  return `.flex-container {
  display: flex;
  flex-direction: ${input.flexDirection};
  flex-wrap: ${input.flexWrap};
  justify-content: ${input.justifyContent};
  align-items: ${input.alignItems};
  align-content: ${input.alignContent};
  gap: ${input.gap}px;
}

.flex-item {
  width: ${input.itemWidth}px;
  height: ${input.itemHeight}px;
  flex-grow: ${input.itemGrow};
  flex-shrink: ${input.itemShrink};
  flex-basis: ${input.itemBasis};
  align-self: ${input.alignSelf};
}`;
}
