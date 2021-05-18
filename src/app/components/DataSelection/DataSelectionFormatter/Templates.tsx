import classNames from 'classnames'
import type { FunctionComponent } from 'react'
import type { DataBodyContent } from '../types'

interface FormattedValue {
  name: string
  count?: string
}

interface Props {
  variables: DataBodyContent[] | { [key: string]: string }
  formattedValue: FormattedValue[]
}

const BezoekAdres: FunctionComponent<Props> = ({ variables, formattedValue }) => (
  <div
    className={classNames({
      'c-bezoekadres__non-mailing': !Array.isArray(variables) && variables.non_mailing,
    })}
  >
    {formattedValue}
  </div>
)

const FileType: FunctionComponent<Props> = ({ formattedValue }) => (
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

const HandelsNaam: FunctionComponent<Props> = ({ variables }) => (
  <span className="c-handelsnaam">{!Array.isArray(variables) ? variables?.handelsnaam : ''}</span>
)

const SBIOmschrijving: FunctionComponent<Props> = ({ variables }) => (
  <span className="c-sbi-omschrijving">{variables?.[0]?.value}</span>
)

const Tags: FunctionComponent<Props> = ({ formattedValue }) => (
  <div>
    {formattedValue.map((tag) => (
      <div className="u-inline">
        <span className="o-tag o-tag--small">{tag.name}</span>
      </div>
    ))}
  </div>
)

export { SBIOmschrijving, BezoekAdres, FileType, HandelsNaam, Tags }
