import PropTypes from 'prop-types'
import { BezoekAdres, FileType, HandelsNaam, SBIOmschrijving, Tags } from './Templates'
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

const DataSelectionFormatter = ({ variables, formatter, template, useInline }) => {
  let formattedValue
  let component
  let newVariables = variables

  if (formatter && FORMATTER_MAPPER[formatter]) {
    if (variables.length === 1) {
      // Just pass the value (String) when there is only one variable
      formattedValue = FORMATTER_MAPPER[formatter](variables[0].value)
    } else {
      // Pass all variables as an Object if there are more variables
      newVariables = variables.reduce(
        (acc, { key, value }) => ({
          ...acc,
          [key]: value,
        }),
        {},
      )

      formattedValue = FORMATTER_MAPPER[formatter](newVariables)
    }
  } else {
    // If there is no formatter; concatenate all values
    formattedValue = variables.map((variable) => variable.value).join(' ')
  }

  if (template) {
    const Element = TEMPLATE_MAPPER[template]
    component = <Element formattedValue={formattedValue} variables={newVariables} />
  }
  return [
    template && (
      <div key="0" className="qa-table-value">
        {component}
      </div>
    ),

    !template && !useInline && (
      <div key="1" className="qa-table-value">
        {formattedValue}
      </div>
    ),

    !template && useInline && (
      <span key="2" className="qa-table-value">
        {formattedValue}
      </span>
    ),

    // nbsp required for table link to fill entire table cell
    !template && !formattedValue && !useInline && (
      <div key="3" className="qa-table-value">
        &nbsp;
      </div>
    ),
  ]
}

DataSelectionFormatter.defaultProps = {
  formatter: undefined,
  template: undefined,
  useInline: false,
}

DataSelectionFormatter.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object).isRequired,
  formatter: PropTypes.string,
  template: PropTypes.string,
  useInline: PropTypes.bool,
}

export default DataSelectionFormatter
