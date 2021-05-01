import { screen, fireEvent, render, within } from '@testing-library/react'
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
    render(<DocumentCover {...props} />, { wrapper })
    const image = screen.getByTestId('image')

    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', props.imageSrc)
  })

  it('should be possible to click the button', () => {
    render(<DocumentCover {...props} />, { wrapper })
    const button = screen.getByTestId('button')

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(props.description)

    fireEvent.click(button)

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('should show a loading indicator when the result of the button is loading', () => {
    const { rerender } = render(<DocumentCover {...props} />, { wrapper })
    let button = screen.getByTestId('button')

    expect(within(button).getByTestId('download-icon')).toBeInTheDocument()

    rerender(<DocumentCover {...{ ...props, loading: true }} />)
    button = screen.getByTestId('button')

    expect(within(button).getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should display the default cover image if cover image link is broken', () => {
    render(<DocumentCover {...props} />, { wrapper })
    const image = screen.getByTestId('image')

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
