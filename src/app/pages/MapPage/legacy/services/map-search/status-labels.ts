const subTypesLabels = {
  bominslag: 'inslag',
  buurtcombinatie: 'wijk',
  gebiedsgerichtwerken: 'gebiedsgericht werken',
  gevrijwaardgebied: 'gevrijwaard gebied',
  grootstedelijkgebied: 'grootstedelijk gebied',
  ligplaats: 'ligplaats',
  stadsdeel: 'stadsdeel',
  standplaats: 'standplaats',
  uitgevoerdonderzoek: 'reeds uitgevoerd CE onderzoek',
  verdachtgebied: 'verdacht gebied',
}

export const getStatusLabel = (type: string) => {
  const semgents = type.split('/')
  const segment = semgents[1] ? semgents[1] : semgents[0]
  return subTypesLabels[segment] ? subTypesLabels[segment] : ''
}

export const NORMAL_PAND_STATUSSES = [
  'Bouwvergunning verleend',
  'Pand in gebruik (niet ingemeten)',
  'Pand in gebruik',
  'Verbouwing pand',
  'Bouw gestart',
]

export const NORMAL_VBO_STATUSSES = [
  'Verblijfsobject in gebruik (niet ingemeten)',
  'Verblijfsobject in gebruik',
  'Verbouwing verblijfsobject',
]

const shouldShowStatus = (result: { vbo_status?: string }) =>
  result.vbo_status && !NORMAL_VBO_STATUSSES.includes(result.vbo_status)

export const getStatusLabelAddress = (result: { type_adres?: string; vbo_status: string }) =>
  `${shouldShowStatus(result) ? `${result.vbo_status}` : ''}` +
  `${
    shouldShowStatus(result) && result.type_adres && result.type_adres !== 'Hoofdadres' ? ' ' : ''
  }` +
  `${result.type_adres && result.type_adres !== 'Hoofdadres' ? 'Nevenadres' : ''}`
