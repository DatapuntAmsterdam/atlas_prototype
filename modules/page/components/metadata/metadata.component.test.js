describe('The atlas-metadata component', function () {
    var $compile,
        $rootScope,
        $q,
        mockedApiData,
        finishApiCall;

    beforeEach(function () {
        angular.mock.module(
            'atlasPage',
            {
                api: {
                    getByUri: function () {
                        var q = $q.defer();

                        finishApiCall = function (data) {
                            q.resolve(data);
                            $rootScope.$apply();
                        };

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.factory('dpLoadingIndicatorDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _$q_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        });

        mockedApiData = [
            {
                group: '',
                title: 'FAKE_TITLE_1',
                update_frequency: 'FAKE_UPDATE_FREQUENCY_1',
                data_modified_date: 'FAKE_MODIFIED_DATE_1'
            }, {
                group: '',
                title: 'FAKE_TITLE_2',
                update_frequency: 'FAKE_UPDATE_FREQUENCY_2',
                data_modified_date: 'FAKE_MODIFIED_DATE_2'
            }
        ];
    });

    afterEach(function () {
        finishApiCall = null;
    });

    function getComponent () {
        var component,
            element,
            scope;

        element = document.createElement('atlas-metadata');
        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows the dp-loading-indicator while waiting for the API', function () {
        var component,
            scope;

        component = getComponent();
        scope = component.isolateScope();

        // It shows a loading indicator on initialization
        expect(component.find('dp-loading-indicator').length).toBe(1);
        expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');
        expect(scope.vm.isLoading).toBe(true);

        // It hides the loading indicator when the API is done
        finishApiCall(mockedApiData);

        expect(scope.vm.isLoading).toBe(false);
    });

    it('shows all data in a table', function () {
        var component;

        component = getComponent();
        finishApiCall(mockedApiData);

        expect(component.find('tbody tr').length).toBe(2);

        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text().trim()).toBe('FAKE_TITLE_1');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(2)').text().trim()).toBe('FAKE_UPDATE_FREQUENCY_1');
        expect(component.find('tbody tr:nth-child(1) td:nth-child(3)').text().trim()).toBe('FAKE_MODIFIED_DATE_1');

        expect(component.find('tbody tr:nth-child(2) td:nth-child(1)').text().trim()).toBe('FAKE_TITLE_2');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(2)').text().trim()).toBe('FAKE_UPDATE_FREQUENCY_2');
        expect(component.find('tbody tr:nth-child(2) td:nth-child(3)').text().trim()).toBe('FAKE_MODIFIED_DATE_2');
    });

    it('skips sources that have no title', function () {
        var component;

        delete mockedApiData[0].title;

        component = getComponent();
        finishApiCall(mockedApiData);

        expect(component.find('tbody tr').length).toBe(1);
        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text().trim()).toBe('FAKE_TITLE_2');
    });

    it('optionally adds the group in front of the title', function () {
        var component;

        mockedApiData[0].group = 'FAKE_GROUP_1';

        component = getComponent();
        finishApiCall(mockedApiData);

        expect(component.find('tbody tr:nth-child(1) td:nth-child(1)').text()).toContain('FAKE_GROUP_1');
    });
});
