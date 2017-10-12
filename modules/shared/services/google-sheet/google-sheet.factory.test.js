describe('The google sheet factory', function () {
    const config = {};
    let $rootScope,
        $window,
        $httpBackend,
        googleSheet,
        feed;

    beforeEach(function () {
        feed = {
            feed: {
                updated: {
                    '$t': '2020-01-15T12:30:45.000Z'
                },
                title: {
                    '$t': 'My title'
                },
                entry: [
                    {
                        title: {
                            '$t': 'entry1'
                        },
                        content: {
                            '$t': 'attr-datum: 1-1-2017, attr-titel: titel1, attr-contents: [link link](http://link/)'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry2'
                        },
                        content: {
                            '$t': 'attr-datum: 10-1-2017, attr-titel: titel2, ' +
                                'attr-verkorte-titel: <a href="http://link/">link</a>'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry3'
                        },
                        content: {
                            '$t': 'attr-datum: 1-12-2017, attr-titel: titel3, attr-verkorte-titel: short3'
                        }
                    },
                    {
                        title: {
                            '$t': 'entry4'
                        },
                        content: {
                            '$t': 'attr-datum: 12-12-2017, attr-titel:, ' +
                                'attr-verkorte-titel: See [link link](http://link/)'
                        }
                    }

                ]
            }
        };

        angular.mock.module('dpShared', {
            $window: {
                addEventListener: angular.noop
            },
            $sce: {
                trustAsHtml: value => 'HTML' + value
            },
            markdownParser: {
                parse: value => 'MD' + value
            },
            environment: {
                NAME: 'ANY VALUE'
            },
            store: {
                getState: () => ({ user: {} })
            }
        },
        function ($provide) {
            $provide.constant('GOOGLE_SHEET_CMS', config);
        });

        angular.mock.inject(function (_$rootScope_, _$window_, _$httpBackend_, _googleSheet_) {
            $rootScope = _$rootScope_;
            $window = _$window_;
            $httpBackend = _$httpBackend_;
            googleSheet = _googleSheet_;
        });

        angular.extend(config, {
            getStatic: {
                PRODUCTION: true,
                ACCEPTATION: false
            },
            staticAddress: 'staticAddress',
            key: 'CMSKEY',
            index: {
                type: 99
            }
        });
    });

    describe('The static variant', function () {
        let environment;

        beforeEach(function () {
            angular.mock.inject(function (_environment_) {
                environment = _environment_;
            });

            environment.NAME = 'PRODUCTION';
        });

        it('reads its data from an address, specified in the confiuration', function () {
            $httpBackend.whenGET('staticAddress/CMSKEY.99.json').respond(feed);

            let result;
            googleSheet.getContents('type').then(contents => result = contents);

            $httpBackend.flush();
            expect(result.feed.title).toEqual(feed.feed.title.$t);

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('uses the cached value if loaded twice', function () {
            $httpBackend.whenGET('staticAddress/CMSKEY.99.json').respond(feed);

            googleSheet.getContents('type');

            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();

            googleSheet.getContents('type');

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('returns an empty feed when the get fails', function () {
            $httpBackend.whenGET('staticAddress/CMSKEY.99.json').respond(500, 'ERROR');

            let result;
            googleSheet.getContents('type').then(contents => result = contents);

            $httpBackend.flush();
            expect(result).toEqual({
                feed: {
                    title: ''
                },
                entries: []
            });

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });

    describe('The dynamic variant is the default variant', function () {
        it('puts a scripts in the document header to load the sheet contents', function () {
            googleSheet.getContents('type');
            expect(document.head.innerHTML).toContain(
                '<script type="text/javascript" ' +
                'src="https://spreadsheets.google.com/feeds/list/CMSKEY/99/public/basic?' +
                'alt=json-in-script&amp;callback=googleScriptCallback_CMSKEY_99"></script>');
        });

        it('turs any dashes in the key into underscores for in the callback identifier', function () {
            config.key = 'CMS-KEY';
            googleSheet.getContents('type');
            expect(document.head.innerHTML).toContain(
                '<script type="text/javascript" ' +
                'src="https://spreadsheets.google.com/feeds/list/CMS-KEY/99/public/basic?' +
                'alt=json-in-script&amp;callback=googleScriptCallback_CMS_KEY_99"></script>');
        });

        it('uses the cached value if loaded twice', function () {
            googleSheet.getContents('type');
            $window.googleScriptCallback_CMSKEY_99(feed);

            $rootScope.$apply();

            spyOn($window, 'googleScriptCallback_CMSKEY_99');
            googleSheet.getContents('type');
            expect($window.googleScriptCallback_CMSKEY_99).not.toHaveBeenCalled();
        });
    });

    describe('The dynamic variant can also be specified explicitly', function () {
        let environment;

        beforeEach(function () {
            angular.mock.inject(function (_environment_) {
                environment = _environment_;
            });

            environment.NAME = 'ACCEPTATION';
        });

        it('puts a scripts in the document header to load the sheet contents', function () {
            googleSheet.getContents('type');
            expect(document.head.innerHTML).toContain(
                '<script type="text/javascript" ' +
                'src="https://spreadsheets.google.com/feeds/list/CMSKEY/99/public/basic?' +
                'alt=json-in-script&amp;callback=googleScriptCallback_CMSKEY_99"></script>');
        });
    });

    describe('The contents parser', function () {
        let result;

        beforeEach(function () {
            googleSheet.getContents('type').then(contents => result = contents);
            $window.googleScriptCallback_CMSKEY_99(feed);
            $rootScope.$apply();
        });

        it('processes the global feed properties', function () {
            expect(result.feed.title).toBe(feed.feed.title.$t);
            expect(result.feed.lastUpdated).toBe(feed.feed.updated.$t);
        });

        it('provides for a raw and html representation of each attribute', function () {
            expect(result.entries[2].verkorteTitel.value).toBe('short3');
            expect(result.entries[2].verkorteTitel.html).toBe('HTMLMDshort3');
        });

        it('skips empty values', function () {
            expect(result.entries[3].title).toBeUndefined();
        });

        it('identifies links', function () {
            expect(result.entries[0].contents.value).toBe('[link link](http://link/)');
            expect(result.entries[0].contents.isHref).toBe(true);
            expect(result.entries[0].contents.isDate).toBe(false);

            expect(result.entries[1].verkorteTitel.value).toBe('<a href="http://link/">link</a>');
            expect(result.entries[1].verkorteTitel.isHref).toBe(true);
            expect(result.entries[1].verkorteTitel.isDate).toBe(false);

            expect(result.entries[2].verkorteTitel.isHref).toBe(false);
            expect(result.entries[3].verkorteTitel.isHref).toBe(false);
        });

        it('parses date values', function () {
            expect(result.entries[0].datum.date).toEqual(new Date(2017, 0, 1));
            expect(result.entries[1].datum.date).toEqual(new Date(2017, 0, 10));
            expect(result.entries[2].datum.date).toEqual(new Date(2017, 11, 1));
            expect(result.entries[3].datum.date).toEqual(new Date(2017, 11, 12));
            [0, 1, 2, 3].forEach(i => {
                expect(result.entries[i].datum.isHref).toBe(false);
                expect(result.entries[i].datum.isDate).toBe(true);
            });
            expect(result.entries[2].verkorteTitel.isDate).toBe(false);
        });
    });
});
