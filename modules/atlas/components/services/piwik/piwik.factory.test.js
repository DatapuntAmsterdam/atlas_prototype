describe('The piwik service', function () {
    var $window,
        $document,
        piwik;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                environment: {
                    NAME: 'DEVELOPMENT'
                }
            },
            function ($provide) {
                $provide.constant('PIWIK_CONFIG', {
                    PRODUCTION: {
                        SITE_ID: 100
                    },
                    DEVELOPMENT: {
                        SITE_ID: 300
                    }
                });
            }
        );

        angular.mock.inject(function (_$window_, _$document_, _piwik_) {
            $window = _$window_;
            $document = _$document_;
            piwik = _piwik_;
        });
    });

    it('inserts a script tag into the DOM', function () {
        var numberOfScripts,
            piwikScript;

        numberOfScripts = getScripts().length;

        piwik.initialize();

        piwikScript = getScripts()[0];

        expect(getScripts().length).toBe(numberOfScripts + 1);
        expect(piwikScript.getAttribute('type')).toBe('text/javascript');
        expect(piwikScript.getAttribute('src')).toBe('https://atlas.amsterdam.nl/piwik/piwik.js');
    });

    it('creates a global variable with specific instructions per environment', function () {
        /*
         * Please note that $window._paq is already created by piwik.run.js before this unit test is run, the
         * initialize() function calls in this file have no effect, but they are added for clarity. Running initialize
         * twice will never happen in the 'real world'.
         *
         * Note: we can't test window.Piwik.getTracker().getSiteId() because Piwik's script is loaded asynchronously and
         * Karma won't wait for that.
         */
        var numberOfInstructions;

        spyOn($window._paq, 'push');

        piwik.initialize();
        numberOfInstructions = $window._paq.length;

        expect($window._paq.push).toHaveBeenCalledWith(['setSiteId', 300]);
    });

    function getScripts () {
        return $document[0].getElementsByTagName('script');
    }
});
