import {
  Alert,
  breakpoint,
  Button,
  Column,
  Container,
  CustomHTMLBlock,
  Link,
  Row,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import React, { FunctionComponent, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { DcatTemporal, getDatasetById } from '../../../api/dcatd/datasets'
import { getUserScopes } from '../../../shared/ducks/user/user'
import { dcatdScopes } from '../../../shared/services/auth/auth'
import getDatasetFilters, {
  DatasetFilterOption,
} from '../../../shared/services/datasets-filters/datasets-filters'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DefinitionList, { DefinitionListItem } from '../../components/DefinitionList'
import ShareBar from '../../components/ShareBar/ShareBar'
import formatDate from '../../utils/formatDate'
import redirectToDcatd from '../../utils/redirectToDcatd'
import usePromise from '../../utils/usePromise'

function kebabCase(input: string) {
  return input.toLowerCase().replace(/[: ][ ]*/g, '-')
}

/**
 * Gets the label by the identifier of the specified options, if no option could be found it will default to the id.
 *
 * @param id The identifier of the option to match.
 * @param options The options to get the label from.
 */
function getOptionLabel(id: string, options: DatasetFilterOption[]) {
  return options.find((item) => item.id === id)?.label ?? id
}

function getFileSize(bytes: number) {
  const precision = 1 // single decimal
  const base = 1024
  const log1024 = Math.log(base)
  const cutOff = 0.1 * 1024 * 1024 // 0.1 MB
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB'] // bytes and KB units not used
  const smallestUnit = 2 // index of units, === 'MB'
  const largestUnit = units.length - 1 // index of units, === 'TB'

  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(bytes)) {
    return '-'
  }

  if (bytes < cutOff) {
    return '< 0,1 MB'
  }

  let power = Math.floor(Math.log(bytes) / log1024)

  // Use MB as smallest unit
  // e.g.: Change 200 KB to 0.2 MB
  power = Math.max(power, smallestUnit)

  // Do not exceed highest unit
  power = Math.min(power, largestUnit)

  const number = (bytes / base ** power).toFixed(precision)
  return `${number.toLocaleString()} ${units[power]}`
}

function getTimePeriodLabel(period: DcatTemporal) {
  const startDate = period['time:hasBeginning'] ? new Date(period['time:hasBeginning']) : null
  const endDate = period['time:hasEnd'] ? new Date(period['time:hasEnd']) : null

  if (startDate && endDate) {
    return `${formatDate(startDate)} tot ${formatDate(endDate)}`
  }

  if (startDate) {
    return `Vanaf ${formatDate(startDate)}`
  }

  if (endDate) {
    return `Tot ${formatDate(endDate)}`
  }

  return null
}

// TODO: remove when Typography is aligned https://github.com/Amsterdam/amsterdam-styled-components/issues/727
const StyledCustomHTMLBlock = styled(CustomHTMLBlock)`
  & * {
    @media screen and ${breakpoint('min-width', 'laptop')} {
      font-size: 16px !important;
      line-height: 22px !important;
    }
  }
`

const Content = styled.div`
  width: 100%;
`

interface DatasetDetailPageParams {
  id: string
  slug: string
}

const DatasetDetailPage: FunctionComponent = () => {
  const { trackEvent } = useMatomo()
  const { id } = useParams<DatasetDetailPageParams>()
  const datasetResult = usePromise(useMemo(() => getDatasetById(id), [id]))
  const datasetFiltersResult = usePromise(useMemo(() => getDatasetFilters(), []))
  const userScopes = useSelector(getUserScopes)
  const canEdit = useMemo(() => userScopes.some((scope) => dcatdScopes.includes(scope)), [
    userScopes,
  ])

  const resources = useMemo(() => {
    if (datasetResult.status !== 'fulfilled' || datasetFiltersResult.status !== 'fulfilled') {
      return []
    }

    const { value: dataset } = datasetResult
    const { value: catalogFilters } = datasetFiltersResult

    return catalogFilters.resourceTypes
      .map((resourceType) => ({
        type: resourceType.id,
        rows: dataset['dcat:distribution'].filter(
          (row) => row['ams:resourceType'] === resourceType.id,
        ),
      }))
      .filter((resource) => resource.rows.length > 0)
  }, [datasetResult, datasetFiltersResult])

  if (datasetResult.status !== 'fulfilled' || datasetFiltersResult.status !== 'fulfilled') {
    return null
  }

  const { value: dataset } = datasetResult
  const { value: catalogFilters } = datasetFiltersResult
  const datasetId = dataset['dct:identifier']

  return (
    <div className="qa-detail">
      <Helmet>
        <meta name="description" content={dataset['dct:description']} />
      </Helmet>
      <ContentContainer>
        <Container>
          <Row>
            <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
              <Content className="dataset-detail">
                <div className="o-header">
                  <h1 className="o-header__title u-margin__top--0 u-margin__bottom--1">
                    {dataset['dct:title']}
                  </h1>
                  <h2 className="o-header__subtitle u-margin__bottom--2">
                    <span>Dataset</span>
                    {canEdit && datasetId && (
                      <div className="o-header__buttongroup">
                        <Button
                          type="button"
                          className="dcatd-button--edit"
                          onClick={() => redirectToDcatd(datasetId)}
                        >
                          Wijzigen
                          <span className="u-sr-only">Wijzigen</span>
                        </Button>
                      </div>
                    )}
                  </h2>
                </div>
                <StyledCustomHTMLBlock body={dataset['dct:description']} />

                <div>
                  {['gepland', 'in_onderzoek', 'niet_beschikbaar'].includes(
                    dataset['ams:status'],
                  ) && (
                    <Alert>
                      {dataset['ams:status'] === 'gepland' && 'Deze dataset is gepland.'}
                      {dataset['ams:status'] === 'in_onderzoek' &&
                        'De correctheid van deze dataset wordt momenteel onderzocht.'}
                      {dataset['ams:status'] === 'niet_beschikbaar' &&
                        'Deze dataset is momenteel niet beschikbaar'}
                    </Alert>
                  )}
                </div>

                <h2 className="o-header__subtitle">Resources</h2>

                <div className="resources">
                  {resources.map((resource) => (
                    <div className="resources-type" key={resource.type}>
                      <div className="resources-type__header">
                        <h3 className="resources-type__header-title">
                          {getOptionLabel(resource.type, catalogFilters.resourceTypes)}
                        </h3>
                      </div>
                      {resource.rows.map((row) => (
                        <div className="resources-type__content" key={row['dc:identifier']}>
                          <div className="resources-type__content-item">
                            <a
                              className="resources-item"
                              href={row['ams:purl']}
                              rel="noreferrer"
                              target="_blank"
                              onClick={() => {
                                trackEvent({
                                  category: 'Download',
                                  action: dataset['dct:title'],
                                  name: row['ams:purl'],
                                })
                              }}
                            >
                              <div className="resources-item__left">
                                <div className="resources-item__title">{row['dct:title']}</div>

                                <div className="resources-item__description">
                                  {row['ams:distributionType'] === 'file' &&
                                    row['dcat:mediaType'] && (
                                      <span
                                        className={classNames(
                                          'c-data-selection-file-type',
                                          'c-data-selection-file-type__name',
                                          `c-data-selection-file-type__format-${kebabCase(
                                            getOptionLabel(
                                              row['dcat:mediaType'],
                                              catalogFilters.formatTypes,
                                            ),
                                          )}`,
                                        )}
                                      >
                                        {getOptionLabel(
                                          row['dcat:mediaType'],
                                          catalogFilters.formatTypes,
                                        )}
                                      </span>
                                    )}
                                  {row['ams:distributionType'] === 'api' && (
                                    <span
                                      className={classNames(
                                        'c-data-selection-file-type',
                                        'c-data-selection-file-type__name',
                                        `c-data-selection-file-type__format-${kebabCase(
                                          getOptionLabel(
                                            row['dcat:serviceType'],
                                            catalogFilters.serviceTypes,
                                          ),
                                        )}`,
                                      )}
                                    >
                                      {getOptionLabel(
                                        row['ams:serviceType'],
                                        catalogFilters.serviceTypes,
                                      )}
                                    </span>
                                  )}
                                  {row['ams:distributionType'] === 'web' && (
                                    <span
                                      className={classNames(
                                        'c-data-selection-file-type',
                                        'c-data-selection-file-type__name',
                                        `c-data-selection-file-type__format-${kebabCase(
                                          getOptionLabel(
                                            row['dcat:distributionType'],
                                            catalogFilters.distributionTypes,
                                          ),
                                        )}`,
                                      )}
                                    >
                                      {getOptionLabel(
                                        row['ams:distributionType'],
                                        catalogFilters.distributionTypes,
                                      )}
                                    </span>
                                  )}
                                  <div>{row['dct:description']}</div>
                                </div>
                              </div>
                              <div className="resources-item__right">
                                <div className="resources-item__modified">
                                  {row['dct:modified'] && (
                                    <span>
                                      gewijzigd op {formatDate(new Date(row['dct:modified']))}
                                    </span>
                                  )}
                                </div>
                                <div className="resources-item__navigation">
                                  {row['dcat:byteSize'] && row['dcat:byteSize'] > 0 && (
                                    <div className="resources-item__navigation-file-size">
                                      {getFileSize(row['dcat:byteSize'])}
                                    </div>
                                  )}
                                  <div className="resources-item__navigation-arrow" />
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="o-header__subtitle">Details</h2>

                  <DefinitionList>
                    <DefinitionListItem term="Doel">
                      <StyledCustomHTMLBlock body={dataset['overheid:doel']} />
                    </DefinitionListItem>
                    {dataset['dcat:landingPage'] && (
                      <DefinitionListItem term="Meer informatie">
                        <Link
                          href={dataset['dcat:landingPage']}
                          title={dataset['dcat:landingPage']}
                        >
                          {dataset['dcat:landingPage']}
                        </Link>
                      </DefinitionListItem>
                    )}
                    <DefinitionListItem term="Publicatiedatum">
                      {formatDate(new Date(dataset['foaf:isPrimaryTopicOf']['dct:issued']))}
                    </DefinitionListItem>
                    {dataset['ams:sort_modified'] && (
                      <DefinitionListItem term="Wijzigingsdatum">
                        {formatDate(new Date(dataset['ams:sort_modified']))}
                      </DefinitionListItem>
                    )}
                    {dataset['dct:accrualPeriodicity'] && (
                      <DefinitionListItem term="Wijzigingsfrequentie">
                        {getOptionLabel(
                          dataset['dct:accrualPeriodicity'],
                          catalogFilters.accrualPeriodicities,
                        )}
                      </DefinitionListItem>
                    )}
                    {dataset['dct:temporal'] && (
                      <DefinitionListItem term="Tijdsperiode">
                        {getTimePeriodLabel(dataset['dct:temporal'])}
                      </DefinitionListItem>
                    )}
                    {dataset['ams:spatialDescription'] && (
                      <DefinitionListItem term="Omschrijving gebied">
                        {dataset['ams:spatialDescription']}
                      </DefinitionListItem>
                    )}
                    {dataset['dct:spatial'] && (
                      <DefinitionListItem term="Coördinaten gebied">
                        {dataset['dct:spatial']}
                      </DefinitionListItem>
                    )}
                    {dataset['ams:spatialUnit'] && (
                      <DefinitionListItem term="Gebiedseenheid">
                        {getOptionLabel(dataset['ams:spatialUnit'], catalogFilters.spatialUnits)}
                      </DefinitionListItem>
                    )}
                    {dataset['overheid:grondslag'] && (
                      <DefinitionListItem term="Juridische grondslag">
                        <StyledCustomHTMLBlock body={dataset['overheid:grondslag']} />
                      </DefinitionListItem>
                    )}
                    {dataset['dct:language'] && (
                      <DefinitionListItem term="Taal">
                        {getOptionLabel(dataset['dct:language'], catalogFilters.languages)}
                      </DefinitionListItem>
                    )}
                    <DefinitionListItem term="Eigenaar">
                      {getOptionLabel(dataset['ams:owner'], catalogFilters.ownerTypes)}
                    </DefinitionListItem>
                    <DefinitionListItem term="Inhoudelijk contactpersoon">
                      {dataset['dcat:contactPoint']['vcard:hasEmail'] && (
                        <Link
                          inList
                          title={dataset['dcat:contactPoint']['vcard:fn']}
                          href={`mailto:${dataset['dcat:contactPoint']['vcard:hasEmail']}`}
                        >
                          {dataset['dcat:contactPoint']['vcard:fn']} (
                          {dataset['dcat:contactPoint']['vcard:hasEmail']})
                        </Link>
                      )}
                      {!dataset['dcat:contactPoint']['vcard:hasEmail'] &&
                        dataset['dcat:contactPoint']['vcard:fn'] && (
                          <span>{dataset['dcat:contactPoint']['vcard:fn']}</span>
                        )}
                      {dataset['dcat:contactPoint']['vcard:hasURL'] && (
                        <Link
                          inList
                          href={dataset['dcat:contactPoint']['vcard:hasURL']}
                          title={dataset['dcat:contactPoint']['vcard:hasURL']}
                        >
                          {dataset['dcat:contactPoint']['vcard:hasURL']}
                        </Link>
                      )}
                    </DefinitionListItem>
                    <DefinitionListItem term="Technisch contactpersoon">
                      {dataset['dct:publisher']['foaf:mbox'] && (
                        <Link
                          inList
                          href={`mailto:${dataset['dct:publisher']['foaf:mbox']}`}
                          title={dataset['dct:publisher']['foaf:name']}
                        >
                          {dataset['dct:publisher']['foaf:name']} (
                          {dataset['dct:publisher']['foaf:mbox']})
                        </Link>
                      )}
                      {!dataset['dct:publisher']['foaf:mbox'] &&
                        dataset['dct:publisher']['foaf:name'] && (
                          <span>{dataset['dct:publisher']['foaf:name']}</span>
                        )}
                      {dataset['dct:publisher']['foaf:homepage'] && (
                        <Link
                          inList
                          href={dataset['dct:publisher']['foaf:homepage']}
                          title={dataset['dct:publisher']['foaf:homepage']}
                        >
                          {dataset['dct:publisher']['foaf:homepage']}
                        </Link>
                      )}
                    </DefinitionListItem>
                  </DefinitionList>
                </div>

                <div className="c-detail__block u-padding__bottom--1 u-margin__top--3">
                  <h2 className="o-header__subtitle">Thema&apos;s</h2>
                  <div className="catalog-themes">
                    {dataset['dcat:theme'].map((group: string) => (
                      <div className="catalog-theme" key={group}>
                        <span className="catalog-theme__detail-icon--{{group.substring(6)}} catalog-theme__label">
                          {getOptionLabel(group.split(':')[1], catalogFilters.groupTypes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="c-detail__block u-padding__bottom--1">
                  <h2 className="o-header__subtitle">Tags</h2>
                  <ul>
                    {dataset['dcat:keyword'].map((tag: string) => (
                      <li className="u-inline" key={tag}>
                        <div className="dataset-tag">
                          <i className="dataset-tag__arrow" />
                          <span className="dataset-tag__label">{tag}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="c-detail__block u-padding__bottom--1">
                  <h2 className="o-header__subtitle">Licentie</h2>
                  {dataset['ams:license'] && (
                    <div>{getOptionLabel(dataset['ams:license'], catalogFilters.licenseTypes)}</div>
                  )}
                </div>
              </Content>
            </Column>
            <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
              <ShareBar />
            </Column>
          </Row>
        </Container>
      </ContentContainer>
    </div>
  )
}

export default DatasetDetailPage
