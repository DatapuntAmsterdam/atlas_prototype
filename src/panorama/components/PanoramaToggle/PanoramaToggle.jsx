import React from 'react';
import PropTypes from 'prop-types';

import './PanoramaToggle.scss';
import { PANO_LABELS } from '../../ducks/constants';

const getStreetViewUrl = (location, heading) => {
  const [latitude, longitude] = location;
  const path = 'http://maps.google.com/maps?q=&layer=c&';
  const parameters = `cbll=${latitude},${longitude}&cbp=11,${heading},0,0,0`;

  return `${path}${parameters}`;
};

class PanoramaToggle extends React.Component {
  constructor() {
    super();
    this.state = {
      showMenu: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setPanoramaTags = this.setPanoramaTags.bind(this);
    this.onOpenPanoramaExternal = this.onOpenPanoramaExternal.bind(this);
  }

  onOpenPanoramaExternal() {
    this.props.openPanoramaExternal();
    this.toggleMenu();
  }

  setPanoramaTags(option) {
    this.props.setPanoramaTags(option);
    this.toggleMenu();
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  render() {
    const { heading, currentLabel, location } = this.props;
    const { showMenu } = this.state;

    return (
      <div className="c-panorama-status-bar__history">
        <div className="c-panorama-toggle qa-panorama-toggle">
          <button
            className={`
              c-panorama-toggle__button
              qa-panorama-toggle__button
              ${(showMenu) ? 'c-panorama-toggle__button--active' : ''}
            `}
            onClick={this.toggleMenu}
          >
            {currentLabel}
          </button>
          {(showMenu) ? <ul className="c-panorama-toggle__menu qa-panorama-toggle__menu">
            {PANO_LABELS.map((label) => (
              <li
                key={label.layerId}
              >
                <button
                  className={`
                    c-panorama-toggle__item
                    qa-panorama-toggle__item
                  `}
                  onClick={() => this.setPanoramaTags(label.tags)}
                >
                  {label.label}
                </button>
              </li>
            ))}
            <li
              key="divider"
              className="c-panorama-toggle__devider qa-panorama-toggle__devider"
            />
            <li
              key="google-street-view"
              className="c-panorama-toggle__external qa-panorama-toggle__external"
            >
              <a
                href={getStreetViewUrl(location, heading)}
                target="_blank"
                rel="noopener"
                className="
                  c-link
                  c-link--arrow
                  c-panorama-toggle__external-link
                  qa-panorama-toggle__external-link"
                onClick={this.onOpenPanoramaExternal}
              >Google Street View</a>
            </li>
          </ul> : ''}
        </div>
      </div>
    );
  }
}

PanoramaToggle.defaultProps = {
  fetchPanoramaRequest: ''
};

PanoramaToggle.propTypes = {
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  currentLabel: PropTypes.string.isRequired,
  location: PropTypes.array.isRequired,  // eslint-disable-line
  setPanoramaTags: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // eslint-disable-line
  openPanoramaExternal: PropTypes.oneOfType([PropTypes.string, PropTypes.func]) // eslint-disable-line
};

export default PanoramaToggle;
