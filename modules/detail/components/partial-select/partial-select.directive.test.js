describe('The atlas-partial-select directive', function () {
    var $compile,
        $rootScope,
        $q,
        partialCompiler,
        api;

    beforeEach(function () {
        angular.mock.module(
            'atlasDetail',
            {
                partialCompiler: {
                    getHtml: function () {
                        var q = $q.defer(),
                            html;

                        html = document.createElement('div');
                        html.innerText = 'This is a compiled template!';

                        q.resolve(html);

                        return q.promise;
                    }
                },
                api: {
                    getByUrl: function () {
                        var q = $q.defer();

                        q.resolve({
                            _links: {
                                next: {
                                    href: 'http://www.fake-domain.com/something?page=2'
                                }
                            },
                            results: ['ITEM_D', 'ITEM_E', 'ITEM_F']
                        });

                        return q.promise;
                    }
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_, _partialCompiler_, _api_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            partialCompiler = _partialCompiler_;
            api = _api_;
        });

        spyOn(partialCompiler, 'getHtml').and.callThrough();
        spyOn(api, 'getByUrl').and.callThrough();
    });

    function getDirective (apiData, partial, loadMoreFn) {
        var directive,
            element,
            scope;

        element = document.createElement('atlas-partial-select');
        element.setAttribute('api-data', 'apiData');
        element.setAttribute('partial', partial);
        element.setAttribute('load-more-fn', 'loadMoreFn');

        scope = $rootScope.$new();
        scope.apiData = apiData;
        scope.loadMoreFn = loadMoreFn;

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('it retrieves the rendered template from partial-compiler based on the partial', function () {
        var directive = getDirective({foo: 'FAKE_API_DATA_A'}, 'my-template');

        expect(partialCompiler.getHtml).toHaveBeenCalledWith(
            'modules/detail/components/partial-select/partials/my-template.html',
            jasmine.any(Object) // This is a Angular scope
        );

        expect(directive.find('div')[0].outerHTML).toBe('<div>This is a compiled template!</div>');
    });

    it('puts a load more function on the scope', function () {
        var directive,
            scope,
            hasMockedLoadMoreFunctionBeenCalled = false;

        function mockedLoadMoreFunction () {
            hasMockedLoadMoreFunctionBeenCalled = true;
        }

        directive = getDirective({foo: 'FAKE_API_DATA_A'}, 'my-template', mockedLoadMoreFunction);
        scope = directive.isolateScope();

        expect(hasMockedLoadMoreFunctionBeenCalled).toBe(false);
        scope.loadMore();
        expect(hasMockedLoadMoreFunctionBeenCalled).toBe(true);
    });
});
