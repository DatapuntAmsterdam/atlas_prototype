import React from 'react'
import classNames from 'classnames'
import RouterLink from 'redux-first-router-link'
import {
  preserveQuery,
  toDatasets,
  toDatasetsWithFilter,
} from '../../../store/redux-first-router/actions'
import PARAMETERS from '../../../store/parameters'
import HomepageBlock from '../block/HomepageBlock'
import './HomepageDatasetsThemesBlock.scss'

const HomepageDatasetsThemesBlock = () => {
  const CATALOGUS_THEMES_CONFIG = [
    {
      name: 'Verkeer en infrastructuur',
      slug: 'verkeer-infrastructuur',
      icon: 'parkeren-beheer',
    },
    {
      name: 'Toerisme en cultuur',
      slug: 'toerisme-cultuur',
      icon: 'toerisme',
    },
    {
      name: 'Geografie',
      slug: 'geografie',
      icon: 'kaart',
    },
    {
      name: 'Bevolking',
      slug: 'bevolking',
      icon: 'bevolking',
    },
    {
      name: 'Openbare ruimte en groen',
      slug: 'openbare-ruimte-groen',
      icon: 'openbare-ruimte',
    },
    {
      name: 'Stedelijke ontwikkeling',
      slug: 'stedelijke-ontwikkeling',
      icon: 'stedelijke-ontwikkeling',
    },
    {
      name: 'Zorg en welzijn',
      slug: 'zorg-welzijn',
      icon: 'gezondheid-zorg-welzijn',
    },
    {
      name: 'Energie',
      slug: 'energie',
      icon: 'energie',
    },
  ]

  const columnTwo = [...CATALOGUS_THEMES_CONFIG]
  const columnOne = columnTwo.splice(0, Math.ceil(CATALOGUS_THEMES_CONFIG.length / 2))

  const columns = [{ id: 0, themes: columnOne }, { id: 1, themes: columnTwo }]

  return (
    <HomepageBlock
      classes="c-homepage__block--left c-homepage__block--datasets"
      linkAction={toDatasets()}
      title="Datasetcatalogus"
      description="Blader door datasets (verzamelingen gegevens)"
      blockIsLink={false}
    >
      <div className="c-catalogus-themes">
        <div className="u-grid">
          <div className="u-row">
            {columns.map(column => (
              <div key={column.id} className="u-col-sm--6">
                <div
                  className={`c-catalogus-themes__column ${classNames({
                    'c-catalogus-themes__column--left': column.id === 0,
                    'c-catalogus-themes__column--right': column.id === 1,
                  })}`}
                >
                  <ul>
                    {column.themes.map(theme => (
                      <li key={theme.slug}>
                        <RouterLink
                          data-test="themes-block-link"
                          to={preserveQuery(toDatasetsWithFilter(), {
                            [PARAMETERS.FILTERS]: { groups: theme.slug },
                          })}
                          className={`qa-theme-link c-catalogus-themes__link c-catalogus-themes__icon c-catalogus-themes__icon--${theme.icon}`}
                        >
                          <div className="c-catalogus-themes__link__text">{theme.name}</div>
                        </RouterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomepageBlock>
  )
}

export default HomepageDatasetsThemesBlock
