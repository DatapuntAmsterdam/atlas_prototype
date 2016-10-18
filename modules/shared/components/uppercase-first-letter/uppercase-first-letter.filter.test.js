describe('The dpUppercaseFirstLetter filter', function () {
    var dpUppercaseFirstLetter;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                detailConfig: {
                    STRAATBEELD_THUMB_URL: 'http://fake.straatbeeld.url/path/'
                },
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_dpUppercaseFirstLetterFilter_) {
            dpUppercaseFirstLetter = _dpUppercaseFirstLetterFilter_;
        });
    });

    it('makes the first character uppercase', function () {
        expect(dpUppercaseFirstLetter('atlas')).toBe('Atlas');
        expect(dpUppercaseFirstLetter('Atlas')).toBe('Atlas');
    });

    it('doesn\'t change the rest of the string', function () {
        expect(dpUppercaseFirstLetter('aTLAS')).toBe('ATLAS');
        expect(dpUppercaseFirstLetter('ATLAS')).toBe('ATLAS');
        expect(dpUppercaseFirstLetter('atlas Atlas')).toBe('Atlas Atlas');
    });
});
