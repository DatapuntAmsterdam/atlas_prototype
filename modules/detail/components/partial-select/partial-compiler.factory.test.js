describe('The partialCompiler factory', function () {
    var $rootScope,
        $templateCache,
        partialCompiler;

    beforeEach(function () {
        angular.mock.module('atlasDetail');

        angular.mock.inject(function (_$rootScope_, _$templateCache_, _partialCompiler_) {
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
            partialCompiler = _partialCompiler_;
        });

        $templateCache.put('basic-template.html', '<p>First paragraph</p><p>Second paragraph</p>');
        $templateCache.put(
            'path/template-with-variables.html',
            '<h1>{{header}}</h1><p>{{paragraph}}</p>'
        );
    });

    it('gets a template based on an url and returns the HTML', function () {
        var output,
            emptyScope = $rootScope.$new();

        partialCompiler.getHtml('basic-template.html', emptyScope).then(function (_output_) {
            output = _output_;
        });

        // $templateRequest needs an extra digest cycle
        $rootScope.$apply();
        $rootScope.$apply();

        expect(output[0].outerHTML).toBe('<p class="ng-scope">First paragraph</p>');
        expect(output[1].outerHTML).toBe('<p class="ng-scope">Second paragraph</p>');
    });

    it('creates a scope and puts data on it', function () {
        var output,
            scope;

        scope = $rootScope.$new();
        scope.header = 'This is a heading';
        scope.paragraph = 'This is a paragraph.';

        partialCompiler.getHtml('path/template-with-variables.html', scope).then(function (_output_) {
            output = _output_;
        });

        // $templateRequest needs an extra digest cycle
        $rootScope.$apply();
        $rootScope.$apply();

        expect(output[0].outerHTML).toBe('<h1 class="ng-binding ng-scope">This is a heading</h1>');
        expect(output[1].outerHTML).toBe('<p class="ng-binding ng-scope">This is a paragraph.</p>');
    });
});
