import React from 'react';
import PropTypes from 'prop-types';
import AutoSuggestCategory, { MORE_RESULTS_INDEX } from './AutoSuggestCategory';

import './_auto-suggest.scss';

const getSuggestionByIndex = (searchResults, suggestionIndex) =>
  searchResults
    .reduce((flatResults, category) =>
      [...flatResults, ...category.content], [])
    .find((flatSuggestion) =>
      flatSuggestion.index === suggestionIndex
    );

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.clearQuery = this.clearQuery.bind(this);
    this.navigateSuggestions = this.navigateSuggestions.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onSuggestionSelection = this.onSuggestionSelection.bind(this);
    this.state = {
      originalQuery: '',
      showSuggestions: false
    };
  }

  onBlur() {
    setTimeout(() => {
      this.setState({
        showSuggestions: false
      });
    }, 200);
  }

  onInput(event) {
    const {
      onTextInput,
      activeSuggestion
    } = this.props;

    event.persist();
    if (activeSuggestion.index > -1) {
      this.resetActiveSuggestion();
    }
    onTextInput(event.target.value);

    this.setState({
      showSuggestions: true
    });
  }

  onFocus() {
    const {
      onTextInput,
      suggestions,
      query
    } = this.props;

    if (query.length && !suggestions.length) {
      onTextInput(query);
    }
  }

  onSuggestionSelection(suggestion, event) {
    const {
      onSuggestionSelection
    } = this.props;
    event.preventDefault();
    event.stopPropagation();

    if (suggestion.index === MORE_RESULTS_INDEX) {
      this.resetActiveSuggestion();
      this.onFormSubmit(event);
    } else {
      const shouldOpenInNewWindow = event.ctrlKey || event.metaKey;
      onSuggestionSelection(suggestion, shouldOpenInNewWindow);

      if (!shouldOpenInNewWindow) {
        this.clearQuery();
        this.textInput.blur();
      }
    }
  }

  onFormSubmit(event) {
    const { onSubmit } = this.props;

    event.preventDefault();
    event.stopPropagation();

    this.setState({
      showSuggestions: false
    }, () => {
      this.resetActiveSuggestion();
      onSubmit();
    });
  }

  navigateSuggestions(event) {
    const {
      activeSuggestion,
      numberOfSuggestions,
      onSuggestionActivate,
      suggestions
    } = this.props;

    const { showSuggestions } = this.state;

    switch (event.keyCode) {
      // Arrow up
      case 38:
        // By default the up arrow puts the cursor at the
        // beginning of the input, we don't want that!
        event.preventDefault();
        if (!showSuggestions || !numberOfSuggestions) {
          return;
        }

        onSuggestionActivate(
          getSuggestionByIndex(
            suggestions,
            Math.max(activeSuggestion.index - 1, -1)
          )
        );
        break;
      // Arrow down
      case 40:
        if (!showSuggestions || !numberOfSuggestions) {
          return;
        }
        onSuggestionActivate(
          getSuggestionByIndex(
            suggestions,
            Math.min(activeSuggestion.index + 1, numberOfSuggestions - 1)
          )
        );
        break;
      // Escape
      case 27:
        this.resetActiveSuggestion();
        this.setState({
          showSuggestions: false
        });
        this.textInput.blur();
        break;
      // Enter
      case 13:
        if (activeSuggestion.index > -1) {
          this.onSuggestionSelection(activeSuggestion, event);
        }
        break;
      default:
        break;
    }
  }

  clearQuery() {
    const {
      onTextInput
    } = this.props;

    this.textInput.focus();
    this.resetActiveSuggestion();
    this.setState({
      showSuggestions: false
    });
    onTextInput();
  }

  resetActiveSuggestion() {
    const { onSuggestionActivate } = this.props;

    onSuggestionActivate();
  }

  render() {
    const {
      activeSuggestion,
      highlightQuery,
      legendTitle,
      placeHolder,
      query,
      suggestions
    } = this.props;
    const {
      showSuggestions
    } = this.state;

    return (
      <form
        onSubmit={this.onFormSubmit}
        className={
          `auto-suggest
          ${showSuggestions && suggestions.length ? 'auto-suggest__backdrop' : ''}`
        }
      >
        <fieldset>
          {legendTitle && <legend className="u-sr-only">{legendTitle}</legend>}
          <div className="auto-suggest-container">
            <label htmlFor="auto-suggest__input" className="u-sr-only">zoektekst</label>
            <input
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="auto-suggest__input"
              id="auto-suggest__input"
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onChange={this.onInput}
              onKeyDown={this.navigateSuggestions}
              placeholder={placeHolder}
              ref={(input) => {
                this.textInput = input;
              }}
              spellCheck="false"
              type="text"
              value={query || ''}
              autoFocus="true" // eslint-disable-line jsx-a11y/no-autofocus
            />

            {query &&
              <button
                type="button"
                className="qa-search-form__clear auto-suggest__clear"
                onClick={this.clearQuery}
                title="Wis zoektekst"
              >
                <span className="u-sr-only">Wis zoektekst</span>
              </button>
            }
          </div>
          {suggestions.length > 0 && showSuggestions &&
            <div className="auto-suggest__dropdown">
              <h3 className="auto-suggest__tip">Enkele suggesties</h3>
              {suggestions.map((category) => (
                <AutoSuggestCategory
                  activeSuggestion={activeSuggestion}
                  category={category}
                  key={category.label}
                  onSuggestionSelection={this.onSuggestionSelection}
                  query={highlightQuery}
                />
              ))}
            </div>
          }
          <button
            className="auto-suggest__submit qa-search-form-submit"
            disabled={!query}
            title="Zoeken"
            type="submit"
          >
            <span className="u-sr-only">Zoeken</span>
          </button>
        </fieldset>
      </form>
    );
  }
}

AutoSuggest.propTypes = {
  activeSuggestion: PropTypes.shape({
    category: PropTypes.string,
    index: PropTypes.number,
    label: PropTypes.string,
    uri: PropTypes.string
  }).isRequired,
  highlightQuery: PropTypes.string,
  legendTitle: PropTypes.string,
  numberOfSuggestions: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  onSuggestionActivate: PropTypes.func.isRequired,
  onSuggestionSelection: PropTypes.func.isRequired,
  onTextInput: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  query: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object)
};

AutoSuggest.defaultProps = {
  highlightQuery: '',
  legendTitle: '',
  numberOfSuggestions: 0,
  placeHolder: '',
  query: '',
  queryFromUrl: '',
  suggestions: []
};

export default AutoSuggest;
