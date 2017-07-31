describe('The angleConversion service', () => {
    var angleConversion;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject(_angleConversion_ => {
            angleConversion = _angleConversion_;
        });
    });

    it('can convert degrees to radians', () => {
        expect(angleConversion.degreesToRadians(0).toFixed(2)).toBe('0.00');
        expect(angleConversion.degreesToRadians(45).toFixed(2)).toBe('0.79');
        expect(angleConversion.degreesToRadians(50).toFixed(2)).toBe('0.87');
        expect(angleConversion.degreesToRadians(270).toFixed(2)).toBe('4.71');
        expect(angleConversion.degreesToRadians(360).toFixed(2)).toBe('6.28');
        expect(angleConversion.degreesToRadians(361).toFixed(2)).toBe('6.30');
    });

    it('can convert radians to degrees', () => {
        expect(angleConversion.radiansToDegrees(0).toFixed(2)).toBe('0.00');
        expect(angleConversion.radiansToDegrees(1).toFixed(2)).toBe('57.30');
        expect(angleConversion.radiansToDegrees(2).toFixed(2)).toBe('114.59');
        expect(angleConversion.radiansToDegrees(6).toFixed(2)).toBe('343.77');
        expect(angleConversion.radiansToDegrees(7).toFixed(2)).toBe('401.07');
    });
});
