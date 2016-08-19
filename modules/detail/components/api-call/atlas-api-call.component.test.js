describe('The atlas-api-call component', function () {
    var $compile,
        $rootScope,
        $q,
        api,
        finishApiRequest;

    beforeEach(function () {
        angular.mock.module(
            'atlasDetail',
            {
                api: {
                    getByUrl: function (endpoint) {
                        var q = $q.defer(),
                            mockedResponse;

                        switch (endpoint) {
                            case 'http://www.some-domain.com/without-pagination/123/':
                                mockedResponse = {
                                    var_a: 'foo',
                                    var_b: 'bar'
                                };

                                break;

                            case 'http://www.some-domain.com/with-pagination/456/':
                                mockedResponse = {
                                    count: 5,
                                    results: ['ITEM_1', 'ITEM_2', 'ITEM_3'],
                                    _links: {
                                        next: {
                                            href: 'http://www.some-domain.com/with-pagination/456/?page=2'
                                        }
                                    }
                                };

                                break;


                            case 'http://www.some-domain.com/with-pagination/456/?page=2':
                                mockedResponse = {
                                    count: 5,
                                    results: ['ITEM_4', 'ITEM_5'],
                                    _links: {
                                        next: null
                                    }
                                };

                                break;

                            case 'http://www.some-domain.com/something/123/':
                            case 'http://www.some-domain.com/brk/object/123/':
                            case 'http://www.some-domain.com/brk/object-expand/123/':
                                mockedResponse = {
                                    var_c: 'baz'
                                };

                                break;
                        }

                        finishApiRequest = function () {
                            q.resolve(mockedResponse);
                        };

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.factory('atlasPartialSelectDirective', function () {
                    return {};
                });

                $provide.factory('dpLoadingIndicatorDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _api_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            api = _api_;
        });

        finishApiRequest = null;

        spyOn(api, 'getByUrl').and.callThrough();
    });

    function getComponent (endpoint, partial, useBrkObjectExpanded) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-api-call');
        element.setAttribute('endpoint', endpoint);
        element.setAttribute('partial', partial);
        element.setAttribute('use-brk-object-expanded', 'useBrkObjectExpanded');

        scope = $rootScope.$new();
        scope.useBrkObjectExpanded = useBrkObjectExpanded;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('does nothing if there is no endpoint', function () {
        var component = getComponent('', 'some-partial', false);

        expect(api.getByUrl).not.toHaveBeenCalled();
        expect(component.find('atlas-partial-select').length).toBe(0);
    });

    describe('content without pagination', function () {
        it('retrieves data from the api factory and restructures it for atlas-partial-select', function () {
            var component,
                scope;

            component = getComponent('http://www.some-domain.com/without-pagination/123/', 'some-partial', false);
            scope = component.isolateScope();

            finishApiRequest();
            scope.$apply();

            expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/without-pagination/123/');

            expect(component.find('atlas-partial-select').length).toBe(1);
            expect(component.find('atlas-partial-select').attr('api-data')).toBe('vm.apiData');
            expect(scope.vm.apiData).toEqual({
                results: {
                    var_a: 'foo',
                    var_b: 'bar'
                }
            });
        });

    });

    describe('content with pagination', function () {
        it('optionally sets next variable on the scope', function () {
            var component,
                scope;

            component = getComponent('http://www.some-domain.com/with-pagination/456/', 'some-partial', false);
            scope = component.isolateScope();

            finishApiRequest();
            scope.$apply();

            expect(scope.vm.apiData).toEqual(jasmine.objectContaining({
                next: 'http://www.some-domain.com/with-pagination/456/?page=2'
            }));
        });

        it('puts a loadMore function on the scope that can retrieve the next page of data', function () {
            var component,
                scope;

            component = getComponent('http://www.some-domain.com/with-pagination/456/', 'some-partial', false);
            scope = component.isolateScope();

            finishApiRequest();
            scope.$apply();

            expect(api.getByUrl).toHaveBeenCalledTimes(1);
            expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/with-pagination/456/');
            expect(scope.vm.apiData.count).toBe(5);
            expect(scope.vm.apiData.results).toEqual(['ITEM_1', 'ITEM_2', 'ITEM_3']);
            expect(scope.vm.apiData.next).toBe('http://www.some-domain.com/with-pagination/456/?page=2');

            scope.vm.loadMore();
            finishApiRequest();
            scope.$apply();

            expect(api.getByUrl).toHaveBeenCalledTimes(2);
            expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/with-pagination/456/?page=2');
            expect(scope.vm.apiData.count).toBe(5);
            expect(scope.vm.apiData.results).toEqual(['ITEM_1', 'ITEM_2', 'ITEM_3', 'ITEM_4', 'ITEM_5']);
            expect(scope.vm.apiData.next).toBe(null);
        });
    });

    it('communicates the partial variabe to atlas-partial-select', function () {
        var component;

        component = getComponent('http://www.some-domain.com/without-pagination/123/', 'some-partial', false);

        expect(component.find('atlas-partial-select').length).toBe(1);
        expect(component.find('atlas-partial-select').attr('partial')).toBe('some-partial');
    });

    it('overrides the brk/object endpoint based on the useBrkObjectExpanded variable', function () {
        //It does nothing when the endpoint doesn't match brk/object
        getComponent('http://www.some-domain.com/something/123/', 'some-partial', true);
        expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/something/123/');

        //It does nothing when the variable is set to false
        getComponent('http://www.some-domain.com/brk/object/123/', 'some-partial', false);
        expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/brk/object/123/');

        //It replaced the endpoint for brk-object when it is set to true
        getComponent('http://www.some-domain.com/brk/object/123/', 'some-partial', true);
        expect(api.getByUrl).toHaveBeenCalledWith('http://www.some-domain.com/brk/object-expand/123/');
    });

    describe('a loading indicator', function () {
        it('will be shown, without delay, when fetching the initial data', function () {
            var component,
                scope;

            component = getComponent('http://www.some-domain.com/with-pagination/456/', 'some-partial', false);
            scope = component.isolateScope();

            expect(component.find('dp-loading-indicator').length).toBe(1);
            expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');
            expect(scope.vm.isLoading).toBe(true);

            expect(component.find('dp-loading-indicator').attr('use-delay')).toBe('vm.useLoadingIndicatorDelay');
            expect(scope.vm.useLoadingIndicatorDelay).toBe(false);

            finishApiRequest();
            scope.$apply();

            expect(scope.vm.isLoading).toBe(false);
        });

        it('will be shown, with delay, when fetching pages (2-n)', function () {
            var component,
                scope;

            component = getComponent('http://www.some-domain.com/with-pagination/456/', 'some-partial', false);
            scope = component.isolateScope();

            //Finish the initial request
            finishApiRequest();
            scope.$apply();

            //Fire a load more request
            scope.vm.loadMore();
            scope.$apply();

            expect(component.find('dp-loading-indicator').length).toBe(1);
            expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');
            expect(scope.vm.isLoading).toBe(true);

            expect(component.find('dp-loading-indicator').attr('use-delay')).toBe('vm.useLoadingIndicatorDelay');
            expect(scope.vm.useLoadingIndicatorDelay).toBe(true);

            //Finish the load more request
            finishApiRequest();
            scope.$apply();

            expect(scope.vm.isLoading).toBe(false);
        });
    });
});