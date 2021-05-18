// eslint-disable-next-line import/no-extraneous-dependencies
import type { Point } from 'geojson'

export default {
  _links: {
    self: {
      href: 'https://api.data.amsterdam.nl/monumenten/monumenten/3cf53160-d8bf-4447-93ba-1eb03a35cfe4/',
    },
  },
  identificerende_sleutel_monument: '3cf53160-d8bf-4447-93ba-1eb03a35cfe4',
  monumentnummer: 1871,
  monumentnaam: 'Ambtswoning van de burgemeester',
  monumentstatus: 'Rijksmonument',
  monument_aanwijzingsdatum: null,
  betreft_pand: [
    {
      pandidentificatie: '0363100012179338',
      _links: {
        self: {
          href: 'https://api.data.amsterdam.nl/bag/v1.1/pand/0363100012179338/',
        },
      },
    },
  ],
  _display: 'Ambtswoning van de burgemeester',
  heeft_als_grondslag_beperking: null,
  heeft_situeringen: {
    count: 1,
    href: 'https://api.data.amsterdam.nl/monumenten/situeringen/?monument_id=3cf53160-d8bf-4447-93ba-1eb03a35cfe4',
  },
  monumentcoordinaten: {
    type: 'Point',
    coordinates: [121369, 486445],
  } as Point,
  ligt_in_complex: null,
  in_onderzoek: 'N',
}
