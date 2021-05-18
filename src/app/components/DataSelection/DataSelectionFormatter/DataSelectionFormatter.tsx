import type { FunctionComponent } from 'react'
import {
  aggregateFilter,
  alignRightFilter,
  bagAddressFilter,
  dateFilter,
  hrBezoekAdresFilter,
  modificationDateFilter,
  nevenadresFilter,
  nummerAanduidingTypeFilter,
  truncateHtmlAsTextFilter,
  zipCodeFilter,
} from '../../Filters/Filters'
import type { DataBodyContent } from '../types'
import { BezoekAdres, FileType, HandelsNaam, SBIOmschrijving, Tags } from './Templates'

const TEMPLATE_MAPPER = {
  bezoekadres: BezoekAdres,
  'file-type': FileType,
  handelsnaam: HandelsNaam,
  'sbi-omschrijving': SBIOmschrijving,
  tags: Tags,
}

const FORMATTER_MAPPER = {
  aggregate: aggregateFilter,
  'align-right': alignRightFilter,
  'bag-address': bagAddressFilter,
  bagAddress: bagAddressFilter,
  date: dateFilter,
  'hr-bezoekadres': hrBezoekAdresFilter,
  hrBezoekadres: hrBezoekAdresFilter,
  'modification-date': modificationDateFilter,
  nevenadres: nevenadresFilter,
  'nummeraanduiding-type': nummerAanduidingTypeFilter,
  nummeraanduidingType: nummerAanduidingTypeFilter,
  'truncate-html-as-text': truncateHtmlAsTextFilter,
  zipcode: zipCodeFilter,
}

export type TemplateType = keyof typeof TEMPLATE_MAPPER
export type FormatterType = keyof typeof TEMPLATE_MAPPER

function convertVariables(variables: DataBodyContent[]) {
  if (variables.length === 1) {
    return variables
  }

  return Object.fromEntries(variables.map(({ key, value }) => [key, value]))
}

function formatValue(variables: DataBodyContent[], formatter: FormatterType | null) {
  const formatterFn = formatter ? FORMATTER_MAPPER[formatter] : null

  // If there is no formatter then concatenate all values.
  if (!formatterFn) {
    return variables.map((variable) => variable.value).join(' ')
  }

  // Pass the value directly there is only one variable.
  if (variables.length === 1) {
    return formatterFn(variables[0].value)
  }

  // Pass all variables as an object if there are more variables.
  return formatterFn(convertVariables(variables))
}

export interface DataSelectionFormatterProps {
  variables: DataBodyContent[]
  formatter?: FormatterType | null
  template?: TemplateType | null
  useInline?: boolean
}

const DataSelectionFormatter: FunctionComponent<DataSelectionFormatterProps> = ({
  variables,
  formatter = null,
  template = null,
  useInline = false,
}) => {
  const ChildComponent = template ? TEMPLATE_MAPPER[template] : null
  const formattedValue = formatValue(variables, formatter)
  const convertedVariables = convertVariables(variables)

  return (
    <>
      {ChildComponent && (
        <div key="0" className="qa-table-value">
          <ChildComponent formattedValue={formattedValue} variables={convertedVariables} />
        </div>
      )}
      {!template && !useInline && (
        <div key="1" className="qa-table-value">
          {formattedValue}
        </div>
      )}
      {!template && useInline && (
        <span key="2" className="qa-table-value">
          {formattedValue}
        </span>
      )}
      {/* nbsp required for table link to fill entire table cell */}
      {!template && !formattedValue && !useInline && (
        <div key="3" className="qa-table-value">
          &nbsp;
        </div>
      )}
    </>
  )
}

export default DataSelectionFormatter
