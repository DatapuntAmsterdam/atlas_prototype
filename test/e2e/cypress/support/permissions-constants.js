import { routing } from '../../../../src/app/routes'
import PARAMETERS from '../../../../src/store/parameters'

const { VIEW, VIEW_CENTER, LEGEND, ZOOM, LOCATION } = PARAMETERS

const urls = {
  address: `${routing.data.path}bag/verblijfsobject/id0363010000749400?${LEGEND}=false&${ZOOM}=16`,
  business: `${routing.data.path}brk/object/idNL.KAD.OnroerendeZaak.11460666170000?${LEGEND}=false&${ZOOM}=16`,
  gemeentelijkeBeperking: `${routing.data.path}wkpb/beperking/id9230`,
  geoSearch: `${routing.data.path}geozoek?${LOCATION}=52.3736166%2C4.8943521`,
  ligplaats: `${routing.data.path}bag/ligplaats/id0363020000881621`,
  maatschappelijkeActiviteit: `${routing.data.path}handelsregister/maatschappelijkeactiviteit/id01029509`,
  map: `${routing.data.path}?${VIEW_CENTER}=52.3731081%2C4.8932945&${VIEW}=kaart&${LEGEND}=false`,
  monument: `${routing.data.path}monumenten/monumenten/idc115314a-59d4-4574-bfe9-1f7df5cb20c4`,
  monumentComplex: `${routing.data.path}monumenten/complexen/id182a9861-4052-4127-8300-6450cd75b6a5`,
  natuurlijk: `${routing.data.path}brk/subject/idNL.KAD.Persoon.171720901`,
  nietNatuurlijk: `${routing.data.path}brk/subject/idNL.KAD.Persoon.423186718`,
  pand: `${routing.data.path}bag/pand/id0363100012168052`,
  parkeervak: `${routing.data.path}parkeervakken/parkeervakken/id121403487278/`,
  standplaats: `${routing.data.path}bag/standplaats/id0363030000930866`,
  vestiging: `${routing.data.path}handelsregister/vestiging/id000003579875/?modus=gesplitst`,
  vestigingenTabel: `${routing.data.path}hr/vestigingen?${VIEW}=volledig&${LEGEND}=false&${ZOOM}=11`,
}

const values = {
  aantekeningen: 'Aantekeningen',
  bedrijvenInvloedsgebieden: 'Bedrijven - Invloedsgebieden',
  beschrijving: 'Beschrijving',
  documentnaam: 'Documentnaam',
  economieEnHaven: 'Economie en haven',
  geografie: 'Geografie',
  kadastraleSubjecten: 'Kadastrale subjecten',
  legendCafeValue: 'Café',
  legendPermissionNotification: 'Zichtbaar na inloggen',
  ligplaatsVestigingName: 'Caffeine Holding',
  maatschappelijkeActiviteiten: 'Maatschappelijke activiteiten',
  maatschappelijkeActiviteitName: 'om B',
  maatschappelijkeActiviteitVestigingName: 'om B',
  pandVestigingName: 'ller',
  redengevendeOmschrijving: 'Redengevende omschrijving',
  standplaatsVestigingName: 'RH-Infra',
  parkeervakId: '121403487278',
  type: 'Type',
  vestigingName: 'om B',
  vestigingen: 'Vestigingen',
  vestigingenHoreca: 'Vestigingen - Horeca',
  zakelijkeRechten: 'Zakelijke rechten',
}

export { urls, values }
