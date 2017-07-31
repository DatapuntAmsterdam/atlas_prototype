describe('The dp-data-selection-header', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS,
        component,
        config,
        user,
        mockedViewInput,
        mockedInputTable,
        mockedInputList,
        mockedInputCards;

    beforeEach(() => {
        config = {
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
        };

        angular.mock.module(
            'dpDataSelection',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            $provide => {
                $provide.constant('DATA_SELECTION_CONFIG', config);

                $provide.factory('dpDataSelectionToggleViewButtonDirective', () => {
                    return {};
                });

                $provide.factory('dpDataSelectionDownloadButtonDirective', () => {
                    return {};
                });

                $provide.factory('dpDataSelectionActiveFiltersDirective', () => {
                    return {};
                });
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_, _user_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            user = _user_;
        });

        mockedInputTable = {
            state: {
                dataset: 'bag',
                view: 'TABLE',
                filters: {
                    fake_filter: 'abc'
                },
                geometryFilter: {
                    markers: [],
                    description: 'geometryFilter description'
                }
            },
            numberOfRecords: null,
            showHeader: true
        };

        mockedInputList = {
            state: {
                dataset: 'hr',
                view: 'LIST',
                filters: {
                    fake_filter: 'abc'
                },
                geometryFilter: {
                    markers: [],
                    description: 'geometryFilter description'
                }
            },
            numberOfRecords: null,
            showHeader: true
        };

        mockedInputCards = {
            state: {
                dataset: 'catalogus',
                view: 'CARDS',
                filters: {
                    fake_filter: 'abc'
                },
                geometryFilter: {
                    markers: [],
                    description: 'geometryFilter description'
                },
                page: 1
            },
            numberOfRecords: null,
            showHeader: true
        };

        spyOn(store, 'dispatch');
        spyOn(user, 'meetsRequiredLevel').and.returnValue(false);
    });

    function getComponent (mockedInput) {
        const element = document.createElement('dp-data-selection-header');
        element.setAttribute('state', 'state');
        element.setAttribute('available-filters', 'availableFilters');
        element.setAttribute('number-of-records', 'numberOfRecords');
        element.setAttribute('show-header', 'showHeader');

        const scope = $rootScope.$new();
        scope.state = mockedInput.state;
        scope.availableFilters = {};
        scope.numberOfRecords = mockedInput.numberOfRecords;
        scope.showHeader = mockedInput.showHeader;

        const compiledComponent = $compile(element)(scope);
        scope.$apply();

        return compiledComponent;
    }

    it('should not show the header if showHeader is not true', () => {
        mockedInputTable.showHeader = false;
        component = getComponent(mockedInputTable);
        expect(component.find('.qa-header').length).toBe(0);
    });

    describe('The buttons (download and toggle view)', () => {
        it('are available in the TABLE view', () => {
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-buttons').length).toBe(1);
        });

        it('are available in the LIST view', () => {
            component = getComponent(mockedInputList);
            expect(component.find('.qa-buttons').length).toBe(1);
        });

        it('are never available in the CARDS view', () => {
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-buttons').length).toBe(0);
        });
    });

    describe('the download button', () => {
        it('is hidden when there are no results', () => {
            mockedInputTable.numberOfRecords = 1;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(1);

            mockedInputTable.numberOfRecords = 0;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(0);
        });

        it('is hidden when in LIST view', () => {
            mockedInputTable.numberOfRecords = 1;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(1);

            component = getComponent(mockedInputList);
            expect(component.find('.qa-download-button').length).toBe(0);
        });

        it('is hidden when the authentication level is not met', () => {
            mockedInputTable.numberOfRecords = 1;
            // An authentication level is set
            config.datasets.bag.AUTH_LEVEL_EXPORT = 'EMPLOYEE';

            // But it is not met
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(0);

            // Now the authentication is met
            user.meetsRequiredLevel.and.returnValue(true);
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(1);

            // This time there are now records however
            mockedInputTable.numberOfRecords = 0;
            component = getComponent(mockedInputTable);
            expect(component.find('.qa-download-button').length).toBe(0);
        });
    });

    describe('the header title', () => {
        it('in TABLE view shows the name followed by the number of results', () => {
            mockedInputTable.numberOfRecords = 1234;
            component = getComponent(mockedInputTable);

            // Avec thousand separator
            expect(component.find('.qa-title').text()).toContain('BAG Adressen');
            expect(component.find('.qa-title').text()).toContain('(1.234)');
        });

        it('in TABLE view shows does not show the number of results when not available', () => {
            mockedInputTable.numberOfRecords = null;
            component = getComponent(mockedInputTable);

            expect(component.find('.qa-title').text().trim()).toBe('BAG Adressen');
        });

        it('in CARDS view shows the number of results followed using \'Datasets(number)\'', () => {
            // Singular
            mockedInputCards.numberOfRecords = 1;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-title').text().trim()).toBe('Datasets (1)');

            // Plural, with thousand separator
            mockedInputCards.numberOfRecords = 1234;
            component = getComponent(mockedInputCards);
            expect(component.find('.qa-title').text().trim()).toBe('Datasets (1.234)');
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

    ['TABLE', 'CARDS'].forEach(viewName => {
        beforeEach(() => {
            mockedViewInput = viewName === 'TABLE' ? mockedInputTable : mockedInputCards;
        });

        describe(`in ${viewName} view`, () => {
            beforeEach(() => {
                mockedViewInput.numberOfRecords = 1234;
            });

            it('shows the title', () => {
                component = getComponent(mockedViewInput);

                expect(component.find('.qa-title').length).toBe(1);
            });

            it('potentially shows the no results found message', () => {
                // When there are results
                mockedViewInput.numberOfRecords = 1;
                component = getComponent(mockedViewInput);
                expect(component.find('.qa-no-results-found').length).toBe(0);

                // When there are no results
                mockedViewInput.numberOfRecords = 0;
                component = getComponent(mockedViewInput);
                expect(component.find('.qa-no-results-found').length).toBe(1);
            });

            it('doesn\'t show tabs', () => {
                component = getComponent(mockedViewInput);

                expect(component.find('.qa-tabs').length).toBe(0);
            });
        });
    });

    describe('in LIST view', () => {
        it('shows the buttons and title', () => {
            component = getComponent(mockedInputList);

            expect(component.find('.qa-buttons').length).toBe(1);
            expect(component.find('.qa-title').length).toBe(1);
        });

        it('shows the tabs', () => {
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs').length).toBe(1);
        });

        it('potentially shows the no results found message', () => {
            // Don't show the message
            mockedInputList.numberOfRecords = 1234;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-no-results-found').length).toBe(0);

            // Show the message
            mockedInputList.numberOfRecords = 0;
            component = getComponent(mockedInputList);
            expect(component.find('.qa-no-results-found').length).toBe(1);
            expect(component.find('.qa-no-results-found').text()).toContain('Tip: verwijder een of meer criteria');
        });
    });

    it('the active filters are only shown when at least one filter is active', () => {
        const mockedInput = {
            TABLE: mockedInputTable,
            LIST: mockedInputList,
            CARDS: mockedInputCards
        };

        // With one active filter
        ['TABLE', 'LIST', 'CARDS'].forEach(viewName => {
            component = getComponent(mockedInput[viewName]);
            expect(component.find('.qa-active-filters').length).toBe(1);
        });

        // Without any active filter
        mockedInput.TABLE.state.filters = {};
        mockedInput.LIST.state.filters = {};
        mockedInput.CARDS.state.filters = {};

        ['TABLE', 'LIST', 'CARDS'].forEach(viewName => {
            component = getComponent(mockedInput[viewName]);
            expect(component.find('.qa-active-filters').length).toBe(0);
        });
    });

    describe('the tabs in LIST view', () => {
        it('use the TITLE values from DATA_SELECTION_CONFIG', () => {
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toContain('HR Vestigingen');
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
            // It shows the number of results for the active tab only
            mockedInputList.numberOfRecords = 12345;
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

        it('it does not show the number of results in the tab heading when not available', () => {
            mockedInputList.numberOfRecords = null;
            component = getComponent(mockedInputList);

            expect(component.find('.qa-tabs li:nth-child(1)').text().trim()).toBe('BAG Adressen');
            expect(component.find('.qa-tabs li:nth-child(2)').text().trim()).toBe('HR Vestigingen');
        });
    });
});
