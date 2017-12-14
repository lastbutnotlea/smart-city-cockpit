export class Line {
  line: number;
  name: String;
  color: String;
  stripe: String;

  constructor(l: number, n: String, c: String, s: String) {
    this.line = l;
    this.name = n;
    this.color = c;
    this.stripe = s;
  }
}

export const Lines: Line[] = [
  {
    line: 1,
    name: 'Bakerloo Line',
    color: 'AE6017',
    stripe: null
  },
  {
    line: 3,
    name: 'Circle Line',
    color: 'FFE02B',
    stripe: null
  },
  {
    line: 6,
    name: 'Hammersmith & City Line',
    color: 'F491A8',
    stripe: null
  },
  {
    line: 7,
    name: 'Jubilee Line',
    color: '949699',
    stripe: null
  },
  {
    line: 11,
    name: 'Victoria Line',
    color: '0A9CDA',
    stripe: null
  },
  {
    line: 2,
    name: 'Central Line',
    color: 'F15B2E',
    stripe: null
  },
  {
    line: 4,
    name: 'District Line',
    color: '00A166',
    stripe: null
  },
  {
    line: 5,
    name: 'East London Line',
    color: 'FBAE34',
    stripe: null
  },
  {
    line: 8,
    name: 'Metropolitan Line',
    color: '91005A',
    stripe: null
  },
  {
    line: 9,
    name: 'Northern Line',
    color: '000000',
    stripe: null
  },
  {
    line: 10,
    name: 'Piccadilly Line',
    color: '094FA3',
    stripe: null
  },
  {
    line: 12,
    name: 'Waterloo & City Line',
    color: '88D0C4',
    stripe: null
  },
  {
    line: 13,
    name: 'Docklands Light Railway',
    color: '00A77E',
    stripe: 'FFFFFF'
  }
];
