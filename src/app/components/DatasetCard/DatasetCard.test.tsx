import { render, screen } from '@testing-library/react'
import withAppContext from '../../utils/withAppContext'
import DatasetCard from './DatasetCard'

describe('DatasetCard', () => {
  const props = {
    id: '1',
    to: { pathname: '/' },
    shortTitle: 'title',
    teaser: 'the teaser text',
    modified: 'modified',
    lastModified: 'last modified',
    distributionTypes: ['format1', 'format2'],
  }

  it('displays the title and teaser', () => {
    render(withAppContext(<DatasetCard href="link" {...props} />))
    expect(screen.getByText(props.shortTitle)).toBeInTheDocument()
    expect(screen.getByText(props.teaser)).toBeInTheDocument()
  })

  it('displays the date', () => {
    render(withAppContext(<DatasetCard href="link" {...props} />))
    expect(screen.getByText(props.lastModified)).toHaveAttribute('dateTime', props.modified)
  })

  it('displays the formats', () => {
    render(withAppContext(<DatasetCard href="link" {...props} />))

    expect(screen.getByTestId('distributionTypes')).toBeInTheDocument()
    expect(screen.getByText(props.distributionTypes[0])).toBeInTheDocument()
    expect(screen.getByText(props.distributionTypes[1])).toBeInTheDocument()
  })
})
