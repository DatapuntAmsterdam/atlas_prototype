import { Single as Woonplaatsen } from './types'
import GLOSSARY from '../../../../detail/services/glossary.constant'
import {
  getMainMetaBlock,
  getPaginatedListBlock,
  ServiceDefinition,
} from '../../../../map/services/map-services.config'
import { path } from './index'
import { List as OpenbareRuimtesList } from '../openbareruimtes'

const { WOONPLAATS } = GLOSSARY.DEFINITIONS

const woonplaatsConfig: ServiceDefinition = {
  type: 'bag/woonplaats',
  endpoint: path,
  mapDetail: (result) => {
    const typedResult = (result as unknown) as Woonplaatsen
    return {
      title: WOONPLAATS.singular,
      subTitle: typedResult.naam,
      noPanorama: true,
      infoBox: getMainMetaBlock<Woonplaatsen>(typedResult, WOONPLAATS),
      items: [
        typedResult.openbareruimtes
          ? getPaginatedListBlock(
              WOONPLAATS,
              `${typedResult.openbareruimtes.href}&_sort=naam&eindGeldigheid[isnull]=true`,
              {
                pageSize: 25,
                normalize: (data) => {
                  const typedData = (data as unknown) as OpenbareRuimtesList['_embedded']
                  return typedData.openbareruimtes.map(({ _links, naam, id }) => ({
                    _display: naam,
                    _links,
                    id,
                  }))
                },
              },
            )
          : undefined,
      ],
    }
  },
}

export default woonplaatsConfig
