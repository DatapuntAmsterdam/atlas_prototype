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
import React, { FunctionComponent, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import removeMd from 'remove-markdown'
import styled from 'styled-components'
import { DcatTemporal, getDatasetById } from '../../../api/dcatd/datasets'
import { getUserScopes } from '../../../shared/ducks/user/user'
import getDatasetFilters from '../../../shared/services/datasets-filters/datasets-filters'
import formatDate from '../../../shared/services/date-formatter/date-formatter'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DefinitionList, { DefinitionListItem } from '../../components/DefinitionList'
import ShareBar from '../../components/ShareBar/ShareBar'
import usePromise from '../../utils/usePromise'

function kebabCase(input: string) {
  return input.toLowerCase().replace(/[: ][ ]*/g, '-')
}

// TODO: Refactor this method
const optionLabel = (input: string, list: { id: string; label: string }[], namespace?: string) => {
  // returns the label of an option from an option list
  // the list array elements contain at least the id and label properties
  const prefix = typeof namespace !== 'undefined' ? `${namespace}:` : ''
  const index = list && list.findIndex((item) => prefix + item.id === input)
  return index > -1 ? list[index].label : input
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

  // TODO: Handle loading and error states.

  if (datasetResult.status !== 'fulfilled' || datasetFiltersResult.status !== 'fulfilled') {
    return null
  }

  const { value: dataset } = datasetResult
  const { value: catalogFilters } = datasetFiltersResult

  return (
    <div className="qa-detail">
      <Helmet>
        {/* TODO: Add the proper href. */}
        <link rel="canonical" href="" />
        {dataset['dct:description'] && (
          <meta name="description" content={dataset['dct:description']} />
        )}
      </Helmet>
      <ContentContainer>
        <Container>
          <Row>
            <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
              <Content className="dataset-detail">
                <div className="o-header">
                  <h3 className="o-header__subtitle">
                    <span>Dataset</span>
                    {dataset.canEditDataset && (
                      <div className="o-header__buttongroup">
                        {/* TODO: Turn this into a link */}
                        <Button
                          type="button"
                          className="dcatd-button--edit"
                          onClick={() => redirectToDcatd(dataset.editDatasetId)}
                        >
                          Wijzigen
                          <span className="u-sr-only">Wijzigen</span>
                        </Button>
                      </div>
                    )}
                  </h3>
                  <h2 className="o-header__title u-margin__bottom--3 ">{dataset['dct:title']}</h2>
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

                <h3 className="o-header__subtitle">Resources</h3>

                <div className="resources">
                  {dataset.resources.map((resourceType: any) => (
                    <div className="resources-type" key={resourceType.type}>
                      <div className="resources-type__header">
                        <h4 className="resources-type__header-title">
                          {optionLabel(resourceType.type, catalogFilters.resourceTypes)}
                        </h4>
                      </div>
                      {resourceType.rows.map((resource: any) => (
                        <div className="resources-type__content" key={resource['dc:identifier']}>
                          <div className="resources-type__content-item">
                            <a
                              className="resources-item"
                              href={resource['ams:purl']}
                              rel="noreferrer"
                              target="_blank"
                              onClick={() => {
                                trackEvent({
                                  category: 'Download',
                                  action: dataset['dct:title'],
                                  name: resource['ams:purl'],
                                })
                              }}
                            >
                              <div className="resources-item__left">
                                <div className="resources-item__title">{resource['dct:title']}</div>

                                <div className="resources-item__description">
                                  {resource['ams:distributionType'] === 'file' && (
                                    <span
                                      className={`c-data-selection-file-type
                                                 c-data-selection-file-type__name
                                                 c-data-selection-file-type__format-${kebabCase(
                                                   optionLabel(
                                                     resource['dcat:mediaType'],
                                                     catalogFilters.formatTypes,
                                                   ),
                                                 )}`}
                                    >
                                      {optionLabel(
                                        resource['dcat:mediaType'],
                                        catalogFilters.formatTypes,
                                      )}
                                    </span>
                                  )}
                                  {resource['ams:distributionType'] === 'api' && (
                                    <span
                                      className={`c-data-selection-file-type
                                                 c-data-selection-file-type__name
                                                 c-data-selection-file-type__format-${kebabCase(
                                                   optionLabel(
                                                     resource['ams:serviceType'],
                                                     catalogFilters.serviceTypes,
                                                   ),
                                                 )}`}
                                    >
                                      {optionLabel(
                                        resource['ams:serviceType'],
                                        catalogFilters.serviceTypes,
                                      )}
                                    </span>
                                  )}
                                  {resource['ams:distributionType'] === 'web' && (
                                    <span
                                      className={`c-data-selection-file-type
                                                 c-data-selection-file-type__name
                                                 c-data-selection-file-type__format-${optionLabel(
                                                   resource['ams:distributionType'],
                                                   catalogFilters.distributionTypes,
                                                 )}`}
                                    >
                                      {optionLabel(
                                        resource['ams:distributionType'],
                                        catalogFilters.distributionTypes,
                                      )}
                                    </span>
                                  )}
                                  <div>
                                    {resource['dct:description']
                                      ? removeMd(resource['dct:description'])
                                      : resource['ams:purl']}
                                  </div>
                                </div>
                              </div>
                              <div className="resources-item__right">
                                <div className="resources-item__modified">
                                  {resource['dct:modified'] && (
                                    <span>gewijzigd op {formatDate(resource['dct:modified'])}</span>
                                  )}
                                </div>
                                <div className="resources-item__navigation">
                                  {resource['dcat:byteSize'] > 0 && (
                                    <div className="resources-item__navigation-file-size">
                                      {getFileSize(resource['dcat:byteSize'])}
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
                  <h3 className="o-header__subtitle">Details</h3>

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
                      {formatDate(dataset['foaf:isPrimaryTopicOf']['dct:issued'])}
                    </DefinitionListItem>
                    {dataset['ams:sort_modified'] && (
                      <DefinitionListItem term="Wijzigingsdatum">
                        {formatDate(dataset['ams:sort_modified'])}
                      </DefinitionListItem>
                    )}
                    {dataset['dct:accrualPeriodicity'] && (
                      <DefinitionListItem term="Wijzigingsfrequentie">
                        {optionLabel(
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
                        {optionLabel(dataset['ams:spatialUnit'], catalogFilters.spatialUnits)}
                      </DefinitionListItem>
                    )}
                    {dataset['overheid:grondslag'] && (
                      <DefinitionListItem term="Juridische grondslag">
                        <StyledCustomHTMLBlock body={dataset['overheid:grondslag']} />
                      </DefinitionListItem>
                    )}
                    {dataset['dct:language'] && (
                      <DefinitionListItem term="Taal">
                        {optionLabel(dataset['dct:language'], catalogFilters.languages)}
                      </DefinitionListItem>
                    )}
                    <DefinitionListItem term="Eigenaar">
                      {optionLabel(dataset['ams:owner'], catalogFilters.ownerTypes)}
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
                  <h3 className="o-header__subtitle">Thema&apos;s</h3>

                  <div className="catalog-themes">
                    {dataset['dcat:theme'].map((group: string) => (
                      <div className="catalog-theme" key={group}>
                        <span className="catalog-theme__detail-icon--{{group.substring(6)}} catalog-theme__label">
                          {optionLabel(group.split(':')[1], catalogFilters.groupTypes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="c-detail__block u-padding__bottom--1">
                  <h3 className="o-header__subtitle">Tags</h3>
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
                  <h3 className="o-header__subtitle">Licentie</h3>
                  {dataset['ams:license'] && (
                    <div>{optionLabel(dataset['ams:license'], catalogFilters.licenseTypes)}</div>
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
