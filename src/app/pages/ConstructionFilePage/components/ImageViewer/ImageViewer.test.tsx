import { render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import ImageViewer, { IMAGE_VIEWER_TEST_ID } from './ImageViewer'

jest.mock('openseadragon')

describe('ImageViewer', () => {
  it('should render without problems', () => {
    const { getByTestId } = render(
      withAppContext(
        <ImageViewer
          fileName="filename"
          title="Some file"
          fileUrl="/somefile/url"
          printMode={false}
        />,
      ),
    )

    expect(getByTestId(IMAGE_VIEWER_TEST_ID)).toBeDefined()
  })
})
