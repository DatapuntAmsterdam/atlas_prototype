describe('The dashboardColumns factory', function () {
    var dashboardColumns,
        mockedState,
        visibility,
        columnSizes;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_dashboardColumns_, _DEFAULT_STATE_) {
            dashboardColumns = _dashboardColumns_;
            mockedState = angular.copy(_DEFAULT_STATE_);
        });
    });

    describe('when visiting a page', function () {
        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(visibility, false, false);
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
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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
                mockedState.page = null;

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
                    mockedState.isPrintMode = false;

                    visibility = dashboardColumns.determineVisibility(mockedState);
                    columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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
                    mockedState.isPrintMode = true;

                    visibility = dashboardColumns.determineVisibility(mockedState);
                    columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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
            mockedState.page = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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

            it('hides the straatbeeld page when the straatbeeld is set invisible', function () {
                mockedState.straatbeeld = {
                    id: 'aap',
                    isInvisible: true
                };
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(false);
            });

            it('hides the detail page when the detail is set invisible', function () {
                mockedState.detail = {
                    endpoint: [1, 2],
                    isInvisible: true
                };
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.detail).toBe(false);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = true;
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
                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);

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
            mockedState.page = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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

            it('has the straatbeeld solely visibile when it is fullscreen', function () {
                mockedState.straatbeeld = {location: [1, 5], isFullscreen: true};
                visibility = dashboardColumns.determineVisibility(mockedState);
                expect(visibility.straatbeeld).toBe(true);
                expect(visibility.detail).toBe(false);
                expect(visibility.page).toBe(false);
                expect(visibility.searchResults).toBe(false);
                expect(visibility.map).toBe(false);
            });

            it('left column: 0/3, middle column: 1/3, right column 2/3', function () {
                expect(columnSizes.left).toBe(0);
                expect(columnSizes.middle).toBe(4);
                expect(columnSizes.right).toBe(8);
            });
        });

        describe('the print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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
            mockedState.layerSelection = true;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, true, false);
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
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, true, true);
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
            mockedState.layerSelection = true;
            mockedState.map.isFullscreen = true;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);
                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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

            mockedState.page = null;
        });

        describe('the default non-print version', function () {
            beforeEach(function () {
                mockedState.isPrintMode = false;

                visibility = dashboardColumns.determineVisibility(mockedState);

                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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

                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, false);
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
                mockedState.isPrintMode = true;

                visibility = dashboardColumns.determineVisibility(mockedState);

                columnSizes = dashboardColumns.determineColumnSizes(mockedState, visibility, false, true);
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
