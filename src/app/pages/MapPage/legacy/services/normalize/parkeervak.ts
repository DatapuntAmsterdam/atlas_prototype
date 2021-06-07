import type { Parkeervak, ParkeervakRegime } from '../../../../../../api/parkeervakken'

export interface ParkeervakNormalized extends Parkeervak {
  regimes: ParkeervakRegimeNormalized[]
}

export interface ParkeervakRegimeNormalized extends ParkeervakRegime {
  tijdstip: string | null
  dagenFormatted: string | null
}

export default function normalizeParkeervak(result: Parkeervak): ParkeervakNormalized {
  const TIME_SEPERATOR = ':'

  function formatTime(time: string) {
    const parts = time.split(TIME_SEPERATOR)

    // Remove seconds from time if present (e.g. 20:00:00 => 20:00)
    if (parts.length === 3) {
      return parts.slice(0, -1).join(TIME_SEPERATOR)
    }

    return time
  }

  const regimes = result.regimes.map((regime) => {
    const tijdstip =
      regime.beginTijd && regime.eindTijd
        ? `${formatTime(regime.beginTijd)} - ${formatTime(regime.eindTijd)}`
        : null
    const dagenFormatted = regime.dagen ? regime.dagen.join(', ') : null

    return {
      ...regime,
      tijdstip,
      dagenFormatted,
    }
  })

  return { ...result, regimes }
}
