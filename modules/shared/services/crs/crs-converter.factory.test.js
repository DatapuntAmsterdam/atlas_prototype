describe('The crsConverter factory', function () {
    var crsConverter;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_crsConverter_) {
            crsConverter = _crsConverter_;
        });
    });

    it('coverts an wgs84 array to an array with RD coordinates', function () {
        var output;

        // Nationaal monument, Dam
        output = crsConverter.wgs84ToRd([52.372925, 4.893168]);

        expect(output.length).toBe(2);
        expect(angular.isNumber(output[0])).toBe(true);
        expect(angular.isNumber(output[1])).toBe(true);
        expect(output[0].toFixed(2)).toBe('121356.30');
        expect(output[1].toFixed(2)).toBe('487342.36');

        // Weesperstraat 113
        output = crsConverter.wgs84ToRd([52.362922, 4.907101]);

        expect(output.length).toBe(2);
        expect(angular.isNumber(output[0])).toBe(true);
        expect(angular.isNumber(output[1])).toBe(true);
        expect(output[0].toFixed(2)).toBe('122297.75');
        expect(output[1].toFixed(2)).toBe('486223.01');
    });

    it('coverts an rd array to an array with wgs84 coordinates', function () {
        var output;

        // Nationaal monument, Dam
        output = crsConverter.rdToWgs84([121386, 487335]);

        expect(output.length).toBe(2);
        expect(angular.isNumber(output[0])).toBe(true);
        expect(angular.isNumber(output[1])).toBe(true);
        expect(output[0].toFixed(7)).toBe('52.3728607');
        expect(output[1].toFixed(7)).toBe('4.8936049');

        // Weesperstraat 113
        output = crsConverter.rdToWgs84([122295, 486219]);

        expect(output.length).toBe(2);
        expect(angular.isNumber(output[0])).toBe(true);
        expect(angular.isNumber(output[1])).toBe(true);
        expect(output[0].toFixed(7)).toBe('52.3628858');
        expect(output[1].toFixed(7)).toBe('4.9070611');
    });
});
