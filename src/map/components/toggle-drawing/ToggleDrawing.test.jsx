import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';

import ToggleDrawing from './ToggleDrawingContainer';

import { getShapeMarkers, getShapeDistanceTxt, isDrawingEnabled } from '../../ducks/map/map-selectors';
import * as dataSelectionActions from '../../../shared/ducks/data-selection/actions';

jest.mock('../../../shared/ducks/data-selection/actions');
jest.mock('../../ducks/map/map-selectors');

describe('ToggleDrawing', () => {
  const store = configureMockStore()({});
  let wrapper;

  dataSelectionActions.cancelDrawing.mockImplementation(() => ({ type: 'SOME_ACTION' }));
  dataSelectionActions.endDataSelection.mockImplementation(() => ({ type: 'SOME_ACTION' }));
  dataSelectionActions.resetDrawing.mockImplementation(() => ({ type: 'SOME_ACTION' }));
  dataSelectionActions.startDrawing.mockImplementation(() => ({ type: 'SOME_ACTION' }));

  const setupComponent = (shapeDistanceTxt, drawingEnabled, numberOfMarkers) => {
    getShapeDistanceTxt.mockImplementation(() => shapeDistanceTxt);
    isDrawingEnabled.mockImplementation(() => drawingEnabled);
    getShapeMarkers.mockImplementation(() => numberOfMarkers);
    wrapper = shallow(<ToggleDrawing />, { context: { store } }).dive();
  };

  it('should trigger end drawing action drawing on when clicked', () => {
    setupComponent('0,3 m', true, 3);
    wrapper.find('button').at(0).simulate('click');
    expect(dataSelectionActions.endDataSelection).toHaveBeenCalled();
  });

  it('should trigger cancel drawing action drawing on when clicked', () => {
    setupComponent('0,0 m', true, 0);
    wrapper.find('button').at(0).simulate('click');
    expect(dataSelectionActions.cancelDrawing).toHaveBeenCalled();
  });

  it('should trigger cancel drawing action drawing on when clicked', () => {
    setupComponent('0,3 m', false, 3);
    wrapper.find('button').at(0).simulate('click');
    expect(dataSelectionActions.resetDrawing).toHaveBeenCalled();
  });

  it('should trigger start drawing action drawing on when clicked', () => {
    setupComponent('', false, 0);
    wrapper.find('button').at(0).simulate('click');
    expect(dataSelectionActions.startDrawing).toHaveBeenCalled();
  });

  it('should render with drawing mode none and no markers', () => {
    setupComponent('', false, 0);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with drawing mode none and 3 markers showing "Opnieuw tekenen"', () => {
    setupComponent('', false, 3);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with drawing mode draw and 3 markers showing "Eindig tekenen"', () => {
    setupComponent('', true, 3);
    expect(wrapper).toMatchSnapshot();
  });
});
