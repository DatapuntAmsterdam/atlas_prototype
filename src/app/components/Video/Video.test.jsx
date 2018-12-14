import React from 'react';
import { shallow } from 'enzyme';
import Video from './Video';

describe('Video', () => {
  it('should render', () => {
    const component = shallow(
      <Video
        poster="/assets/video/map.png"
        src="/assets/video/map.mp4"
        type="video/mp4"
      />
    );
    expect(component).toMatchSnapshot();
  });
});
