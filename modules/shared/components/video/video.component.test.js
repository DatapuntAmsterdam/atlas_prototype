describe('The video component', () => {
    let $compile,
        $rootScope,
        $window,
        scope,
        originalPolyfill;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject((_$compile_, _$rootScope_, _$window_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });

        // always set the state so no polyfill is provided.
        // This is achieved by deleting the window function and
        // restoring it after each tests.
        if ($window.objectFitPolyfill) {
            originalPolyfill = $window.objectFitPolyfill;
            delete $window.objectFitPolyfill;
        }
    });

    afterEach(() => {
        $window.objectFitPolyfill = originalPolyfill;
    });

    function getComponent () {
        scope = $rootScope.$new();
        const component = $compile(`<dp-video
            src="'foo/bar.mp4'"
            poster="'foo/bar.jpg'"
            width="1"
            height="2"
            play="playVideo"
            ></dp-video>`)(scope);
        scope.$digest();

        // Stub HTML5 video controls, not available in test setup if not provided
        const videoElement = component.find('video')[0];
        videoElement.play = jasmine.createSpy('play');
        videoElement.pause = jasmine.createSpy('pause');

        return component;
    }

    it('displays a video', () => {
        const component = getComponent();
        const videoElement = component.find('video')[0];
        const sourceElement = component.find('source')[0];
        expect(videoElement.getAttribute('width')).toBe('1');
        expect(videoElement.getAttribute('height')).toBe('2');
        expect(videoElement.getAttribute('poster')).toBe('foo/bar.jpg');
        expect(sourceElement.getAttribute('ng-src')).toBe('foo/bar.mp4');
    });

    it('plays the video', () => {
        const component = getComponent(),
            videoElement = component.find('video')[0];

        scope.playVideo = true;
        scope.$digest();

        expect(videoElement.play).toHaveBeenCalled();
    });

    it('stops and resets the video', () => {
        const component = getComponent(),
            videoElement = component.find('video')[0];

        scope.playVideo = true;
        scope.$digest();

        scope.playVideo = false;
        scope.$digest();

        expect(videoElement.pause).toHaveBeenCalled();
        expect(videoElement.currentTime).toBe(0);
    });

    it('calls the polyfill window function if provided', () => {
        $window.objectFitPolyfill = jasmine.createSpy('objectFitPolyfill');
        getComponent();
        expect($window.objectFitPolyfill).toHaveBeenCalled();
    });
});
