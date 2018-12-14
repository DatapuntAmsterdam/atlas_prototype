import React from 'react';
import PropTypes from 'prop-types';
import escapeStringRegexp from 'escape-string-regexp';

const AutoSuggestItem = (props) => {
  const { isActive, onSuggestionSelection, query, content } = props;
  const highlightedSuggestion = content.replace(
    new RegExp(`(${escapeStringRegexp(query.trim())})`, 'gi'),
    '<span class="auto-suggest__dropdown__highlight">$1</span>'
  );
  const ellipsis = content === '...';

  const listItem = (
    <div className={`${ellipsis ? 'auto-suggest__dropdown-item--row-height' : ''}`}>
      {!ellipsis ? <span className="icon" /> : ''}
      <span
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: highlightedSuggestion
        }}
      />
    </div>
  );

  return (
    <li>
      <button
        type="button"
        className={`
          auto-suggest__dropdown-item
          auto-suggest__dropdown-item--${isActive ? 'active' : 'inactive'}
        `}
        onClick={onSuggestionSelection}
      >
        {listItem}
      </button>
    </li>
  );
};

AutoSuggestItem.defaultProps = {
  isActive: false
};

AutoSuggestItem.propTypes = {
  content: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onSuggestionSelection: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
};

export default AutoSuggestItem;
