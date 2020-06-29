import React from 'react'
import escapeStringRegexp from 'escape-string-regexp'

type AutoSuggestItemProps = {
  content: string
  isActive?: boolean
  onSuggestionSelection: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  query: string
}

const AutoSuggestItem: React.FC<AutoSuggestItemProps> = ({
  isActive = false,
  onSuggestionSelection,
  query,
  content,
}) => {
  const highlightedSuggestion =
    content &&
    content.replace(
      new RegExp(`(${escapeStringRegexp(query.trim())})`, 'gi'),
      '<span class="auto-suggest__dropdown__highlight">$1</span>',
    )
  const ellipsis = content === '...'

  const listItem = (
    <div className={`${ellipsis ? 'auto-suggest__dropdown-item--row-height' : ''}`}>
      {!ellipsis ? <span className="icon" /> : ''}
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: highlightedSuggestion,
        }}
      />
    </div>
  )

  return (
    <li>
      <button
        type="button"
        className={`
          // TODO: get rid of SCSSS here
          auto-suggest__dropdown-item
          auto-suggest__dropdown-item--${isActive ? 'active' : 'inactive'}
        `}
        onClick={onSuggestionSelection}
      >
        {listItem}
      </button>
    </li>
  )
}

export default AutoSuggestItem
