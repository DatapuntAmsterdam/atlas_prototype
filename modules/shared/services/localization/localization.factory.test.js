describe('The localization service', () => {
    let localization,
        originalIntl;

    beforeEach(() => {
        angular.mock.module('dpShared');

        angular.mock.inject(_localization_ => {
            localization = _localization_;
        });

        // original function automatically restored by jasmine after spec completion
        spyOn(Number.prototype, 'toLocaleString');
    });

    // Store and restore window object so it can be mocked in test
    beforeEach(() => {
        originalIntl = window.Intl; // eslint-disable-line angular/window-service
    });

    afterEach(() => {
        window.Intl = originalIntl; // eslint-disable-line angular/window-service
    });

    describe('toLocaleString', () => {
        it('calls Number.prototype.toLocalString', () => {
            window.Intl = { NumberFormat: () => {} }; // eslint-disable-line angular/window-service

            const options = { foo: 'bar' };
            localization.toLocaleString(1.2, 'nl-NL', options);

            expect(Number.prototype.toLocaleString).toHaveBeenCalledWith('nl-NL', options);
        });

        it('simply returns the number if toLocaleString does not support arguments', () => {
            const options = { foo: 'bar' };
            expect(localization.toLocaleString(1.2, 'nl-NL', options)).toBe(1.2);

            expect(Number.prototype.toLocaleString).not.toHaveBeenCalled();
        });
    });
});
