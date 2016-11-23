describe('The http-status component', function () {
    let httpStatus;

    beforeEach(function () {
        angular.mock.module('dpShared');

        angular.mock.inject(function (_httpStatus_) {
            httpStatus = _httpStatus_;
        });
    });

    it('is able to register any http errors', function () {
        httpStatus.registerError();
        expect(httpStatus.getStatus().hasErrors).toBe(true);
    });

    it('defaults to error type SERVER when no error type is given', function () {
        httpStatus.registerError();
        expect(httpStatus.getStatus()[httpStatus.SERVER_ERROR]).toBe(true);
        expect(httpStatus.getStatus()[httpStatus.NOT_FOUND_ERROR]).toBe(false);
    });

    it('sets the error type given', function () {
        httpStatus.registerError(httpStatus.NOT_FOUND_ERROR);
        expect(httpStatus.getStatus()[httpStatus.SERVER_ERROR]).toBe(false);
        expect(httpStatus.getStatus()[httpStatus.NOT_FOUND_ERROR]).toBe(true);
    });

    it('silently defaults to error type SERVER when an erroneous error type is given', function () {
        httpStatus.registerError('FAULTY_ERROR_TYPE');
        expect(httpStatus.getStatus()[httpStatus.SERVER_ERROR]).toBe(true);
        expect(httpStatus.getStatus()[httpStatus.NOT_FOUND_ERROR]).toBe(false);
    });

    it('is able to register multiple http errors', function () {
        [1, 2, 3, 4, 5].forEach(() => httpStatus.registerError());
        expect(httpStatus.getStatus().hasErrors).toBe(true);
    });

    it('is able to register multiple http errors of different types', function () {
        [
            httpStatus.SERVER_ERROR,
            httpStatus.SERVER_ERROR,
            httpStatus.NOT_FOUND_ERROR,
            httpStatus.SERVER_ERROR
        ].forEach(
            type => httpStatus.registerError(type));

        expect(httpStatus.getStatus()[httpStatus.SERVER_ERROR]).toBe(true);
        expect(httpStatus.getStatus()[httpStatus.NOT_FOUND_ERROR]).toBe(true);
    });

    it('shows nothing when nothing has happened', function () {
        expect(httpStatus.getStatus().hasErrors).toBe(false);
    });

    it('resets the error flags when hasErrors has been set to false', function () {
        httpStatus.registerError(httpStatus.NOT_FOUND_ERROR);
        httpStatus.getStatus().hasErrors = false;
        httpStatus.registerError(httpStatus.SERVER_ERROR);

        expect(httpStatus.getStatus()[httpStatus.SERVER_ERROR]).toBe(true);
        expect(httpStatus.getStatus()[httpStatus.NOT_FOUND_ERROR]).toBe(false);
    });
});
