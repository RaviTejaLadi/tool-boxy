// @ts-nocheck — typed gradually
export const R = (type, source, flags = '') => ({ type, re: new RegExp(source, flags + 'y') });

export const STR = '`(?:\\\\.|[^`\\\\])*`|"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'';
export const NUM = '\\b0[xX][0-9a-fA-F]+\\b|\\b\\d+\\.?\\d*(?:[eE][+-]?\\d+)?\\b';
