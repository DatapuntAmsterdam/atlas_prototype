import React from 'react';
import PropTypes from 'prop-types';

const TabBar = ({
  numberOfDataResults,
  numberOfDatasetResults,
  goToDatasets,
  searchQuery,
  children,
  showDatasetsButton
}) => (
  <div>
    <h1 className="qa-tab-header__title c-tab-header__title">
      {(numberOfDataResults !== 0 || numberOfDatasetResults !== 0) && (
        <span className="c-tab-header__title__text">
          Resultaten met &apos;{searchQuery}&apos;
        </span>
      )}
      {(numberOfDataResults === 0 && numberOfDatasetResults === 0) && (
        <span className="c-tab-header__title__text">
          Geen resultaten met &apos;{searchQuery}&apos;
        </span>
      )}
      {(showDatasetsButton) && (
        <button
          onClick={goToDatasets}
          type="button"
          className="c-tab-header__reset-button qa-go-to-catalogus"
        >
          <span className="c-tab-header__reset-button--color">Alle datasets tonen</span>
        </button>
      )}
    </h1>
    {children}
  </div>
);

TabBar.defaultProps = {
  showDatasetsButton: false,
  children: null
};

TabBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  goToDatasets: PropTypes.func.isRequired,
  children: PropTypes.node,
  showDatasetsButton: PropTypes.bool,
  numberOfDataResults: PropTypes.number.isRequired,
  numberOfDatasetResults: PropTypes.number.isRequired
};

export default TabBar;
