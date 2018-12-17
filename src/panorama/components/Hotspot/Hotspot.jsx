import React from 'react';
import PropTypes from 'prop-types';
import './Hotspot.scss';

const Hotspot = ({ sceneId, distance, pitch, year, size, angle }) => (
  <div
    className="hotspot"
    scene-id={sceneId}
    distance={distance}
    pitch={pitch}
    year={year}
  >
    <button
      className={`c-hotspot c-hotspot--year-${year} qa-hotspot-button`}
    >
      <div
        className="qa-hotspot-rotation"
        style={{ width: `${size}px`, height: `${size}px`, transform: `rotateX(${angle}deg)` }}
      />
      <div
        className="c-hotspot__image"
        style={{ width: `${size}px`, height: `${size}px`, transform: `rotateX(${angle}deg)` }}
      />
      <span className="u-sr-only">Navigeer naar deze locatie</span>
    </button>
  </div>
);

Hotspot.propTypes = {
  sceneId: PropTypes.string.isRequired,
  distance: PropTypes.number.isRequired,
  pitch: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired
};

export default Hotspot;
