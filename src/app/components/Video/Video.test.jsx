import { shallow } from 'enzyme'
import Video from './Video'

describe('Video', () => {
  let component
  let componentInstance
  let videoPlayerMock

  beforeEach(() => {
    videoPlayerMock = {
      play: jest.fn(() => Promise.resolve()),
      pause: jest.fn(),
      currentTime: 0,
    }

    component = shallow(
      <Video poster="/assets/video/map.jpg" src="/assets/video/map.mp4" type="video/mp4" />,
    )
    componentInstance = component.instance()
    componentInstance.videoPlayer = videoPlayerMock
  })

  describe('componentDidUpdate', () => {
    it('should play the video', () => {
      component.setProps({
        play: true,
        position: 0,
      })
      expect(videoPlayerMock.play).toHaveBeenCalled()
      expect(videoPlayerMock.pause).not.toHaveBeenCalled()
    })

    it("should update the video position when play state doesn't change", () => {
      component.setProps({
        position: 10,
      })
      expect(videoPlayerMock.currentTime).toEqual(10)
    })

    it('should pause the video', async () => {
      component.setProps({
        play: true,
      })
      expect(videoPlayerMock.play).toHaveBeenCalled()
      expect(videoPlayerMock.pause).not.toHaveBeenCalled()
      expect(componentInstance.playPromise).toBeTruthy()
      videoPlayerMock.play.mockReset()
      videoPlayerMock.pause.mockReset()
      await component.setProps({
        play: false,
      })

      expect(videoPlayerMock.play).not.toHaveBeenCalled()
      expect(videoPlayerMock.pause).toHaveBeenCalled()
    })

    it('should do nothing when stopping the video while play is not defined', () => {
      videoPlayerMock.play.mockReset()
      videoPlayerMock.pause.mockReset()
      component.setProps({
        play: true,
        position: 0,
      })
      videoPlayerMock.play.mockReset()
      videoPlayerMock.pause.mockReset()

      component.setProps({
        play: false,
        position: 0,
      })
      expect(videoPlayerMock.play).not.toHaveBeenCalled()
    })
  })
})
