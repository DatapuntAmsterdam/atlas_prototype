import { DetailResultItemType } from '../../types/details'
import Rating from '../../../../../components/Rating/Rating'
import type { HistorischeOnderzoeken } from '../../../../../../api/ondergrond/historischeonderzoeken'
import { historischeOnderzoekenPath } from '../../../../../../api/ondergrond/historischeonderzoeken'
import type { ServiceDefinition } from '../map-services.config'

const historischeOnderzoeken: ServiceDefinition<HistorischeOnderzoeken> = {
  type: 'ondergrond/historischeonderzoeken',
  endpoint: historischeOnderzoekenPath,
  mapDetail: (result) => {
    return {
      title: 'Historische Onderzoeken',
      subTitle: result.naamRapport,
      items: [
        {
          type: DetailResultItemType.DefinitionList,
          entries: [
            {
              term: 'ID',
              description: result.id.toString(),
            },
            {
              term: 'Rapport',
              description: result.naamRapport,
              href: result.permalink,
              external: true,
            },
            {
              term: 'Datum rapport',
              description: result.datumRapport,
            },
            {
              term: 'Nummer rapport',
              description: result.nummerRapport,
            },
            {
              term: 'Beschrijving',
              description: result.beschrijving,
            },
            {
              term: 'Opdrachtgever',
              description: result.opdrachtgever,
            },
            {
              term: 'Opdrachtnemer',
              description: result.opdrachtnemer,
            },
            {
              term: 'Type onderzoek',
              description: result.typeOnderzoek,
            },
            {
              term: 'Locatie of adres',
              description: result.locatieOfAdres,
            },
            {
              term: 'Kwaliteit',
              CustomComponent: () => {
                const nrOfPlusses = result.indicatieKwaliteit?.split('+').length
                const defaultValue = nrOfPlusses && nrOfPlusses > 0 ? nrOfPlusses - 1 : 0
                return <Rating max={3} defaultValue={defaultValue} />
              },
            },
          ],
        },
      ],
    }
  },
}

export default historischeOnderzoeken
