import React from 'react';
import PropTypes from 'prop-types';

class AutoSuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSuggestionIndex: -1
    };

    this.clearQuery = this.clearQuery.bind(this);
  }

  clearQuery() {
    this.textInput.value = '';
    this.textInput.focus();
    this.props.onTextInput();
  }

  render() {
    const {
      placeHolder,
      legendTitle,
      uniqueId,
      classNames,
      onTextInput,
      suggestions,
      query,
      onSuggestSelection
    } = this.props;

    return (
      <div>
        <div>
          {legendTitle && <legend className="u-sr-only">legendTitle</legend>}
          <div className="c-search-form__input-container">
            <label htmlFor={uniqueId} className="u-sr-only">zoek tekst</label>
            <input
              ref={(input) => { this.textInput = input; }}
              id={uniqueId}
              className={classNames}
              type="text"
              ng-model="query"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              placeholder={placeHolder}
              onInput={onTextInput}
              // ng-change="getSuggestions()"
              // ng-keydown="navigateSuggestions($event)"
              // ng-blur="removeSuggestions($event)"
            />

            {query &&
              <button
                type="button"
                className="qa-search-form__clear c-search-form__clear"
                onClick={this.clearQuery}
                title="Wis zoektekst"
              >
                <span className="u-sr-only">Wis zoektekst</span>
              </button>
            }
          </div>
        </div>
        {suggestions.length > 0 &&
          <div className="c-autocomplete">
            <h3 className="c-autocomplete__tip">Enkele suggesties</h3>
            {suggestions.map((category) =>
              (<div className="c-autocomplete__category" key={category.label}>
                <h4 className="c-autocomplete__category__heading qa-autocomplete-header">{category.label}</h4>
                <ul>
                  {category.content.map((suggestion) =>
                    (<li key={suggestion._display}>
                      <button
                        type="button"
                        className={`c-autocomplete__category__suggestion ${this.state.activeSuggestionIndex === suggestion.index ? 'c-autocomplete__category__suggestion--active' : ''}`}
                        onClick={() => { onSuggestSelection(suggestion); this.clearQuery(); }}
                        dangerouslySetInnerHTML={{ __html: suggestion._display }}
                      />
                    </li>)
                  )}
                </ul>
              </div>)

            )}
          </div>
        }
      </div>
    );
  }
}

AutoSuggest.propTypes = {
  onTextInput: PropTypes.func
};

export default AutoSuggest;
window.AutoSuggest = AutoSuggest;
