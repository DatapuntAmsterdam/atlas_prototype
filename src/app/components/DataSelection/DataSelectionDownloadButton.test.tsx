import { render, screen } from '@testing-library/react'
import DataSelectionDownloadButton, { DOWNLOAD_BUTTON_TEST_ID } from './DataSelectionDownloadButton'
import { DatasetType } from './types'
import withAppContext from '../../utils/withAppContext'

describe('DataSelectionDownloadButton', () => {
  it('should build a URL based on the active filters', () => {
    render(
      withAppContext(
        <DataSelectionDownloadButton
          dataset={DatasetType.Bag}
          activeFilters={[
            {
              key: 'shape',
              value: '[[456,654], [123,312]]',
              label: 'Ingetekende polygoon',
            },
            {
              key: 'woonplaats',
              value: 'Amsterdam',
              label: 'Exists in dataset bag filters',
            },
            {
              key: 'randomkey',
              value: 'Foo',
              label: 'Does not exist in dataset bag filters',
            },
          ]}
        />,
      ),
    )

    const { href } = screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID) as HTMLAnchorElement
    const urlParams = href.split('?')[1]
    expect(urlParams).toBe('woonplaats=Amsterdam&shape=[[456,654],%20[123,312]]')
  })
  it('should add a dataset=ves filter when dataset is HR', () => {
    render(
      withAppContext(
        <DataSelectionDownloadButton
          dataset={DatasetType.Hr}
          activeFilters={[
            {
              key: 'shape',
              value: '[[456,654], [123,312]]',
              label: 'Ingetekende polygoon',
            },
            {
              key: 'woonplaats',
              value: 'Amsterdam',
              label: 'Exists in dataset hr filters',
            },
            {
              key: 'randomkey',
              value: 'Foo',
              label: 'Does not exist in dataset hr filters',
            },
          ]}
        />,
      ),
    )

    const { href } = screen.getByTestId(DOWNLOAD_BUTTON_TEST_ID) as HTMLAnchorElement
    const urlParams = href.split('?')[1]
    expect(urlParams).toBe('woonplaats=Amsterdam&shape=[[456,654],%20[123,312]]&dataset=ves')
  })
})
