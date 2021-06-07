import type { Parkeervak } from '../../../../../../api/parkeervakken'
import normalizeParkeervak from './parkeervak'

describe('normalizeParkeervak', () => {
  it('formats the days', () => {
    const output = normalizeParkeervak({
      regimes: [{ dagen: ['ma', 'di', 'do'], beginTijd: '00:00:00', eindTijd: '12:00:00' }],
    } as unknown as Parkeervak)

    expect(output).toMatchObject({
      regimes: [{ dagenFormatted: 'ma, di, do' }],
    })
  })

  it('formats the time', () => {
    const output = normalizeParkeervak({
      regimes: [{ beginTijd: '00:00:00', eindTijd: '12:00:00', dagen: [] }],
    } as unknown as Parkeervak)

    expect(output).toMatchObject({
      regimes: [{ tijdstip: '00:00 - 12:00', dagen: [] }],
    })
  })
})
