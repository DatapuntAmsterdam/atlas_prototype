describe('The fontLoader factory', function () {
    let $document,
        fontLoader;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            function ($provide) {
                $provide.constant('FONT_LOADER_CONFIG', {
                    API_KEY: 'MY_SPECIAL_KEY'
                });
            }
        );

        angular.mock.inject(function (_$document_, _fontLoader_) {
            $document = _$document_;
            fontLoader = _fontLoader_;
        });
    });

    function getNumberOfScripts () {
        return $document[0].head.querySelectorAll('script').length;
    }

    function getLastScript () {
        return $document[0].head.querySelectorAll('script')[getNumberOfScripts() - 1];
    }

    it('adds a script tag to the DOM that refers to the JavaScript API of fonts.com', function () {
        let numberOfScripts = getNumberOfScripts(),
            lastScript;

        fontLoader.initialize();
        expect(getNumberOfScripts()).toBe(numberOfScripts + 1);

        lastScript = getLastScript();
        expect(lastScript.getAttribute('src')).toContain('fast.fonts.net/jsapi/');
    });

    it('loads the fonts over https to prevent security issues', function () {
        let lastScript;

        fontLoader.initialize();
        lastScript = getLastScript();

        expect(lastScript.getAttribute('src')).toMatch(/^https:\/\//);
        expect(lastScript.getAttribute('src')).not.toMatch(/^\/\//);
        expect(lastScript.getAttribute('src')).not.toMatch(/^http:\/\//);
    });

    it('uses the fonts.com API_KEY from FONT_LOADER_CONFIG', function () {
        let lastScript;

        fontLoader.initialize();
        lastScript = getLastScript();

        expect(lastScript.getAttribute('src')).toMatch(/MY_SPECIAL_KEY\.js$/);
    });
});
