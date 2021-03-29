import { fireEvent, render, within } from '@testing-library/react'
import { FunctionComponent } from 'react'
import { ThemeProvider } from '@amsterdam/asc-ui'
import DocumentCover, { DocumentCoverProps } from './DocumentCover'
import getImageFromCms from '../../utils/getImageFromCms'

describe('DocumentCover', () => {
  const wrapper: FunctionComponent = ({ children }) => <ThemeProvider>{children}</ThemeProvider>
  const mockOnClick = jest.fn()

  const props: DocumentCoverProps = {
    imageSrc: '/images/this-image.jpg',
    onClick: mockOnClick,
    title: 'Title',
    description: 'Lorem ipsum...',
    loading: false,
  }

  it('should display a cover image', () => {
    const { getByTestId } = render(<DocumentCover {...props} />, { wrapper })
    const image = getByTestId('image')

    expect(image).toBeDefined()
    expect(image).toHaveAttribute('src', props.imageSrc)
  })

  it('should be possible to click the button', () => {
    const { getByTestId } = render(<DocumentCover {...props} />, { wrapper })
    const button = getByTestId('button')

    expect(button).toBeDefined()
    expect(button).toHaveTextContent(props.description)

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('should show a loading indicator when the result of the button is loading', () => {
    const { getByTestId, rerender } = render(<DocumentCover {...props} />, { wrapper })
    let button = getByTestId('button')

    expect(within(button).getByTestId('download-icon')).toBeDefined()

    rerender(<DocumentCover {...{ ...props, loading: true }} />)
    button = getByTestId('button')

    expect(within(button).getByTestId('loading-spinner')).toBeDefined()
  })

  it('should display the default cover image if cover image link is broken', () => {
    const { getByTestId } = render(<DocumentCover {...props} />, { wrapper })
    const image = getByTestId('image')

    expect(image).toHaveAttribute('src', props.imageSrc)

    fireEvent(image, new Event('error'))

    expect(image).toHaveAttribute(
      'src',
      getImageFromCms(
        '/sites/default/files/images/default-plaatje-publicatie-OIS.jpg',
        600,
        0,
        'fit',
      ),
    )
  })
})
