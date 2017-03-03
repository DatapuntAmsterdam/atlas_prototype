describe('The detail page of a beperking', () => {
    it('doesn\'t allow the PDF download for users with the DEFAULT role', () => {
        const page = dp.navigate('MAP_DETAIL--BEPERKING', 'DEFAULT');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.brondocument.glossaryHeader.subtitle).toBe('Brondocument');
        expect(detail.brondocument.descriptionList.term(3)).toBe('Documentnaam');
        expect(detail.brondocument.descriptionList.definition(3)).toBe('');
    });

    it('does allow the PDF download for users with a EMPLOYEE or EMPLOYEE_PLUS role', () => {
        const page = dp.navigate('MAP_DETAIL--BEPERKING', 'DEFAULT');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.brondocument.glossaryHeader.subtitle).toBe('Brondocument');
        expect(detail.brondocument.descriptionList.term(3)).toBe('Documentnaam');
        expect(detail.brondocument.descriptionList.definition(3)).toBe('DW00000120_WK01WK.pdf');
    });
});
