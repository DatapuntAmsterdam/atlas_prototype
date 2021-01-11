import PropTypes from 'prop-types'
import classNames from 'classnames'

const BezoekAdres = ({ variables, formattedValue }) => (
  <div
    className={classNames({
      'c-bezoekadres__non-mailing': variables.non_mailing,
    })}
  >
    {formattedValue}
  </div>
)

BezoekAdres.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object).isRequired,
  formattedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
}

const FileType = ({ formattedValue }) => (
  <div>
    {formattedValue.map((fileType) => (
      <div className="c-data-selection-file-type">
        <span
          className={`c-data-selection-file-type__name c-data-selection-file-type__format-${fileType.name.toLowerCase()}`}
        >
          {fileType.name ? <span>{fileType.name}</span> : <span>?</span>}
        </span>
        <span className="c-data-selection-file-type__x">x</span>
        <span className="c-data-selection-file-type__count">{fileType.count}</span>
      </div>
    ))}
  </div>
)

FileType.propTypes = {
  formattedValue: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const HandelsNaam = ({ variables }) => (
  <span
    title="{{vm.variables[1].value}}"
    className={`c-handelsnaam ${
      variables[1] && variables[1].value ? 'c-handelsnaam__failliet' : ''
    }`}
  >
    {variables[0].value}
  </span>
)

HandelsNaam.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const SBIOmschrijving = ({ variables }) => (
  <span className="c-sbi-omschrijving">{variables[0] && variables[0].value}</span>
)

SBIOmschrijving.propTypes = {
  variables: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const Tags = ({ formattedValue }) => (
  <div>
    {formattedValue.map((tag) => (
      <div className="u-inline">
        <span className="o-tag o-tag--small">{tag.name}</span>
      </div>
    ))}
  </div>
)

Tags.propTypes = {
  formattedValue: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export { SBIOmschrijving, BezoekAdres, FileType, HandelsNaam, Tags }
