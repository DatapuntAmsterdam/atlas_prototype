describe('The dp-current-date directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module('dpDetail');

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    afterEach(function () {
        // Reset the mocked date
        jasmine.clock().uninstall();
    });

    function getDirective () {
        var directive,
            element,
            scope;

        element = document.createElement('dp-current-date');
        scope = $rootScope.$new();

        directive = $compile(element)(scope);
        scope.$apply();

        return directive;
    }

    it('displays and formats the current date', function () {
        var directive,
            mockedDate;

        mockedDate = new Date(2016, 11, 25);
        jasmine.clock().mockDate(mockedDate);

        directive = getDirective();
        expect(directive.text()).toBe('25-12-2016');
    });

    it('adds leading zeros to the days and months', function () {
        var directive,
            mockedDate;

        mockedDate = new Date(1982, 8, 7);
        jasmine.clock().mockDate(mockedDate);

        directive = getDirective();

        expect(directive.text()).toBe('07-09-1982');
    });
});
