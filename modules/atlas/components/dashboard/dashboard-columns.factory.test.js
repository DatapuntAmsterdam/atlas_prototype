describe('The dashboardColumns factory', function () {
    var dashboardColumns,
        mockedState,
        visibility,
        columnSizes;

    beforeEach(function () {
        let DEFAULT_STATE = {
            map: {
                baseLayer: 'topografie',
                overlays: [],
                viewCenter: [52.3719, 4.9012],
                zoom: 9,
                showActiveOverlays: false,
                isFullscreen: false,
                isLoading: false
            },
            layerSelection: {
                isEnabled: false
            },
            search: null,
            page: {
                name: 'home'
            },
            detail: null,
            straatbeeld: null,
            dataSelection: null,
            atlas: {
                isPrintMode: false
            }
        };

        angular.mock.module('atlas');

        angular.mock.inject(function (_dashboardColumns_) {
            dashboardColumns = _dashboardColumns_;
            mockedState = angular.copy(DEFAULT_STATE);
        });
    });

    describe('when determining component activity', function () {
        it('the map is always active, regardless of input', function () {
            let activity;

            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.map).toBe(true);

            delete mockedState.map;
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.map).toBe(true);
        });

        it('checks if map.layerSelection is true in the state', function () {
            let activity;

            mockedState.layerSelection.isEnabled = true;
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.layerSelection).toBe(true);

            mockedState.layerSelection.isEnabled = false;
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.layerSelection).toBe(false);
        });

        it('checks if page is a string', function () {
            let activity;

            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.page).toBe(true);

            mockedState.page.name = null;
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.page).toBe(false);
        });

        it('checks if search, detail, straatbeeld and dataSelection are objects', function () {
            let activity;

            // Search
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.searchResults).toBe(false);

            mockedState.search = {query: 'lekker zoeken'};
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.searchResults).toBe(true);

            // Detail
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.detail).toBe(false);

            mockedState.detail = {endpoint: 'https://blah/123'};
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.detail).toBe(true);

            // Straatbeeld
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.straatbeeld).toBe(false);

            mockedState.straatbeeld = {id: 'abc123'};
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.straatbeeld).toBe(true);

            // Data selection
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.dataSelection).toBe(false);

            mockedState.dataSelection = {dataset: 'bag'};
            activity = dashboardColumns.determineActivity(mockedState);
            expect(activity.dataSelection).toBe(true);
        });
    });

    describe('when visiting a page', function () {
        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map and page visibile', function () {
                expect(visibility.map).toBe(true);
                expect(visibility.page).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the page visibile', function () {
                expect(visibility.page).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.map).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 0/3, right column 3/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(12);
            });
        });
    });

    ['query', 'location'].forEach(function (searchInput) {
        describe('when searching by ' + searchInput, function () {
            beforeEach(function () {
                mockedState.page.name = null;

                if (searchInput === 'query') {
                    mockedState.search = {
                        query: 'this is a search query',
                        location: null
                    };
                } else {
                    mockedState.search = {
                        query: null,
                        location: [52.123, 4789]
                    };
                }
            });

            describe('the default non-print version', function () {
                beforeEach(function () {
                    mockedState.atlas.isPrintMode = false;

                    visibility = dashboardColumns.determineVisibility(mockedState);
                    columnSizes = dashboardColumns.determineColumnSizes(mockedState);
                });

                it('makes the map and searchResults visibile', function () {
                    expect(visibility.map).toBe(true);
                    expect(visibility.searchResults).toBe(true);

                    expect(visibility.layerSelection).toBe(false);
                    expect(visibility.detail).toBe(false);
                    expect(visibility.page).toBe(false);
                    expect(visibility.straatbeeld).toBe(false);
                    expect(visibility.dataSelection).toBe(false);
                });

                it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                    expect(columnSizes.left).toBe(0);
                    expect(columnSizes.middle).toBe(4);
                    expect(columnSizes.right).toBe(8);
                });
            });

            describe('the print version', function () {
                beforeEach(function () {
                    mockedState.atlas.isPrintMode = true;

                    visibility = dashboardColumns.determineVisibility(mockedState);
                    columnSizes = dashboardColumns.determineColumnSizes(mockedState);
                });

                it('makes the searchResults visibile', function () {
                    expect(visibility.searchResults).toBe(true);

                    expect(visibility.layerSelection).toBe(false);
                    expect(visibility.detail).toBe(false);
                    expect(visibility.map).toBe(false);
                    expect(visibility.page).toBe(false);
                    expect(visibility.straatbeeld).toBe(false);
                    expect(visibility.dataSelection).toBe(false);
                });

                it('left column: 0/3, middle column: 0/3, right column 3/3', function () {
                    expect(columnSizes.left).toBe(0);
                    expect(columnSizes.middle).toBe(0);
                    expect(columnSizes.right).toBe(12);
                });
            });
        });
    });

    describe('when visiting a detail page', function () {
        beforeEach(function () {
            mockedState.detail = {
                geometry: {fake: 'GEOMETRY'}
            };
            mockedState.page.name = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map and detail page visibile', function () {
                expect(visibility.map).toBe(true);
                expect(visibility.detail).toBe(true);

                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });

            it('can be shown fullscreen', function () {
                mockedState.detail.isFullscreen = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);

                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(12);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;
            });

            it('makes the map and detail page visibile', function () {
                visibility = dashboardColumns.determineVisibility(mockedState);

                expect(visibility.map).toBe(true);
                expect(visibility.detail).toBe(true);

                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 3/3, right column 3/3', function () {
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);

                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(12);
                expect(columnSizes.right).toBe(12);
            });

            it('doesn\'t show the map when there is no geometry', function () {
                mockedState.detail.geometry = null;

                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.map).toBe(false);
            });
        });
    });

    describe('when visiting straatbeeld', function () {
        beforeEach(function () {
            mockedState.straatbeeld = {id: 'xyz'};
            mockedState.page.name = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map and straatbeeld visibile', function () {
                expect(visibility.map).toBe(true);
                expect(visibility.straatbeeld).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('detail and straatbeeld can\'t be visible at the same time', function () {
                // Only straatbeeld is active
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(true);
                expect(visibility.detail).toBe(false);

                // Only detail is active
                mockedState.detail = {
                    endpoint: 'whatever'
                };
                delete mockedState.straatbeeld;
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.detail).toBe(true);

                // Both straatbeeld and detail are active
                mockedState.straatbeeld = {id: 'xyz'};
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(true);
                expect(visibility.detail).toBe(false);
            });

            it('has the straatbeeld visibile when it has an id', function () {
                mockedState.straatbeeld = {id: '123'};
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(true);
            });

            it('has the straatbeeld visibile when it has a location', function () {
                mockedState.straatbeeld = {location: [1, 5]};
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(true);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });

            it('can be shown fullscreen', function () {
                mockedState.straatbeeld.isFullscreen = true;

                columnSizes = dashboardColumns.determineColumnSizes(mockedState);

                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(12);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map and straatbeeld visibile', function () {
                expect(visibility.map).toBe(true);
                expect(visibility.straatbeeld).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 3/3, right column 3/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(12);
                expect(columnSizes.right).toBe(12);
            });
        });
    });

    describe('when using layer selection', function () {
        beforeEach(function () {
            mockedState.detail = {
                uri: 'blah/blah/123',
                isLoading: false
            };
            mockedState.layerSelection.isEnabled = true;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the layerSelection and map visibile', function () {
                expect(visibility.layerSelection).toBe(true);
                expect(visibility.map).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 1/3, middle column: 2/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(4);
                expect(columnSizes.middle).toBe(8);
                expect(columnSizes.right).toBe(0);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the layerSelection visibile', function () {
                expect(visibility.layerSelection).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.map).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 2/3, middle column: 1/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(12);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(0);
            });
        });
    });

    describe('when using a fullscreen map', function () {
        beforeEach(function () {
            mockedState.map.isFullscreen = true;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map visibile', function () {
                expect(visibility.map).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 3/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(12);
                expect(columnSizes.right).toBe(0);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the map visibile', function () {
                expect(visibility.map).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 0/3, middle column: 3/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(12);
                expect(columnSizes.right).toBe(0);
            });
        });
    });

    describe('when using layer selection while using a fullscreen map', function () {
        beforeEach(function () {
            mockedState.detail = {
                uri: 'blah/blah/123',
                isLoading: false
            };
            mockedState.layerSelection.isEnabled = true;
            mockedState.map.isFullscreen = true;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the layerSelection and map visibile', function () {
                expect(visibility.layerSelection).toBe(true);
                expect(visibility.map).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 1/3, middle column: 2/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(4);
                expect(columnSizes.middle).toBe(8);
                expect(columnSizes.right).toBe(0);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('makes the layerSelection visibile', function () {
                expect(visibility.layerSelection).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.map).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.dataSelection).toBe(false);
            });

            it('left column: 2/3, middle column: 1/3, right column 0/3', function () {
                expect(columnSizes.left).toBe(12);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(0);
            });
        });
    });

    describe('when visiting dataSelection', function () {
        beforeEach(function () {
            mockedState.dataSelection = {
                view: 'TABLE',
                isFullscreen: true,
                dataset: 'bag',
                filters: {
                    buurt: 'Trompbuurt'
                },
                page: 7
            };

            mockedState.page.name = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('only shows dataSelection', function () {
                expect(visibility.dataSelection).toBe(true);

                expect(visibility.map).toBe(false);
                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
            });

            it('left column: 0/3, middle column: 0/3, right column 3/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(12);
            });
        });

        describe('the list view version', function () {
            beforeEach(function () {
                mockedState.dataSelection.view = 'LIST';
                mockedState.dataSelection.isFullscreen = false;

                visibility = dashboardColumns.determineVisibility(mockedState);

                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('shows dataSelectionList and map', function () {
                expect(visibility.dataSelection).toBe(true);
                expect(visibility.map).toBe(true);

                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.atlas.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState);
            });

            it('only shows dataSelection', function () {
                expect(visibility.dataSelection).toBe(true);

                expect(visibility.map).toBe(false);
                expect(visibility.detail).toBe(false);
                expect(visibility.layerSelection).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.straatbeeld).toBe(false);
            });

            it('left column: 0/3, middle column: 0/3, right column 3/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(0);
                expect(columnSizes.right).toBe(12);
            });
        });
    });
});
