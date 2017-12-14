export class Station {
  id: number;
  latitude: number;
  longitude: number;
  name: String;
  display_name: String;
  zone: number;
  total_lines: number;
  rail: number;

  constructor(i: number, la: number, lo: number, n: String, dn: string, z: number, tl: number, r: number) {
    this.id = i;
    this.latitude = la;
    this.longitude = lo;
    this.name = n;
    this.display_name = dn;
    this.zone = z;
    this.total_lines = tl;
    this.rail = r;
  }
}

export const Stations: Station[] = [
  {
    id: 1,
    latitude: 51.5028,
    longitude: -0.2801,
    name: 'Acton Town',
    display_name: 'Acton<br />Town',
    zone: 3,
    total_lines: 2,
    rail: 0
  },
  {
    id: 2,
    latitude: 51.5143,
    longitude: -0.0755,
    name: 'Aldgate',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
  },
  {
    id: 3,
    latitude: 51.5154,
    longitude: -0.0726,
    name: 'Aldgate East',
    display_name: 'Aldgate<br />East',
    zone: 1,
    total_lines: 2,
    rail: 0
  },
  {
    id: 4,
    latitude: 51.5107,
    longitude: -0.013,
    name: 'All Saints',
    display_name: 'All<br />Saints',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 5,
    latitude: 51.5407,
    longitude: -0.2997,
    name: 'Alperton',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 7,
    latitude: 51.5322,
    longitude: -0.1058,
    name: 'Angel',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 8,
    latitude: 51.5653,
    longitude: -0.1353,
    name: 'Archway',
    display_name: null,
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 9,
    latitude: 51.6164,
    longitude: -0.1331,
    name: 'Arnos Grove',
    display_name: 'Arnos<br />Grove',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 10,
    latitude: 51.5586,
    longitude: -0.1059,
    name: 'Arsenal',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 11,
    latitude: 51.5226,
    longitude: -0.1571,
    name: 'Baker Street',
    display_name: 'Baker<br />Street',
    zone: 1,
    total_lines: 5,
    rail: 0
   },
  {
    id: 12,
    latitude: 51.4431,
    longitude: -0.1525,
    name: 'Balham',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 13,
    latitude: 51.5133,
    longitude: -0.0886,
    name: 'Bank',
    display_name: null,
    zone: 1,
    total_lines: 4,
    rail: 0
   },
  {
    id: 14,
    latitude: 51.5204,
    longitude: -0.0979,
    name: 'Barbican',
    display_name: null,
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 15,
    latitude: 51.5396,
    longitude: 0.081,
    name: 'Barking',
    display_name: null,
    zone: 4,
    total_lines: 2,
    rail: 1
   },
  {
    id: 16,
    latitude: 51.5856,
    longitude: 0.0887,
    name: 'Barkingside',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 17,
    latitude: 51.4905,
    longitude: -0.2139,
    name: 'Barons Court',
    display_name: 'Barons<br />Court',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 18,
    latitude: 51.5121,
    longitude: -0.1879,
    name: 'Bayswater',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 19,
    latitude: 51.5148,
    longitude: 0.0613,
    name: 'Beckton',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 20,
    latitude: 51.5087,
    longitude: 0.055,
    name: 'Beckton Park',
    display_name: 'Beckton<br />Park',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 21,
    latitude: 51.5403,
    longitude: 0.127,
    name: 'Becontree',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 22,
    latitude: 51.5504,
    longitude: -0.1642,
    name: 'Belsize Park',
    display_name: 'Belsize<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 24,
    latitude: 51.527,
    longitude: -0.0549,
    name: 'Bethnal Green',
    display_name: 'Bethnal<br />Green',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 25,
    latitude: 51.512,
    longitude: -0.1031,
    name: 'Blackfriars',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 26,
    latitude: 51.5867,
    longitude: -0.0417,
    name: 'Blackhorse Road',
    display_name: 'Blackhorse<br />Road',
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 27,
    latitude: 51.5079,
    longitude: -0.0066,
    name: 'Blackwall',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 28,
    latitude: 51.5142,
    longitude: -0.1494,
    name: 'Bond Street',
    display_name: 'Bond<br />Street',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 29,
    latitude: 51.5011,
    longitude: -0.0943,
    name: 'Borough',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 30,
    latitude: 51.4956,
    longitude: -0.325,
    name: 'Boston Manor',
    display_name: 'Boston<br />Manor',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 31,
    latitude: 51.6071,
    longitude: -0.1243,
    name: 'Bounds Green',
    display_name: 'Bounds<br />Green',
    zone: 3.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 32,
    latitude: 51.5273,
    longitude: -0.0208,
    name: 'Bow Church',
    display_name: 'Bow<br />Church',
    zone: 2,
    total_lines: 3,
    rail: 0
   },
  {
    id: 33,
    latitude: 51.5269,
    longitude: -0.0247,
    name: 'Bow Road',
    display_name: 'Bow<br />Road',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 34,
    latitude: 51.5766,
    longitude: -0.2136,
    name: 'Brent Cross',
    display_name: 'Brent<br />Cross',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 36,
    latitude: 51.5248,
    longitude: -0.0119,
    name: 'Bromley-By-Bow',
    display_name: null,
    zone: 2.5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 38,
    latitude: 51.6028,
    longitude: -0.2641,
    name: 'Burnt Oak',
    display_name: 'Burnt<br />Oak',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 39,
    latitude: 51.5481,
    longitude: -0.1188,
    name: 'Caledonian Road',
    display_name: 'Caledonian<br />Road',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 40,
    latitude: 51.5392,
    longitude: -0.1426,
    name: 'Camden Town',
    display_name: 'Camden<br />Town',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 42,
    latitude: 51.5051,
    longitude: -0.0209,
    name: 'Canary Wharf',
    display_name: 'Canary<br />Wharf',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 44,
    latitude: 51.5113,
    longitude: -0.0904,
    name: 'Cannon Street',
    display_name: 'Cannon<br />Street',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 45,
    latitude: 51.6078,
    longitude: -0.2947,
    name: 'Canons Park',
    display_name: 'Canons<br />Park',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 47,
    latitude: 51.5441,
    longitude: -0.1538,
    name: 'Chalk Farm',
    display_name: 'Chalk<br />Farm',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 48,
    latitude: 51.5185,
    longitude: -0.1111,
    name: 'Chancery Lane',
    display_name: 'Chancery<br />Lane',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 49,
    latitude: 51.508,
    longitude: -0.1247,
    name: 'Charing Cross',
    display_name: 'Charing<br />Cross',
    zone: 1,
    total_lines: 2,
    rail: 1
   },
  {
    id: 51,
    latitude: 51.6177,
    longitude: 0.0755,
    name: 'Chigwell',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 52,
    latitude: 51.4946,
    longitude: -0.2678,
    name: 'Chiswick Park',
    display_name: 'Chiswick<br />Park',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 54,
    latitude: 51.4618,
    longitude: -0.1384,
    name: 'Clapham Common',
    display_name: 'Clapham<br />Common',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 55,
    latitude: 51.4649,
    longitude: -0.1299,
    name: 'Clapham North',
    display_name: 'Clapham<br />North',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 56,
    latitude: 51.4527,
    longitude: -0.148,
    name: 'Clapham South',
    display_name: 'Clapham<br />South',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 58,
    latitude: 51.5955,
    longitude: -0.2502,
    name: 'Colindale',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 59,
    latitude: 51.418,
    longitude: -0.1778,
    name: 'Colliers Wood',
    display_name: 'Colliers<br />Wood',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 60,
    latitude: 51.5129,
    longitude: -0.1243,
    name: 'Covent Garden',
    display_name: 'Covent<br />Garden',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 61,
    latitude: 51.4957,
    longitude: -0.0144,
    name: 'Crossharbour & London Arena',
    display_name: 'Crossharbour &<br />London Arena',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 63,
    latitude: 51.5095,
    longitude: 0.0276,
    name: 'Custom House',
    display_name: 'Custom<br />House',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 65,
    latitude: 51.5085,
    longitude: 0.064,
    name: 'Cyprus',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 66,
    latitude: 51.5443,
    longitude: 0.1655,
    name: 'Dagenham East',
    display_name: 'Dagenham<br />East',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 67,
    latitude: 51.5417,
    longitude: 0.1469,
    name: 'Dagenham Heathway',
    display_name: 'Dagenham<br />Heathway',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 70,
    latitude: 51.5223,
    longitude: -0.0173,
    name: 'Devons Road',
    display_name: 'Devons<br />Road',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 71,
    latitude: 51.552,
    longitude: -0.2387,
    name: 'Dollis Hill',
    display_name: 'Dollis<br />Hill',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 72,
    latitude: 51.5152,
    longitude: -0.3017,
    name: 'Ealing Broadway',
    display_name: 'Ealing<br />Broadway',
    zone: 3,
    total_lines: 2,
    rail: 1
   },
  {
    id: 73,
    latitude: 51.5101,
    longitude: -0.2882,
    name: 'Ealing Common',
    display_name: 'Ealing<br />Common',
    zone: 3,
    total_lines: 2,
    rail: 0
   },
  {
    id: 74,
    latitude: 51.492,
    longitude: -0.1973,
    name: 'Earl\'s Court',
    display_name: 'Earl\'s<br />Court',
    zone: 1.5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 75,
    latitude: 51.5765,
    longitude: -0.397,
    name: 'Eastcote',
    display_name: null,
    zone: 5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 76,
    latitude: 51.5168,
    longitude: -0.2474,
    name: 'East Acton',
    display_name: 'East<br />Acton',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 77,
    latitude: 51.5874,
    longitude: -0.165,
    name: 'East Finchley',
    display_name: 'East<br />Finchley',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 78,
    latitude: 51.5394,
    longitude: 0.0518,
    name: 'East Ham',
    display_name: 'East<br />Ham',
    zone: 3.5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 79,
    latitude: 51.5093,
    longitude: -0.0021,
    name: 'East India',
    display_name: 'East<br />India',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 80,
    latitude: 51.4586,
    longitude: -0.2112,
    name: 'East Putney',
    display_name: 'East<br />Putney',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 81,
    latitude: 51.6137,
    longitude: -0.275,
    name: 'Edgware',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 82,
    latitude: 51.5199,
    longitude: -0.1679,
    name: 'Edgware Road (B)',
    display_name: 'Edgware<br />Road',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 83,
    latitude: 51.5203,
    longitude: -0.17,
    name: 'Edgware Road (C)',
    display_name: 'Edgware<br />Road',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 84,
    latitude: 51.4943,
    longitude: -0.1001,
    name: 'Elephant & Castle',
    display_name: 'Elephant &<br />Castle',
    zone: 1.5,
    total_lines: 2,
    rail: 1
   },
  {
    id: 85,
    latitude: 51.5496,
    longitude: 0.1977,
    name: 'Elm Park',
    display_name: 'Elm<br />Park',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 87,
    latitude: 51.5074,
    longitude: -0.1223,
    name: 'Embankment',
    display_name: null,
    zone: 1,
    total_lines: 4,
    rail: 0
   },
  {
    id: 89,
    latitude: 51.5282,
    longitude: -0.1337,
    name: 'Euston',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 1
   },
  {
    id: 90,
    latitude: 51.526,
    longitude: -0.1359,
    name: 'Euston Square',
    display_name: 'Euston<br />Square',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 91,
    latitude: 51.596,
    longitude: 0.0912,
    name: 'Fairlop',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 92,
    latitude: 51.5203,
    longitude: -0.1053,
    name: 'Farringdon',
    display_name: null,
    zone: 1,
    total_lines: 3,
    rail: 1
   },
  {
    id: 93,
    latitude: 51.6012,
    longitude: -0.1932,
    name: 'Finchley Central',
    display_name: 'Finchley<br />Central',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 94,
    latitude: 51.5472,
    longitude: -0.1803,
    name: 'Finchley Road',
    display_name: 'Finchley<br />Road',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 95,
    latitude: 51.5642,
    longitude: -0.1065,
    name: 'Finsbury Park',
    display_name: 'Finsbury<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 96,
    latitude: 51.4804,
    longitude: -0.195,
    name: 'Fulham Broadway',
    display_name: 'Fulham<br />Broadway',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 97,
    latitude: 51.5096,
    longitude: 0.0716,
    name: 'Gallions Reach',
    display_name: 'Gallions<br />Reach',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 98,
    latitude: 51.5765,
    longitude: 0.0663,
    name: 'Gants Hill',
    display_name: 'Gants<br />Hill',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 99,
    latitude: 51.4945,
    longitude: -0.1829,
    name: 'Gloucester Road',
    display_name: 'Gloucester<br />Road',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 100,
    latitude: 51.5724,
    longitude: -0.1941,
    name: 'Golders Green',
    display_name: 'Golders<br />Green',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 101,
    latitude: 51.5018,
    longitude: -0.2267,
    name: 'Goldhawk Road',
    display_name: 'Goldhawk<br />Road',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 102,
    latitude: 51.5205,
    longitude: -0.1347,
    name: 'Goodge Street',
    display_name: 'Goodge<br />Street',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 103,
    latitude: 51.6132,
    longitude: 0.0923,
    name: 'Grange Hill',
    display_name: 'Grange<br />Hill',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 104,
    latitude: 51.5238,
    longitude: -0.1439,
    name: 'Great Portland Street',
    display_name: 'Great<br />Portland<br />Street',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 105,
    latitude: 51.5423,
    longitude: -0.3456,
    name: 'Greenford',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 1
   },
  {
    id: 107,
    latitude: 51.5067,
    longitude: -0.1428,
    name: 'Green Park',
    display_name: 'Green<br />Park',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 108,
    latitude: 51.4915,
    longitude: -0.2754,
    name: 'Gunnersbury',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 109,
    latitude: 51.603,
    longitude: 0.0933,
    name: 'Hainault',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 110,
    latitude: 51.4936,
    longitude: -0.2251,
    name: 'Hammersmith',
    display_name: null,
    zone: 2,
    total_lines: 3,
    rail: 0
   },
  {
    id: 111,
    latitude: 51.5568,
    longitude: -0.178,
    name: 'Hampstead',
    display_name: null,
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 112,
    latitude: 51.5302,
    longitude: -0.2933,
    name: 'Hanger Lane',
    display_name: 'Hanger<br />Lane',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 113,
    latitude: 51.5362,
    longitude: -0.2575,
    name: 'Harlesden',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 114,
    latitude: 51.5925,
    longitude: -0.3351,
    name: 'Harrow & Wealdston',
    display_name: 'Harrow &<br />Wealdston',
    zone: 5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 115,
    latitude: 51.5793,
    longitude: -0.3366,
    name: 'Harrow-on-the-Hill',
    display_name: 'Harrow-<br />on-the-Hill',
    zone: 5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 116,
    latitude: 51.4669,
    longitude: -0.4227,
    name: 'Hatton Cross',
    display_name: 'Hatton<br />Cross',
    zone: 5.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 117,
    latitude: 51.4713,
    longitude: -0.4524,
    name: 'Heathrow Terminals 1, 2 & 3',
    display_name: 'Heathrow<br />Terminals<br />1, 2 & 3',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 118,
    latitude: 51.4598,
    longitude: -0.4476,
    name: 'Heathrow Terminal 4',
    display_name: 'Heathrow<br />Terminal 4',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 119,
    latitude: 51.5829,
    longitude: -0.2259,
    name: 'Hendon Central',
    display_name: 'Hendon<br />Central',
    zone: 3.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 120,
    latitude: 51.5033,
    longitude: -0.0215,
    name: 'Heron Quays',
    display_name: 'Heron<br />Quays',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 122,
    latitude: 51.5009,
    longitude: -0.1925,
    name: 'High Street Kensington',
    display_name: 'High<br />Street<br />Kensington',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 123,
    latitude: 51.546,
    longitude: -0.104,
    name: 'Highbury & Islington',
    display_name: 'Highbury &<br />Islington',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 124,
    latitude: 51.5777,
    longitude: -0.1458,
    name: 'Highgate',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 125,
    latitude: 51.5538,
    longitude: -0.4499,
    name: 'Hillingdon',
    display_name: null,
    zone: 6,
    total_lines: 2,
    rail: 0
   },
  {
    id: 126,
    latitude: 51.5174,
    longitude: -0.12,
    name: 'Holborn',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 127,
    latitude: 51.5075,
    longitude: -0.206,
    name: 'Holland Park',
    display_name: 'Holland<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 128,
    latitude: 51.5526,
    longitude: -0.1132,
    name: 'Holloway Road',
    display_name: 'Holloway<br />Road',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 129,
    latitude: 51.5539,
    longitude: 0.2184,
    name: 'Hornchurch',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 130,
    latitude: 51.4713,
    longitude: -0.3665,
    name: 'Hounslow Central',
    display_name: 'Hounslow<br />Central',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 131,
    latitude: 51.4733,
    longitude: -0.3564,
    name: 'Hounslow East',
    display_name: 'Hounslow<br />East',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 132,
    latitude: 51.4734,
    longitude: -0.3855,
    name: 'Hounslow West',
    display_name: 'Hounslow<br />West',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 133,
    latitude: 51.5027,
    longitude: -0.1527,
    name: 'Hyde Park Corner',
    display_name: 'Hyde<br />Park<br />Corner',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 134,
    latitude: 51.5619,
    longitude: -0.4421,
    name: 'Ickenham',
    display_name: null,
    zone: 6,
    total_lines: 2,
    rail: 0
   },
  {
    id: 135,
    latitude: 51.4871,
    longitude: -0.0101,
    name: 'Island Gardens',
    display_name: 'Island<br />Gardens',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 136,
    latitude: 51.4884,
    longitude: -0.1053,
    name: 'Kennington',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 137,
    latitude: 51.5304,
    longitude: -0.225,
    name: 'Kensal Green',
    display_name: 'Kensal<br />Green',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 138,
    latitude: 51.4983,
    longitude: -0.2106,
    name: 'Kensington (Olympia)',
    display_name: 'Kensington<br />(Olympia)',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 139,
    latitude: 51.5507,
    longitude: -0.1402,
    name: 'Kentish Town',
    display_name: 'Kentish<br />Town',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 140,
    latitude: 51.5816,
    longitude: -0.3162,
    name: 'Kenton',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 141,
    latitude: 51.477,
    longitude: -0.285,
    name: 'Kew Gardens',
    display_name: 'Kew<br />Gardens',
    zone: 3.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 142,
    latitude: 51.5471,
    longitude: -0.2047,
    name: 'Kilburn',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 143,
    latitude: 51.5351,
    longitude: -0.1939,
    name: 'Kilburn Park',
    display_name: 'Kilburn<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 144,
    latitude: 51.5846,
    longitude: -0.2786,
    name: 'Kingsbury',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 145,
    latitude: 51.5308,
    longitude: -0.1238,
    name: 'King\'s Cross St. Pancras',
    display_name: 'King\'s Cross<br />St. Pancras',
    zone: 1,
    total_lines: 6,
    rail: 1
   },
  {
    id: 146,
    latitude: 51.5015,
    longitude: -0.1607,
    name: 'Knightsbridge',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 147,
    latitude: 51.5172,
    longitude: -0.2107,
    name: 'Ladbroke Grove',
    display_name: 'Ladbroke<br />Grove',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 148,
    latitude: 51.4991,
    longitude: -0.1115,
    name: 'Lambeth North',
    display_name: 'Lambeth<br />North',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 149,
    latitude: 51.5119,
    longitude: -0.1756,
    name: 'Lancaster Gate',
    display_name: 'Lancaster<br />Gate',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 150,
    latitude: 51.5139,
    longitude: -0.2172,
    name: 'Latimer Road',
    display_name: 'Latimer<br />Road',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 151,
    latitude: 51.5113,
    longitude: -0.1281,
    name: 'Leicester Square',
    display_name: 'Leicester<br />Square',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 153,
    latitude: 51.5566,
    longitude: -0.0053,
    name: 'Leyton',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 154,
    latitude: 51.5683,
    longitude: 0.0083,
    name: 'Leytonstone',
    display_name: null,
    zone: 3.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 155,
    latitude: 51.5123,
    longitude: -0.0396,
    name: 'Limehouse',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 156,
    latitude: 51.5178,
    longitude: -0.0823,
    name: 'Liverpool Street',
    display_name: 'Liverpool<br />Street',
    zone: 1,
    total_lines: 4,
    rail: 1
   },
  {
    id: 157,
    latitude: 51.5052,
    longitude: -0.0864,
    name: 'London Bridge',
    display_name: 'London<br />Bridge',
    zone: 1,
    total_lines: 2,
    rail: 1
   },
  {
    id: 159,
    latitude: 51.53,
    longitude: -0.1854,
    name: 'Maida Vale',
    display_name: 'Maida<br />Vale',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 160,
    latitude: 51.5712,
    longitude: -0.0958,
    name: 'Manor House',
    display_name: 'Manor<br />House',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 161,
    latitude: 51.5122,
    longitude: -0.094,
    name: 'Mansion House',
    display_name: 'Mansion<br />House',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 162,
    latitude: 51.5136,
    longitude: -0.1586,
    name: 'Marble Arch',
    display_name: 'Marble<br />Arch',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 163,
    latitude: 51.5225,
    longitude: -0.1631,
    name: 'Marylebone',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 1
   },
  {
    id: 164,
    latitude: 51.5249,
    longitude: -0.0332,
    name: 'Mile End',
    display_name: 'Mile<br />End',
    zone: 2,
    total_lines: 3,
    rail: 0
   },
  {
    id: 165,
    latitude: 51.6082,
    longitude: -0.2103,
    name: 'Mill Hill East',
    display_name: 'Mill<br />Hill<br />East',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 166,
    latitude: 51.5108,
    longitude: -0.0863,
    name: 'Monument',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 167,
    latitude: 51.5186,
    longitude: -0.0886,
    name: 'Moorgate',
    display_name: null,
    zone: 1,
    total_lines: 4,
    rail: 1
   },
  {
    id: 168,
    latitude: 51.6294,
    longitude: -0.432,
    name: 'Moor Park',
    display_name: 'Moor<br />Park',
    zone: 6.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 169,
    latitude: 51.4022,
    longitude: -0.1948,
    name: 'Morden',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 170,
    latitude: 51.5342,
    longitude: -0.1387,
    name: 'Mornington Crescent',
    display_name: 'Mornington<br />Crescent',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 171,
    latitude: 51.4902,
    longitude: -0.0145,
    name: 'Mudchute',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 172,
    latitude: 51.5542,
    longitude: -0.2503,
    name: 'Neasden',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 173,
    latitude: 51.5756,
    longitude: 0.0899,
    name: 'Newbury Park',
    display_name: 'Newbury<br />Park',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 176,
    latitude: 51.4995,
    longitude: -0.3142,
    name: 'Northfields',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 177,
    latitude: 51.5483,
    longitude: -0.3687,
    name: 'Northolt',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 178,
    latitude: 51.5784,
    longitude: -0.3184,
    name: 'Northwick Park',
    display_name: 'Northwick<br />Park',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 179,
    latitude: 51.6111,
    longitude: -0.424,
    name: 'Northwood',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 180,
    latitude: 51.6004,
    longitude: -0.4092,
    name: 'Northwood Hills',
    display_name: 'Northwood<br />Hills',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 181,
    latitude: 51.5237,
    longitude: -0.2597,
    name: 'North Acton',
    display_name: 'North<br />Acton',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 182,
    latitude: 51.5175,
    longitude: -0.2887,
    name: 'North Ealing',
    display_name: 'North<br />Ealing',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 184,
    latitude: 51.5846,
    longitude: -0.3626,
    name: 'North Harrow',
    display_name: 'North<br />Harrow',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 185,
    latitude: 51.5621,
    longitude: -0.3034,
    name: 'North Wembley',
    display_name: 'North<br />Wembley',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 186,
    latitude: 51.5094,
    longitude: -0.1967,
    name: 'Notting Hill Gate',
    display_name: 'Notting<br />Hill Gate',
    zone: 1.5,
    total_lines: 3,
    rail: 0
   },
  {
    id: 188,
    latitude: 51.5263,
    longitude: -0.0873,
    name: 'Old Street',
    display_name: 'Old<br />Street',
    zone: 1,
    total_lines: 1,
    rail: 1
   },
  {
    id: 190,
    latitude: 51.4813,
    longitude: -0.3522,
    name: 'Osterley',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 191,
    latitude: 51.4819,
    longitude: -0.113,
    name: 'Oval',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 192,
    latitude: 51.515,
    longitude: -0.1415,
    name: 'Oxford Circus',
    display_name: 'Oxford<br />Circus',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 193,
    latitude: 51.5154,
    longitude: -0.1755,
    name: 'Paddington',
    display_name: null,
    zone: 1,
    total_lines: 4,
    rail: 1
   },
  {
    id: 194,
    latitude: 51.527,
    longitude: -0.2841,
    name: 'Park Royal',
    display_name: 'Park<br />Royal',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 195,
    latitude: 51.4753,
    longitude: -0.2011,
    name: 'Parsons Green',
    display_name: 'Parsons<br />Green',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 196,
    latitude: 51.5366,
    longitude: -0.3232,
    name: 'Perivale',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 197,
    latitude: 51.5098,
    longitude: -0.1342,
    name: 'Picadilly Circus',
    display_name: 'Picadilly<br />Circus',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 198,
    latitude: 51.4893,
    longitude: -0.1334,
    name: 'Pimlico',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 199,
    latitude: 51.5926,
    longitude: -0.3805,
    name: 'Pinner',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 200,
    latitude: 51.5313,
    longitude: 0.0172,
    name: 'Plaistow',
    display_name: null,
    zone: 3,
    total_lines: 2,
    rail: 0
   },
  {
    id: 201,
    latitude: 51.5077,
    longitude: -0.0173,
    name: 'Poplar',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 202,
    latitude: 51.572,
    longitude: -0.2954,
    name: 'Preston Road',
    display_name: 'Preston<br />Road',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 203,
    latitude: 51.5093,
    longitude: 0.0336,
    name: 'Prince Regent',
    display_name: 'Prince<br />Regent',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 205,
    latitude: 51.4682,
    longitude: -0.2089,
    name: 'Putney Bridge',
    display_name: 'Putney<br />Bridge',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 206,
    latitude: 51.5341,
    longitude: -0.2047,
    name: 'Queen\'s Park',
    display_name: 'Queens<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 207,
    latitude: 51.5942,
    longitude: -0.2861,
    name: 'Queensbury',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 208,
    latitude: 51.5107,
    longitude: -0.1877,
    name: 'Queensway',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 209,
    latitude: 51.4942,
    longitude: -0.2359,
    name: 'Ravenscourt Park',
    display_name: 'Ravenscourt<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 210,
    latitude: 51.5753,
    longitude: -0.3714,
    name: 'Rayners Lane',
    display_name: 'Rayners<br />Lane',
    zone: 5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 211,
    latitude: 51.5763,
    longitude: 0.0454,
    name: 'Redbridge',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 212,
    latitude: 51.5234,
    longitude: -0.1466,
    name: 'Regent\'s Park',
    display_name: 'Regent\'s<br />Park',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 213,
    latitude: 51.4633,
    longitude: -0.3013,
    name: 'Richmond',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 1
   },
  {
    id: 215,
    latitude: 51.6171,
    longitude: 0.0439,
    name: 'Roding Valley',
    display_name: 'Roding<br />Valley',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 216,
    latitude: 51.501,
    longitude: -0.0525,
    name: 'Rotherhithe',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 217,
    latitude: 51.5084,
    longitude: 0.0465,
    name: 'Royal Albert',
    display_name: 'Royal<br />Albert',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 218,
    latitude: 51.519,
    longitude: -0.188,
    name: 'Royal Oak',
    display_name: 'Royal<br />Oak',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 219,
    latitude: 51.5091,
    longitude: 0.0181,
    name: 'Royal Victoria',
    display_name: 'Royal<br />Victoria',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 220,
    latitude: 51.5715,
    longitude: -0.4213,
    name: 'Ruislip',
    display_name: null,
    zone: 6,
    total_lines: 2,
    rail: 0
   },
  {
    id: 222,
    latitude: 51.5732,
    longitude: -0.4125,
    name: 'Ruislip Manor',
    display_name: 'Ruislip<br />Manor',
    zone: 6,
    total_lines: 2,
    rail: 0
   },
  {
    id: 223,
    latitude: 51.523,
    longitude: -0.1244,
    name: 'Russell Square',
    display_name: 'Russell<br />Square',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 224,
    latitude: 51.5822,
    longitude: -0.0749,
    name: 'Seven Sisters',
    display_name: 'Seven<br />Sisters',
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 225,
    latitude: 51.5117,
    longitude: -0.056,
    name: 'Shadwell',
    display_name: null,
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 226,
    latitude: 51.5046,
    longitude: -0.2187,
    name: 'Shepherd\'s Bush (C)',
    display_name: 'Shepherd\'s<br />Bush',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 227,
    latitude: 51.5058,
    longitude: -0.2265,
    name: 'Shepherd\'s Bush (H)',
    display_name: 'Shepherd\'s<br />Bush',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 228,
    latitude: 51.5227,
    longitude: -0.0708,
    name: 'Shoreditch',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 229,
    latitude: 51.4924,
    longitude: -0.1565,
    name: 'Sloane Square',
    display_name: 'Sloane<br />Square',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 230,
    latitude: 51.5808,
    longitude: 0.0216,
    name: 'Snaresbrook',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 231,
    latitude: 51.4454,
    longitude: -0.2066,
    name: 'Southfields',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 234,
    latitude: 51.5011,
    longitude: -0.3072,
    name: 'South Ealing',
    display_name: 'South<br />Ealing',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 235,
    latitude: 51.5646,
    longitude: -0.3521,
    name: 'South Harrow',
    display_name: 'South<br />Harrow',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 236,
    latitude: 51.4941,
    longitude: -0.1738,
    name: 'South Kensington',
    display_name: 'South<br />Kensington',
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 237,
    latitude: 51.5701,
    longitude: -0.3081,
    name: 'South Kenton',
    display_name: 'South<br />Kenton',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 238,
    latitude: 51.5007,
    longitude: -0.0191,
    name: 'South Quay',
    display_name: 'South<br />Quay',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 239,
    latitude: 51.5569,
    longitude: -0.3988,
    name: 'South Ruislip',
    display_name: 'South<br />Ruislip',
    zone: 5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 240,
    latitude: 51.4154,
    longitude: -0.1919,
    name: 'South Wimbledon',
    display_name: 'South<br />Wimbledon',
    zone: 3.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 241,
    latitude: 51.5917,
    longitude: 0.0275,
    name: 'South Woodford',
    display_name: 'South<br />Woodford',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 242,
    latitude: 51.495,
    longitude: -0.2459,
    name: 'Stamford Brook',
    display_name: 'Stamford<br />Brook',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 243,
    latitude: 51.6194,
    longitude: -0.3028,
    name: 'Stanmore',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 244,
    latitude: 51.5221,
    longitude: -0.047,
    name: 'Stepney Green',
    display_name: 'Stepney<br />Green',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 245,
    latitude: 51.4723,
    longitude: -0.123,
    name: 'Stockwell',
    display_name: null,
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 246,
    latitude: 51.5439,
    longitude: -0.2759,
    name: 'Stonebridge Park',
    display_name: 'Stonebridge<br />Park',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 247,
    latitude: 51.5416,
    longitude: -0.0042,
    name: 'Stratford',
    display_name: null,
    zone: 3,
    total_lines: 3,
    rail: 1
   },
  {
    id: 248,
    latitude: 51.4994,
    longitude: -0.1335,
    name: 'St. James\'s Park',
    display_name: 'St. James\'s<br />Park',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 249,
    latitude: 51.5347,
    longitude: -0.174,
    name: 'St. John\'s Wood',
    display_name: 'St. John\'s<br />Wood',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 250,
    latitude: 51.5146,
    longitude: -0.0973,
    name: 'St. Paul\'s',
    display_name: 'St. Paul\'s',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 251,
    latitude: 51.5569,
    longitude: -0.3366,
    name: 'Sudbury Hill',
    display_name: 'Sudbury<br />Hill',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 252,
    latitude: 51.5507,
    longitude: -0.3156,
    name: 'Sudbury Town',
    display_name: 'Sudbury<br />Town',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 253,
    latitude: 51.4933,
    longitude: -0.0478,
    name: 'Surrey Quays',
    display_name: 'Surrey<br />Quays',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 254,
    latitude: 51.5432,
    longitude: -0.1738,
    name: 'Swiss Cottage',
    display_name: 'Swiss<br />Cottage',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 255,
    latitude: 51.5111,
    longitude: -0.1141,
    name: 'Temple',
    display_name: null,
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 257,
    latitude: 51.4361,
    longitude: -0.1598,
    name: 'Tooting Bec',
    display_name: 'Tooting<br />Bec',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 258,
    latitude: 51.4275,
    longitude: -0.168,
    name: 'Tooting Broadway',
    display_name: 'Tooting<br />Broadway',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 259,
    latitude: 51.5165,
    longitude: -0.131,
    name: 'Tottenham Court Road',
    display_name: 'Tottenham<br />Court<br />Road',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 260,
    latitude: 51.5882,
    longitude: -0.0594,
    name: 'Tottenham Hale',
    display_name: 'Tottenham<br />Hale',
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 262,
    latitude: 51.5106,
    longitude: -0.0743,
    name: 'Tower Gateway',
    display_name: 'Tower<br />Gateway',
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 263,
    latitude: 51.5098,
    longitude: -0.0766,
    name: 'Tower Hill',
    display_name: 'Tower<br />Hill',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 264,
    latitude: 51.5567,
    longitude: -0.1374,
    name: 'Tufnell Park',
    display_name: 'Tufnell<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 265,
    latitude: 51.4951,
    longitude: -0.2547,
    name: 'Turnham Green',
    display_name: 'Turnham<br />Green',
    zone: 2.5,
    total_lines: 2,
    rail: 0
   },
  {
    id: 266,
    latitude: 51.5904,
    longitude: -0.1028,
    name: 'Turnpike Lane',
    display_name: 'Turnpike<br />Lane',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 267,
    latitude: 51.559,
    longitude: 0.251,
    name: 'Upminster',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 1
   },
  {
    id: 268,
    latitude: 51.5582,
    longitude: 0.2343,
    name: 'Upminster Bridge',
    display_name: 'Upminster<br />Bridge',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 269,
    latitude: 51.5385,
    longitude: 0.1014,
    name: 'Upney',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 270,
    latitude: 51.5352,
    longitude: 0.0343,
    name: 'Upton Park',
    display_name: 'Upton<br />Park',
    zone: 3,
    total_lines: 2,
    rail: 0
   },
  {
    id: 271,
    latitude: 51.5463,
    longitude: -0.4786,
    name: 'Uxbridge',
    display_name: null,
    zone: 6,
    total_lines: 2,
    rail: 0
   },
  {
    id: 272,
    latitude: 51.4861,
    longitude: -0.1253,
    name: 'Vauxhall',
    display_name: null,
    zone: 1.5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 273,
    latitude: 51.4965,
    longitude: -0.1447,
    name: 'Victoria',
    display_name: null,
    zone: 1,
    total_lines: 3,
    rail: 1
   },
  {
    id: 274,
    latitude: 51.583,
    longitude: -0.0195,
    name: 'Walthamstow Central',
    display_name: 'Walthamstow<br />Central',
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 275,
    latitude: 51.5775,
    longitude: 0.0288,
    name: 'Wanstead',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 276,
    latitude: 51.5043,
    longitude: -0.0558,
    name: 'Wapping',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 277,
    latitude: 51.5247,
    longitude: -0.1384,
    name: 'Warren Street',
    display_name: 'Warren<br />Street',
    zone: 1,
    total_lines: 2,
    rail: 0
   },
  {
    id: 278,
    latitude: 51.5235,
    longitude: -0.1835,
    name: 'Warwick Avenue',
    display_name: 'Warwick<br />Avenue',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 279,
    latitude: 51.5036,
    longitude: -0.1143,
    name: 'Waterloo',
    display_name: null,
    zone: 1,
    total_lines: 4,
    rail: 1
   },
  {
    id: 281,
    latitude: 51.5519,
    longitude: -0.2963,
    name: 'Wembley Central',
    display_name: 'Wembley<br />Central',
    zone: 4,
    total_lines: 1,
    rail: 1
   },
  {
    id: 282,
    latitude: 51.5635,
    longitude: -0.2795,
    name: 'Wembley Park',
    display_name: 'Wembley<br />Park',
    zone: 4,
    total_lines: 2,
    rail: 0
   },
  {
    id: 283,
    latitude: 51.521,
    longitude: -0.2011,
    name: 'Westbourne Park',
    display_name: 'Westbourne<br />Park',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 284,
    latitude: 51.5097,
    longitude: -0.0265,
    name: 'Westferry',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 285,
    latitude: 51.501,
    longitude: -0.1254,
    name: 'Westminster',
    display_name: null,
    zone: 1,
    total_lines: 3,
    rail: 0
   },
  {
    id: 286,
    latitude: 51.518,
    longitude: -0.2809,
    name: 'West Acton',
    display_name: 'West<br />Acton',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 287,
    latitude: 51.4872,
    longitude: -0.1953,
    name: 'West Brompton',
    display_name: 'West<br />Brompton',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 288,
    latitude: 51.6095,
    longitude: -0.1883,
    name: 'West Finchley',
    display_name: 'West<br />Finchley',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 289,
    latitude: 51.5287,
    longitude: 0.0056,
    name: 'West Ham',
    display_name: 'West<br />Ham',
    zone: 3,
    total_lines: 3,
    rail: 1
   },
  {
    id: 290,
    latitude: 51.5469,
    longitude: -0.1906,
    name: 'West Hampstead',
    display_name: 'West<br />Hampstead',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 291,
    latitude: 51.5795,
    longitude: -0.3533,
    name: 'West Harrow',
    display_name: 'West<br />Harrow',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 292,
    latitude: 51.507,
    longitude: -0.0203,
    name: 'West India Quay',
    display_name: 'West<br />India<br />Quay',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 293,
    latitude: 51.4907,
    longitude: -0.2065,
    name: 'West Kensington',
    display_name: 'West<br />Kensington',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 294,
    latitude: 51.5696,
    longitude: -0.4376,
    name: 'West Ruislip',
    display_name: 'West<br />Ruislip',
    zone: 6,
    total_lines: 1,
    rail: 1
   },
  {
    id: 295,
    latitude: 51.5194,
    longitude: -0.0612,
    name: 'Whitechapel',
    display_name: null,
    zone: 2,
    total_lines: 3,
    rail: 0
   },
  {
    id: 296,
    latitude: 51.512,
    longitude: -0.2239,
    name: 'White City',
    display_name: 'White<br />City',
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 297,
    latitude: 51.5492,
    longitude: -0.2215,
    name: 'Willesden Green',
    display_name: 'Willesden<br />Green',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 298,
    latitude: 51.5326,
    longitude: -0.2478,
    name: 'Willesden Junction',
    display_name: 'Willesden<br />Junction',
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 299,
    latitude: 51.4214,
    longitude: -0.2064,
    name: 'Wimbledon',
    display_name: null,
    zone: 3,
    total_lines: 1,
    rail: 1
   },
  {
    id: 300,
    latitude: 51.4343,
    longitude: -0.1992,
    name: 'Wimbledon Park',
    display_name: 'Wimbledon<br />Park',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 301,
    latitude: 51.607,
    longitude: 0.0341,
    name: 'Woodford',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 302,
    latitude: 51.6179,
    longitude: -0.1856,
    name: 'Woodside Park',
    display_name: 'Woodside<br />Park',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 303,
    latitude: 51.5975,
    longitude: -0.1097,
    name: 'Wood Green',
    display_name: 'Wood<br />Green',
    zone: 3,
    total_lines: 1,
    rail: 0
   },
  {
    id: 35,
    latitude: 51.4627,
    longitude: -0.1145,
    name: 'Brixton',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 6,
    latitude: 51.6736,
    longitude: -0.607,
    name: 'Amersham',
    display_name: null,
    zone: 10,
    total_lines: 1,
    rail: 1
   },
  {
    id: 23,
    latitude: 51.4979,
    longitude: -0.0637,
    name: 'Bermondsey',
    display_name: null,
    zone: 2,
    total_lines: 1,
    rail: 0
   },
  {
    id: 50,
    latitude: 51.7052,
    longitude: -0.611,
    name: 'Chesham',
    display_name: null,
    zone: 10,
    total_lines: 1,
    rail: 0
   },
  {
    id: 46,
    latitude: 51.6679,
    longitude: -0.561,
    name: 'Chalfont & Latimer',
    display_name: 'Chalfont &<br />Latimer',
    zone: 9,
    total_lines: 1,
    rail: 1
   },
  {
    id: 53,
    latitude: 51.6543,
    longitude: -0.5183,
    name: 'Chorleywood',
    display_name: null,
    zone: 8,
    total_lines: 1,
    rail: 0
   },
  {
    id: 214,
    latitude: 51.6404,
    longitude: -0.4733,
    name: 'Rickmansworth',
    display_name: null,
    zone: 7,
    total_lines: 1,
    rail: 0
   },
  {
    id: 62,
    latitude: 51.647,
    longitude: -0.4412,
    name: 'Croxley',
    display_name: null,
    zone: 7,
    total_lines: 1,
    rail: 0
   },
  {
    id: 280,
    latitude: 51.6573,
    longitude: -0.4177,
    name: 'Watford',
    display_name: null,
    zone: 8,
    total_lines: 1,
    rail: 0
   },
  {
    id: 221,
    latitude: 51.5606,
    longitude: -0.4103,
    name: 'Ruislip Gardens',
    display_name: 'Ruislip<br />Gardens',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 121,
    latitude: 51.6503,
    longitude: -0.1943,
    name: 'High Barnet',
    display_name: 'High<br />Barnet',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 261,
    latitude: 51.6302,
    longitude: -0.1791,
    name: 'Totteridge & Whetstone',
    display_name: 'Totteridge<br />& Whetstone',
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 57,
    latitude: 51.6517,
    longitude: -0.1496,
    name: 'Cockfosters',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 187,
    latitude: 51.6476,
    longitude: -0.1318,
    name: 'Oakwood',
    display_name: null,
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 232,
    latitude: 51.6322,
    longitude: -0.128,
    name: 'Southgate',
    display_name: null,
    zone: 4,
    total_lines: 1,
    rail: 0
   },
  {
    id: 88,
    latitude: 51.6937,
    longitude: 0.1139,
    name: 'Epping',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 256,
    latitude: 51.6717,
    longitude: 0.1033,
    name: 'Theydon Bois',
    display_name: 'Theydon<br />Bois',
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 68,
    latitude: 51.6455,
    longitude: 0.0838,
    name: 'Debden',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 158,
    latitude: 51.6412,
    longitude: 0.0558,
    name: 'Loughton',
    display_name: null,
    zone: 6,
    total_lines: 1,
    rail: 0
   },
  {
    id: 37,
    latitude: 51.6266,
    longitude: 0.0471,
    name: 'Buckhurst Hill',
    display_name: 'Buckhurst<br />Hill',
    zone: 5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 204,
    latitude: 51.5343,
    longitude: -0.0139,
    name: 'Pudding Mill Lane',
    display_name: 'Pudding<br />Mill Lane',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 233,
    latitude: 51.501,
    longitude: -0.1052,
    name: 'Southwark',
    display_name: null,
    zone: 1,
    total_lines: 1,
    rail: 0
   },
  {
    id: 41,
    latitude: 51.4982,
    longitude: -0.0502,
    name: 'Canada Water',
    display_name: 'Canada<br />Water',
    zone: 2,
    total_lines: 2,
    rail: 0
   },
  {
    id: 43,
    latitude: 51.5147,
    longitude: 0.0082,
    name: 'Canning Town',
    display_name: 'Canning<br />Town',
    zone: 3,
    total_lines: 2,
    rail: 0
   },
  {
    id: 183,
    latitude: 51.5005,
    longitude: 0.0039,
    name: 'North Greenwich',
    display_name: 'North<br />Greenwich',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 64,
    latitude: 51.4827,
    longitude: -0.0096,
    name: 'Cutty Sark',
    display_name: 'Cutty<br />Sark',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 106,
    latitude: 51.4781,
    longitude: -0.0149,
    name: 'Greenwich',
    display_name: null,
    zone: 2.5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 69,
    latitude: 51.474,
    longitude: -0.0216,
    name: 'Deptford Bridge',
    display_name: 'Deptford<br />Bridge',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 86,
    latitude: 51.4693,
    longitude: -0.0174,
    name: 'Elverson Road',
    display_name: 'Elverson<br />Road',
    zone: 2.5,
    total_lines: 1,
    rail: 0
   },
  {
    id: 152,
    latitude: 51.4657,
    longitude: -0.0142,
    name: 'Lewisham',
    display_name: null,
    zone: 2.5,
    total_lines: 1,
    rail: 1
   },
  {
    id: 174,
    latitude: 51.4767,
    longitude: -0.0327,
    name: 'New Cross',
    display_name: 'New<br />Cross',
    zone: 2,
    total_lines: 1,
    rail: 1
   },
  {
    id: 175,
    latitude: 51.4757,
    longitude: -0.0402,
    name: 'New Cross Gate',
    display_name: 'New<br />Cross<br />Gate',
    zone: 2,
    total_lines: 1,
    rail: 1
  }
];
