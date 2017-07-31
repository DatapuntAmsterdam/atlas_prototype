describe('The dp-bbga-graphs directive', () => {
    var $compile,
        $rootScope,
        $q,
        BBGA,
        bbgaDataService,
        fakeBbgaPersonenGraph,
        fakeBbgaHuizenGraph;

    beforeEach(() => {
        angular.mock.module(
            'dpDetail',
            $provide => {
                $provide.factory('dpBbgaTevredenheidDirective', () => ({}));
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _$q_, _BBGA_, _bbgaDataService_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            BBGA = _BBGA_;
            bbgaDataService = _bbgaDataService_;
        });

        fakeBbgaPersonenGraph = {
            create: function () {}
        };

        fakeBbgaHuizenGraph = {
            create: function () {}
        };

        spyOn(bbgaDataService, 'getGraphData').and.callFake(graphName => {
            var q = $q.defer();

            if (graphName === 'PERSONEN') {
                q.resolve('fakePersonenData');
            } else {
                q.resolve('fakeHuizenData');
            }

            return q.promise;
        });

        spyOn(BBGA, 'Personen').and.returnValue(fakeBbgaPersonenGraph);
        spyOn(BBGA, 'Huizen').and.returnValue(fakeBbgaHuizenGraph);

        spyOn(fakeBbgaPersonenGraph, 'create').and.callThrough();
        spyOn(fakeBbgaHuizenGraph, 'create').and.callThrough();
    });

    function getDirective (heading, code) {
        var directive,
            element,
            scope;

        element = document.createElement('dp-bbga-graphs');
        element.setAttribute('gebied-heading', heading);
        element.setAttribute('gebied-code', code);

        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('loads two third party visualisations', () => {
        var directive,
            personenDomElement,
            huizenDomElement;

        directive = getDirective('Haveneiland Noordoost', 'M35f');
        personenDomElement = directive[0].querySelector('.js-personen-graph');
        huizenDomElement = directive[0].querySelector('.js-huizen-graph');

        expect(fakeBbgaPersonenGraph.create).toHaveBeenCalledWith(personenDomElement, 'fakePersonenData');
        expect(fakeBbgaHuizenGraph.create).toHaveBeenCalledWith(huizenDomElement, 'fakeHuizenData');
    });

    it('retrieves data for each visualisation based on the gebied-heading and gebied-code', () => {
        getDirective('Haveneiland Noordoost', 'M35f');

        expect(bbgaDataService.getGraphData).toHaveBeenCalledTimes(2);
        expect(bbgaDataService.getGraphData).toHaveBeenCalledWith('PERSONEN', 'Haveneiland Noordoost', 'M35f');
        expect(bbgaDataService.getGraphData).toHaveBeenCalledWith('HUIZEN', 'Haveneiland Noordoost', 'M35f');
    });
});
