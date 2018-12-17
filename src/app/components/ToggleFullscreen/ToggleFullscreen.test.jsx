import React from 'react';
import { shallow } from 'enzyme';

import ToggleFullscreen from './ToggleFullscreen';

describe('ToggleFullscreen', () => {
  describe('actions', () => {
    it('should trigger toggle off when clicked', () => {
      const onToggleFullscreen = jest.fn();
      const wrapper = shallow(
        <ToggleFullscreen
          isFullscreen
          onToggleFullscreen={onToggleFullscreen}
        />
      );
      wrapper.find('button').at(0).simulate('click');
      expect(onToggleFullscreen).toHaveBeenCalled();
    });

    it('should trigger toggle on when clicked', () => {
      const onToggleFullscreen = jest.fn();
      const wrapper = shallow(
        <ToggleFullscreen
          isFullscreen={false}
          onToggleFullscreen={onToggleFullscreen}
        />
      );
      wrapper.find('button').at(0).simulate('click');
      expect(onToggleFullscreen).toHaveBeenCalled();
    });

    describe('rendering', () => {
      it('should render with fullscreen is turned on', () => {
        const onToggleFullscreen = jest.fn();
        const wrapper = shallow(
          <ToggleFullscreen
            isFullscreen
            onToggleFullscreen={onToggleFullscreen}
          />
        );
        expect(wrapper).toMatchSnapshot();
      });

      it('should render with fullscreen is turned off', () => {
        const onToggleFullscreen = jest.fn();
        const wrapper = shallow(
          <ToggleFullscreen
            isFullscreen={false}
            onToggleFullscreen={onToggleFullscreen}
          />
        );
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
