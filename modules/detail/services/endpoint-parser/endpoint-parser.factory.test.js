describe('The endpointParser factory', function () {
    var endpointParser;

    beforeEach(function () {
        angular.mock.module(
            'atlasDetail',
            {
                environment: {
                    API_ROOT: 'http://www.api-root.com/'
                }
            }
        );

        angular.mock.inject(function (_endpointParser_) {
            endpointParser = _endpointParser_;
        });
    });

    it('the getTemplateUrl function returns an template URL based on an endpoint', function () {
        expect(endpointParser.getTemplateUrl('http://www.api-root.com/bag/nummeraanduiding/123456/'))
            .toBe('modules/detail/components/detail/templates/bag/nummeraanduiding.html');

        expect(endpointParser.getTemplateUrl('http://www.api-root.com/brk/object/789/'))
            .toBe('modules/detail/components/detail/templates/brk/object.html');

        expect(endpointParser.getTemplateUrl('http://www.api-root.com/meetbouten/meetbout/654/'))
            .toBe('modules/detail/components/detail/templates/meetbouten/meetbout.html');
    });

    it('getTemplateUrl has special exceptions for zakelijk recht (BRK)', function () {
        expect(endpointParser.getTemplateUrl('http://www.api-root.com/brk/zakelijk-recht/some-id-with-numbers-123456/' +
            'subject/')).toBe('modules/detail/components/detail/templates/brk/subject.html');
    });
});
