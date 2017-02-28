describe('The detail page of kadastrale subjecten', () => {
    it('doesn\'t show anything for users with the DEFAULT role', () => {
        dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK_PERSOON', 'DEFAULT');
        expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
        expect(detail.kadastraalSubject.glossaryHeader.title).toBe('Erik Niels Nijland');
    });

    it('shows everything except rechten for users with the EMPLOYEE role', () => {

    });

    it('shows everything including the rechten for users with the EMPLOYEE_PLUS role', () => {

    });
});
