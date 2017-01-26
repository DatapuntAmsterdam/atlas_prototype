describe('The dp-data-selection-header', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS,
        component,
        mockedViewInput,
        mockedInputTable,
        mockedInputList,
        mockedInputCards;

    beforeEach(() => {
        angular.mock.module(
            'dpDataSelection',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    options: {
                        MAX_NUMBER_OF_CLUSTERED_MARKERS: 1000
                    },
                    datasets: {
                        bag: {
                            MAX_AVAILABLE_PAGES: 50,
                            TITLE: 'BAG Adressen'
                        },
                        hr: {
                            MAX_AVAILABLE_PAGES: 50,
                            TITLE: 'HR Vestigingen'
                        },
                        catalogus: {
                            MAX_AVAILABLE_PAGES: 50
                        }
                    }
                });

                $provide.factory('dpDataSelectionToggleViewButtonDirective', () => {
                    return {};
                });

                $provide.factory('dpDataSelectionDownloadButtonDirective', () => {
                    return {};
                });

                $provide.factory('dpDataSelectionActiveFiltersDirective', () => {
                    return {};
                });

                $provide.factory('dpLoadingIndicatorDirective', () => {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedInputTable = {
            state: {
                dataset: 'bag',
                view: 'TABLE',
                filters: {
                    fake_filter: 'abc'
                }
            },
            numberOfRecords: null,
            isLoading: true
        };

        mockedInputList = {
            state: {
                dataset: 'hr',
                view: 'LIST',
                filters: {
                    fake_filter: 'abc'
                }
            },
            numberOfRecords: null,
            isLoading: true
        };

        mockedInputCards = {
            state: {
                dataset: 'catalogus',
                view: 'CARDS',
                filters: {
                    fake_filter: 'abc'
                },
                page: 1
            },
            numberOfRecords: null,
            isLoading: true
        };

        spyOn(store, 'dispatch');
    });

    function getComponent (mockedInput) {
        let compiledComponent,
            element,
            scope;

        element = document.createElement('dp-data-selection-header');
        element.setAttribute('state', 'state');
        element.setAttribute('available-filters', 'availableFilters');
        element.setAttribute('number-of-records', 'numberOfRecords');
        element.setAttribute('is-loading', 'isLoading');

        scope = $rootScope.$new();
        scope.state = mockedInput.state;
        scope.availableFilters = {};
        scope.numberOfRecords = mockedInput.numberOfRecords;
        scope.isLoading = mockedInput.isLoading;

        compiledComponent = $compile(element)(scope);
        scope.$apply();

        return compiledComponent;
    }

    describe('The buttons (download and toggle view) are only available in TABLE and LIST view', () => {
        it('is only visible in TABLE view when the loading is done', () => {
            // When loading
            mockedInputTable.isLoading = true;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-buttons').length).toBe(0);

            // When loading is finished
            mockedInputTable.isLoading = false;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-buttons').length).toBe(1);
        });

        it('is always visible in LIST view', () => {
            // When loading
            mockedInputList.isLoading = true;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-buttons').length).toBe(1);

            // When loading is finished
            mockedInputList.isLoading = false;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-buttons').length).toBe(1);
        });

        it('is never visible in CARDS view', () => {
            // When loading
            mockedInputCards.isLoading = true;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-buttons').length).toBe(0);

            // When loading is finished
            mockedInputCards.isLoading = false;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-buttons').length).toBe(0);
        });
    });

    describe('the header title', function () {
        it('in TABLE view shows the name followed by the number of results', () => {
            mockedInputTable.numberOfRecords = 1234;
            mockedInputTable.isLoading = false;
            component = getComponent(mockedInputTable);

            // Avec thousand separator
            expect(component.find('.qa-title').text().trim()).toBe('BAG Adressen (1.234)');
        });

        it('in CARDS view shows the number of results followed by the word \'dataset(s)\'', () => {
            mockedInputCards.isLoading = false;

            // Singular
            mockedInputCards.numberOfRecords = 1;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-title').text().trim()).toBe('1 dataset');

            // Plural, with thousand separator
            mockedInputCards.numberOfRecords = 1234;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-title').text().trim()).toBe('1.234 datasets');
        });

        it('in LIST view shows just the string \'Resultaten\'', () => {
            // No results
            mockedInputList.numberOfRecords = 0;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-title').text().trim()).toBe('Resultaten');

            // 1 Result
            mockedInputList.numberOfRecords = 1;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-title').text().trim()).toBe('Resultaten');

            // Multiple results
            mockedInputList.numberOfRecords = 1234;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-title').text().trim()).toBe('Resultaten');
        });
    });

    it('shows the search query in the header', () => {
        // When there is a query
        mockedInputCards.state.query = 'parkeren';
        mockedInputCards.isLoading = false; // The whole header isn't shown when loading the CARDS view

        component = getComponent(mockedInputCards);
        expect(component.find('.qa-search-query').text()).toBe('met "parkeren"');

        // Without a query, there is no text message
        delete mockedInputCards.state.query;
        component = getComponent(mockedInputCards);
        expect(component.find('.qa-search-query').length).toBe(0);
    });

    ['TABLE', 'CARDS'].forEach(viewName => {
        beforeEach(function () {
            mockedViewInput = viewName === 'TABLE' ? mockedInputTable : mockedInputCards;
        });

        describe(`in ${viewName} view`, () => {
            describe('when loading', () => {
                it('potentially shows the max pages message', () => {
                    // Don't show the message
                    mockedViewInput.state.page = 50;
                    component = getComponent(mockedViewInput);
                    expect(component.find('.qa-message-max-pages').length).toBe(0);

                    // Show the message
                    mockedViewInput.state.page = 51;
                    component = getComponent(mockedViewInput);
                    expect(component.find('.qa-message-max-pages').length).toBe(1);
                });

                it('doesn\'t show the buttons, title, tabs, no results found and clustered markers message', () => {
                    component = getComponent(mockedViewInput);

                    expect(component.find('.qa-buttons').length).toBe(0);
                    expect(component.find('.qa-title').length).toBe(0);
                    expect(component.find('.qa-tabs').length).toBe(0);
                    expect(component.find('.qa-no-results-found').length).toBe(0);
                    expect(component.find('.qa-clustered-markers').length).toBe(0);
                });
            });

            describe('when the loading is finished', () => {
                beforeEach(() => {
                    mockedViewInput.numberOfRecords = 1234;
                    mockedViewInput.isLoading = false;
                });

                it('shows the title', () => {
                    component = getComponent(mockedViewInput);

                    expect(component.find('.qa-title').length).toBe(1);
                });

                it('potentially shows the no results found message (instead of the title)', function () {
                    // When there are results
                    mockedViewInput.numberOfRecords = 1;
                    component = getComponent(mockedViewInput);

                    expect(component.find('.qa-title').length).toBe(1);
                    expect(component.find('.qa-no-results-found').length).toBe(0);

                    // When there are no results
                    mockedViewInput.numberOfRecords = 0;
                    component = getComponent(mockedViewInput);

                    expect(component.find('.qa-title').length).toBe(0);
                    expect(component.find('h2.qa-no-results-found').length).toBe(1);
                    // Make sure it isn't shown as a p as well
                    expect(component.find('p.qa-no-results-found').length).toBe(0);
                });

                it('doesn\'t show tabs', function () {
                    component = getComponent(mockedViewInput);

                    expect(component.find('.qa-tabs').length).toBe(0);
                });

                it('potentially shows the max pages message', () => {
                    // Don't show the message
                    mockedViewInput.state.page = 50;
                    component = getComponent(mockedViewInput);
                    expect(component.find('.qa-message-max-pages').length).toBe(0);

                    // Show the message
                    mockedViewInput.state.page = 51;
                    component = getComponent(mockedViewInput);
                    expect(component.find('.qa-message-max-pages').length).toBe(1);
                });

                it('doesn\'t show the clustered markers message', () => {
                    mockedViewInput.numberOfRecords = 1001;
                    component = getComponent(mockedViewInput);
                    expect(component.find('.qa-message-clustered-markers').length).toBe(0);
                });
            });
        });
    });

    describe('in LIST view', () => {
        describe('when loading', () => {
            beforeEach(function () {
                mockedInputList.isLoading = true;
            });

            it('shows the buttons and title', () => {
                component = getComponent(mockedInputList);

                expect(component.find('.qa-buttons').length).toBe(1);
                expect(component.find('.qa-title').length).toBe(1);
            });

            it('shows the tabs', function () {
                component = getComponent(mockedInputList);

                expect(component.find('.qa-tabs').length).toBe(1);
            });

            it('potentially shows the max pages message', () => {
                // Don't show the message
                mockedInputList.state.page = 50;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-max-pages').length).toBe(0);

                // Show the message
                mockedInputList.state.page = 51;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-max-pages').length).toBe(1);
            });

            it('doesn\'t show the no results found and clustered markers message', () => {
                component = getComponent(mockedInputList);

                expect(component.find('.qa-no-results-found').length).toBe(0);
                expect(component.find('.qa-clustered-markers').length).toBe(0);
            });
        });

        describe('when the loading is finished', () => {
            beforeEach(function () {
                mockedInputList.isLoading = false;
            });

            it('potentially shows the no results found message', function () {
                // Don't show the message
                mockedInputList.numberOfRecords = 1234;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-no-results-found').length).toBe(0);

                // Show the message
                mockedInputList.numberOfRecords = 0;
                component = getComponent(mockedInputList);
                expect(component.find('p.qa-no-results-found').length).toBe(1);
                // Make sure it isn't shown as a h2 as well
                expect(component.find('h2.qa-no-results-found').length).toBe(0);
            });

            it('potentially shows the max pages message', () => {
                // Don't show the message
                mockedInputList.state.page = 50;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-max-pages').length).toBe(0);

                // Show the message
                mockedInputList.state.page = 51;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-max-pages').length).toBe(1);
            });

            it('potentially shows the clustered markers message', () => {
                // Don't show the message
                mockedInputList.numberOfRecords = 1000;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-clustered-markers').length).toBe(0);

                // Show the message
                mockedInputList.numberOfRecords = 1001;
                component = getComponent(mockedInputList);
                expect(component.find('.qa-message-clustered-markers').length).toBe(1);
            });
        });
    });

    it('the active filters are only shown when the loading is finished and at least one filter is active', () => {
        let mockedInput = {
            TABLE: mockedInputTable,
            LIST: mockedInputList,
            CARDS: mockedInputCards
        };

        // With one active filter
        ['TABLE', 'LIST', 'CARDS'].forEach(viewName => {
            // When loading
            mockedInput[viewName].isLoading = true;
            component = getComponent(mockedInput[viewName]);
            expect(component.find('.qa-active-filters').length).toBe(0);

            // When loading is finished
            mockedInput[viewName].isLoading = false;
            component = getComponent(mockedInput[viewName]);
            expect(component.find('.qa-active-filters').length).toBe(1);
        });

        // Without any active filter
        mockedInput.TABLE.state.filters = {};
        mockedInput.LIST.state.filters = {};
        mockedInput.CARDS.state.filters = {};

        ['TABLE', 'LIST', 'CARDS'].forEach(viewName => {
            // When loading is finished
            mockedInput[viewName].isLoading = false;
            component = getComponent(mockedInput[viewName]);
            expect(component.find('.qa-active-filters').length).toBe(0);
        });
    });

    it('the messages about MAX_PAGES and MAX_CLUSTERED_MARKERS use DATA_SELECTION_CONFIG', () => {
        mockedInputList.state.page = 51;
        mockedInputList.numberOfRecords = 1001;
        mockedInputList.isLoading = false;

        component = getComponent(mockedInputList);

        // Where 50 and 1000 are part of DATA_SELECTION_CONFIG instead of some hardcoded copied value
        expect(component.find('.qa-message-max-pages').text()).toContain('de eerste 50 pagina\'s');
        expect(component.find('.qa-message-clustered-markers').text()).toContain('niet meer dan 1.000 resultaten');
    });

    describe('the tabs in LIST view', () => {
        it('use the TITLE values from DATA_SELECTION_CONFIG', () => {
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen');
        });

        it('inactive tabs are links to the first page of other datasets', () => {
            mockedInputList.state.dataset = 'hr';
            mockedInputList.state.page = 123;
            component = getComponent(mockedInputList);

            component.find('.qa-tabs li:nth-child(1) dp-link .o-tabs__tab--link').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: jasmine.objectContaining({
                    dataset: 'bag',
                    view: 'LIST',
                    page: 1
                })
            });
        });

        it('active tabs are just text (instead of a link)', () => {
            mockedInputList.state.dataset = 'hr';
            mockedInputList.state.page = 123;
            component = getComponent(mockedInputList);
            expect(store.dispatch).not.toHaveBeenCalled();

            expect(component.find('.qa-tabs li:nth-child(2) dp-link .o-tabs__tab--text').length).toBe(0);
            expect(component.find('.qa-tabs li:nth-child(2) .o-tabs__tab--active').length).toBe(1);
        });

        it('shows the number of results in the tab heading for the active dataset', () => {
            // It only shows the title while loading
            mockedInputList.isLoading = true;
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen');

            // It shows the number of results when loading has finished for the active tab only
            mockedInputList.numberOfRecords = 12345;
            mockedInputList.isLoading = false;
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(2)').text()).toContain('HR Vestigingen');
            expect(component.find('.qa-tabs li:nth-child(2)').text()).toContain(' (12.345)');

            // When BAG is active
            mockedInputList.state.dataset = 'bag';
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text()).toContain('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(1)').text()).toContain(' (12.345)');
            expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen');
        });
    });
});
