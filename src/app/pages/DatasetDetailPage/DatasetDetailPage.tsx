import { ChevronRight, DocumentEdit } from '@amsterdam/asc-assets'
import {
  Alert,
  breakpoint,
  Button,
  Column,
  Container,
  CustomHTMLBlock,
  Icon,
  Link,
  Row,
} from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import marked from 'marked'
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import type { DcatTemporal } from '../../../api/dcatd/datasets'
import getDatasetData from '../../../api/dcatd/datasets/getDatasetData'
import { NotFoundError } from '../../../shared/services/api/customError'
import { dcatdScopes, getScopes } from '../../../shared/services/auth/auth'
import type { DatasetFilterOption } from '../../../shared/services/datasets-filters/datasets-filters'
import ContentContainer from '../../components/ContentContainer/ContentContainer'
import DefinitionList, { DefinitionListItem } from '../../components/DefinitionList'
import PromiseResult from '../../components/PromiseResult/PromiseResult'
import ShareBar from '../../components/ShareBar/ShareBar'
import { toNotFound } from '../../links'
import formatDate from '../../utils/formatDate'
import redirectToDcatd from '../../utils/redirectToDcatd'

function kebabCase(input?: string): string {
  return input?.toLowerCase().replace(/[: ][ ]*/g, '-') ?? ''
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

interface MarkdownProps {
  children: string
}

const Markdown: FunctionComponent<MarkdownProps> = ({ children }) => {
  const formattedContent = useMemo(() => marked(children), [children])

  return <StyledCustomHTMLBlock body={formattedContent} />
}

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
  const userScopes = getScopes()
  const history = useHistory()
  const canEdit = useMemo(
    () => userScopes.some((scope) => dcatdScopes.includes(scope)),
    [userScopes],
  )

  const onError = (e: Error) => {
    if (e instanceof NotFoundError && e.code === 404) {
      history.push(toNotFound())
    }
  }

  return (
    <ContentContainer className="qa-detail">
      <Container>
        <Row>
          <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
            <Content className="dataset-detail">
              <PromiseResult factory={() => getDatasetData(id)} deps={[id]} onError={onError}>
                {({ value: { resources, dataset, filters } }) => (
                  <>
                    <Helmet>
                      <meta name="description" content={dataset['dct:description']} />
                    </Helmet>
                    <div className="o-header">
                      <h1 className="o-header__title u-margin__top--0 u-margin__bottom--1">
                        {dataset['dct:title']}
                      </h1>
                      <h2 className="o-header__subtitle u-margin__bottom--2">
                        <span>Dataset</span>
                        {canEdit && dataset['dct:identifier'] && (
                          <div className="o-header__buttongroup">
                            <Button
                              variant="primaryInverted"
                              type="button"
                              iconLeft={<DocumentEdit />}
                              onClick={() => redirectToDcatd(dataset['dct:identifier'] as string)}
                            >
                              Wijzigen
                            </Button>
                          </div>
                        )}
                      </h2>
                    </div>
                    <Markdown>{dataset['dct:description']}</Markdown>
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
                              {getOptionLabel(resource.type, filters.resourceTypes)}
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
                                                  filters.formatTypes,
                                                ),
                                              )}`,
                                            )}
                                          >
                                            {getOptionLabel(
                                              row['dcat:mediaType'],
                                              filters.formatTypes,
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
                                                filters.serviceTypes,
                                              ),
                                            )}`,
                                          )}
                                        >
                                          {getOptionLabel(
                                            row['ams:serviceType'],
                                            filters.serviceTypes,
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
                                                filters.distributionTypes,
                                              ),
                                            )}`,
                                          )}
                                        >
                                          {getOptionLabel(
                                            row['ams:distributionType'],
                                            filters.distributionTypes,
                                          )}
                                        </span>
                                      )}
                                      <div>{row['dct:description'] ?? row['ams:purl']}</div>
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
                                      {row['dcat:byteSize'] !== undefined &&
                                        row['dcat:byteSize'] > 0 && (
                                          <div className="resources-item__navigation-file-size">
                                            {getFileSize(row['dcat:byteSize'])}
                                          </div>
                                        )}
                                      <div className="resources-item__navigation-arrow">
                                        <Icon size={16}>
                                          <ChevronRight />
                                        </Icon>
                                      </div>
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
                          <Markdown>{dataset['overheidds:doel']}</Markdown>
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
                              filters.accrualPeriodicities,
                            )}
                          </DefinitionListItem>
                        )}
                        {dataset['dct:temporal'] && (
                          <DefinitionListItem term="Tijdsperiode">
                            {getTimePeriodLabel(dataset['dct:temporal'])}
                          </DefinitionListItem>
                        )}
                        {dataset['ams:temporalUnit'] && (
                          <DefinitionListItem term="Tijdseenheid">
                            {getOptionLabel(dataset['ams:temporalUnit'], filters.temporalUnits)}
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
                            {getOptionLabel(dataset['ams:spatialUnit'], filters.spatialUnits)}
                          </DefinitionListItem>
                        )}
                        {dataset['overheid:grondslag'] && (
                          <DefinitionListItem term="Juridische grondslag">
                            <Markdown>{dataset['overheid:grondslag']}</Markdown>
                          </DefinitionListItem>
                        )}
                        {dataset['dct:language'] && (
                          <DefinitionListItem term="Taal">
                            {getOptionLabel(
                              dataset['dct:language'].split(':').pop() ?? '',
                              filters.languages,
                            )}
                          </DefinitionListItem>
                        )}
                        <DefinitionListItem term="Eigenaar">
                          {getOptionLabel(dataset['ams:owner'], filters.ownerTypes)}
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
                            <span
                              className={`catalog-theme__detail-icon--${group.substring(
                                6,
                              )} catalog-theme__label`}
                            >
                              {getOptionLabel(group.split(':')[1], filters.groupTypes)}
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
                        <div>{getOptionLabel(dataset['ams:license'], filters.licenseTypes)}</div>
                      )}
                    </div>
                  </>
                )}
              </PromiseResult>
            </Content>
          </Column>
          <Column span={{ small: 1, medium: 2, big: 6, large: 12, xLarge: 12 }}>
            <ShareBar />
          </Column>
        </Row>
      </Container>
    </ContentContainer>
  )
}

export default DatasetDetailPage
