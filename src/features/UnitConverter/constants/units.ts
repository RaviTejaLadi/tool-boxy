export interface Unit {
  name: string;
  symbol: string;
  toBase: number;
}

export interface UnitCategory {
  name: string;
  shortName: string;
  baseUnit: string;
  units: Unit[];
}

export type CategoryKey = 'length' | 'weight' | 'data' | 'temp' | 'speed' | 'area' | 'volume';

export const UNIT_CATEGORIES: Record<CategoryKey, UnitCategory> = {
  length: {
    name: 'Length',
    shortName: 'Length',
    baseUnit: 'm',
    units: [
      { name: 'Metre', symbol: 'm', toBase: 1 },
      { name: 'Kilometre', symbol: 'km', toBase: 1000 },
      { name: 'Centimetre', symbol: 'cm', toBase: 0.01 },
      { name: 'Millimetre', symbol: 'mm', toBase: 0.001 },
      { name: 'Mile', symbol: 'mi', toBase: 1609.344 },
      { name: 'Yard', symbol: 'yd', toBase: 0.9144 },
      { name: 'Foot', symbol: 'ft', toBase: 0.3048 },
      { name: 'Inch', symbol: 'in', toBase: 0.0254 },
      { name: 'Nautical Mile', symbol: 'nmi', toBase: 1852 },
    ],
  },
  weight: {
    name: 'Weight',
    shortName: 'Weight',
    baseUnit: 'kg',
    units: [
      { name: 'Kilogram', symbol: 'kg', toBase: 1 },
      { name: 'Gram', symbol: 'g', toBase: 0.001 },
      { name: 'Milligram', symbol: 'mg', toBase: 0.000001 },
      { name: 'Pound', symbol: 'lb', toBase: 0.453592 },
      { name: 'Ounce', symbol: 'oz', toBase: 0.0283495 },
      { name: 'Stone', symbol: 'st', toBase: 6.35029 },
      { name: 'Tonne', symbol: 't', toBase: 1000 },
    ],
  },
  data: {
    name: 'Data',
    shortName: 'Data',
    baseUnit: 'B',
    units: [
      { name: 'Byte', symbol: 'B', toBase: 1 },
      { name: 'Kilobyte', symbol: 'KB', toBase: 1024 },
      { name: 'Megabyte', symbol: 'MB', toBase: 1048576 },
      { name: 'Gigabyte', symbol: 'GB', toBase: 1073741824 },
      { name: 'Terabyte', symbol: 'TB', toBase: 1099511627776 },
      { name: 'Petabyte', symbol: 'PB', toBase: 1125899906842624 },
      { name: 'Bit', symbol: 'b', toBase: 0.125 },
      { name: 'Kilobit', symbol: 'Kb', toBase: 128 },
      { name: 'Megabit', symbol: 'Mb', toBase: 131072 },
      { name: 'Gigabit', symbol: 'Gb', toBase: 134217728 },
    ],
  },
  temp: {
    name: 'Temperature',
    shortName: 'Temp',
    baseUnit: '°C',
    units: [
      { name: 'Celsius', symbol: '°C', toBase: 1 },
      { name: 'Fahrenheit', symbol: '°F', toBase: 1 },
      { name: 'Kelvin', symbol: 'K', toBase: 1 },
    ],
  },
  speed: {
    name: 'Speed',
    shortName: 'Speed',
    baseUnit: 'm/s',
    units: [
      { name: 'Metres/sec', symbol: 'm/s', toBase: 1 },
      { name: 'km/hour', symbol: 'km/h', toBase: 0.277778 },
      { name: 'Miles/hour', symbol: 'mph', toBase: 0.44704 },
      { name: 'Knot', symbol: 'kn', toBase: 0.514444 },
      { name: 'Feet/sec', symbol: 'ft/s', toBase: 0.3048 },
    ],
  },
  area: {
    name: 'Area',
    shortName: 'Area',
    baseUnit: 'm²',
    units: [
      { name: 'Square metre', symbol: 'm²', toBase: 1 },
      { name: 'Square km', symbol: 'km²', toBase: 1_000_000 },
      { name: 'Square foot', symbol: 'ft²', toBase: 0.09290304 },
      { name: 'Square yard', symbol: 'yd²', toBase: 0.83612736 },
      { name: 'Acre', symbol: 'ac', toBase: 4046.8564224 },
      { name: 'Hectare', symbol: 'ha', toBase: 10_000 },
      { name: 'Square mile', symbol: 'mi²', toBase: 2_589_988.110336 },
    ],
  },
  volume: {
    name: 'Volume',
    shortName: 'Volume',
    baseUnit: 'L',
    units: [
      { name: 'Litre', symbol: 'L', toBase: 1 },
      { name: 'Millilitre', symbol: 'mL', toBase: 0.001 },
      { name: 'Cubic metre', symbol: 'm³', toBase: 1000 },
      { name: 'Gallon (US)', symbol: 'gal', toBase: 3.78541 },
      { name: 'Gallon (UK)', symbol: 'gal UK', toBase: 4.54609 },
      { name: 'Quart (US)', symbol: 'qt', toBase: 0.946353 },
      { name: 'Pint (US)', symbol: 'pt', toBase: 0.473176 },
      { name: 'Cup (US)', symbol: 'cup', toBase: 0.236588 },
      { name: 'Fluid oz (US)', symbol: 'fl oz', toBase: 0.0295735 },
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(UNIT_CATEGORIES) as CategoryKey[];
