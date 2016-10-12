describe('The atlas-scrollable-content directive', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getDirective (visibility, pageName) {
        var directive,
            element,
            scope,
            i,
            paragraph;

        element = document.createElement('div');
        element.setAttribute('atlas-scrollable-content', '');
        element.setAttribute('visibility', 'visibility');
        element.setAttribute('page-name', pageName || '');
        element.setAttribute('style', 'height: 100px; overflow-y: scroll;');

        // Insert a lot of dummy content to enable scrolling
        for (i = 0; i < 100; i++) {
            paragraph = document.createElement('p');
            paragraph.innerText = 'I am a paragraph.';

            element.appendChild(paragraph);
        }

        scope = $rootScope.$new();
        scope.visibility = visibility;

        directive = $compile(element)(scope);
        scope.$apply();

        document.body.appendChild(element);

        return directive;
    }

    it('resets the scrollTop property whenever the active component changes', function () {
        var directive,
            scope,
            visibility;

        visibility = {
            page: false,
            detail: true,
            searchResults: false,
            dataSelection: false
        };

        directive = getDirective(visibility);
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Show another component
        scope = directive.isolateScope();
        scope.visibility.detail = false;
        scope.visibility.page = true;
        scope.pageName = 'home';
        scope.$apply();

        // Make sure the scrollTop has been reset
        expect(directive[0].scrollTop).toBe(0);
    });

    it('resets the scrollTop property when navigating between pages', function () {
        var directive,
            scope,
            visibility;

        visibility = {
            page: true,
            detail: false,
            searchResults: false,
            dataSelection: false
        };

        // Open the 'home' page
        directive = getDirective(visibility, 'home');
        expect(directive[0].scrollTop).toBe(0);

        // Now scroll down
        directive[0].scrollTop = 100;

        // Open the 'about-us' page
        scope = directive.isolateScope();
        scope.pageName = 'about-us';
        scope.$apply();

        // Make sure the scrollTop has been reset
        expect(directive[0].scrollTop).toBe(0);
    });
});
