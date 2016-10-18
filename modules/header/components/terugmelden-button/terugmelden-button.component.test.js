describe('The dp-terugmelden-button component', function () {
    var $compile,
        $rootScope,
        $location,
        currentUrl = 'http://www.example.com/path/filename.html?foo=bar#baz';

    beforeEach(function () {
        angular.mock.module('dpHeader');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$location_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $location = _$location_;
        });

        spyOn($location, 'absUrl').and.returnValue(currentUrl);
    });

    function getComponent (transcludeStr) {
        var component,
            element,
            scope;

        element = document.createElement('dp-terugmelden-button');

        if (angular.isString(transcludeStr)) {
            element.innerHTML = transcludeStr;
        }

        scope = $rootScope.$new();
        component = $compile(element)(scope);
        scope.$digest();

        return component;
    }

    it('sets a mailto URL', function () {
        var component = getComponent();

        expect(component.find('a').attr('href'))
            .toBe('mailto:terugmelding.basisinformatie@amsterdam.nl?subject=Terugmelding%20atlas.amsterdam.nl&body=Te' +
                'rugmeldingen%20voor%20de%20pagina%3A%20http%3A%2F%2Fwww.example.com%2Fpath%2Ffilename.html%3Ffoo%3Db' +
                'ar%23baz%0A%0ABeschrijf%20zo%20volledig%20mogelijk%20van%20welk%20onjuist%20gegeven%20je%20een%20mel' +
                'ding%20wilt%20maken%3A%0A-%20Welk%20gegeven%20is%20kennelijk%20onjuist%20of%20ontbreekt%3F%0A-%20Wee' +
                't%20je%20wat%20het%20wel%20zou%20moeten%20zijn%3F%0A-%20Waarop%20is%20jouw%20constatering%20gebaseer' +
                'd%3F%20Omschrijf%20de%20reden%20en%20voeg%20indien%20mogelijk%20relevante%20documenten%20in%20de%20b' +
                'ijlage%20toe%20(bijvoorbeeld%3A%20een%20bouwtekening%2C%20koopakte%2C%20et%20cetera).');
    });

    it('has transclude enabled', function () {
        var htmlStr = '<p id="unit-test-selector">This will be transcluded!</p>';

        expect(getComponent(htmlStr).find('p[id="unit-test-selector"]').text()).toBe('This will be transcluded!');
    });
});
