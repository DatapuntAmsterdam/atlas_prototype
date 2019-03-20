import React from 'react';
import { shallow } from 'enzyme';
import MapLayers from './MapLayers';

const layers = [
  {
    id: 'pano2018',
    layers: [
      'panorama_recent_2018'
    ],
    legendItems: [
      {
        selectable: false,
        title: '2018'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2017',
    layers: [
      'panorama_recent_2017'
    ],
    legendItems: [
      {
        selectable: false,
        title: '2017'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    id: 'pano2016',
    layers: [
      'panorama_recent_2016'
    ],
    legendItems: [
      {
        selectable: false,
        title: '2016'
      }
    ],
    maxZoom: 16,
    minZoom: 11,
    title: 'Panoramabeelden',
    url: '/maps/panorama?version=1.3.0&service=WMS'
  },
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'bgem',
        noDetail: true,
        layer: 'burgerlijke_gemeente',
        selectable: true,
        title: 'Burgerlijke gemeente'
      },
      {
        id: 'kgem',
        noDetail: true,
        layer: 'kadastrale_gemeente',
        selectable: true,
        title: 'Kadastrale gemeente'
      },
      {
        id: 'ksec',
        noDetail: true,
        layer: 'kadastrale_sectie',
        selectable: true,
        title: 'Kadastrale sectie'
      },
      {
        id: 'kot',
        layer: 'kadastraal_object',
        selectable: true,
        title: 'Kadastraal object'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS'
  }
];

const activeLayers = [
  {
    category: 'Geografie: onroerende zaken',
    legendItems: [
      {
        id: 'bgem',
        noDetail: true,
        layer: 'burgerlijke_gemeente',
        selectable: true,
        title: 'Burgerlijke gemeente'
      },
      {
        id: 'kgem',
        noDetail: true,
        layer: 'kadastrale_gemeente',
        selectable: true,
        title: 'Kadastrale gemeente'
      },
      {
        id: 'ksec',
        noDetail: true,
        layer: 'kadastrale_sectie',
        selectable: true,
        title: 'Kadastrale sectie 1'
      }
    ],
    maxZoom: 16,
    minZoom: 8,
    title: 'Kadastrale perceelsgrenzen',
    url: '/maps/brk?version=1.3.0&service=WMS'
  }
];

describe('MapLayer', () => {
  it('should render', () => {
    const component = shallow(
      <MapLayers
        activeMapLayers={activeLayers}
        layers={layers}
        onLayerToggle={() => {
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('should render without active layers', () => {
    const component = shallow(
      <MapLayers
        activeMapLayers={[]}
        layers={layers}
        onLayerToggle={() => {
        }}
      />
    );

    expect(component).toMatchSnapshot();
  });

  it('should call onLayerToggle when user clicks on button', () => {
    const onLayerToggleMock = jest.fn();
    const component = shallow(
      <MapLayers
        activeMapLayers={activeLayers}
        layers={layers}
        onLayerToggle={onLayerToggleMock}
      />
    );

    const button = component.find('button');
    button.simulate('click');

    expect(onLayerToggleMock).toHaveBeenCalled();
  });
});
