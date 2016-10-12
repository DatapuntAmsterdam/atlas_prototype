describe('The dpUppercaseFirstLetter filter', function () {
    var atlasUppercaseFirstLetter;

    beforeEach(function () {
        angular.mock.module('atlasDetail');

        angular.mock.inject(function (_atlasUppercaseFirstLetterFilter_) {
            atlasUppercaseFirstLetter = _atlasUppercaseFirstLetterFilter_;
        });
    });

    it('makes the first character uppercase', function () {
        expect(atlasUppercaseFirstLetter('atlas')).toBe('Atlas');
        expect(atlasUppercaseFirstLetter('Atlas')).toBe('Atlas');
    });

    it('doesn\'t change the rest of the string', function () {
        expect(atlasUppercaseFirstLetter('aTLAS')).toBe('ATLAS');
        expect(atlasUppercaseFirstLetter('ATLAS')).toBe('ATLAS');
        expect(atlasUppercaseFirstLetter('atlas Atlas')).toBe('Atlas Atlas');
    });
});
