fdescribe('The detail page of a verblijfsobject', () => {
    it('doesn\'t show rechten en aantekeningen voor users with the DEFAULT role', () => {
        let page = dp.navigate('MAP_DETAIL--VERBLIJFSOBJECT-ZR-GB-A-OU', 'DEFAULT');
        let detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraleObjecten(0).link.label).toBe('ASD03 E 10377 A 0001');

        expect(detail.kadastraleObjecten(0).zakelijkRecht.isPresent).toBe(false);

        expect(detail.kadastraleObjecten(0).beperking.isPresent).toBe(true);
        expect(detail.kadastraleObjecten(0).beperking.glossaryHeader.subtitle).toBe('Gemeentelijke beperkingen');
        expect(detail.kadastraleObjecten(0).beperking.list(0).link.label)
            .toBe('Huisvestingsverordening, splitsingsvergunningstelsel, Huisvestingswet');

        expect(detail.kadastraleObjecten(0).aantekeningen.isPresent).toBe(false);

        expect(detail.kadastraleObjecten(0).ontstaanUit.isPresent).toBe(true);
        expect(detail.kadastraleObjecten(0).ontstaanUit.glossaryHeader.subtitle).toBe('Ontstaan uit');
        expect(detail.kadastraleObjecten(0).ontstaanUit.list(0).link.label).toBe('ASD03 E 10341 G 0000');

        page = dp.navigate('MAP_DETAIL--VERBLIJFSOBJECT-ZR-GB-A-BB', 'DEFAULT');
        detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraleObjecten(0).betrokkenBij.isPresent).toBe(true);
        expect(detail.kadastraleObjecten(0).betrokkenBij.glossaryHeader.subtitle).toBe('Betrokken bij');
        expect(detail.kadastraleObjecten(0).betrokkenBij.list(0).text).toBe('ASD04 F 07566 A 0001');
        expect(detail.kadastraleObjecten(0).betrokkenBij.list(1).text).toBe('ASD04 F 07566 A 0002');
        expect(detail.kadastraleObjecten(0).betrokkenBij.list(5).text).toBe('ASD04 F 07566 A 0006');
    });

    it('shows everything for users with the EMPLOYEE and EMPLOYEE_PLUS role', () => {
        ['EMPLOYEE', 'EMPLOYEE_PLUS'].forEach(role => {
            let page = dp.navigate('MAP_DETAIL--VERBLIJFSOBJECT-ZR-GB-A-OU', 'DEFAULT');
            let detail = page.dashboard.rightColumn.detail;

            expect(detail.kadastraleObjecten(0).link.label).toBe('ASD03 E 10377 A 0001');

            expect(detail.kadastraleObjecten(0).zakelijkRecht.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).zakelijkRecht.glossaryHeader.subtitle).toBe('Zakelijke rechten');
            expect(detail.kadastraleObjecten(0).zakelijkRecht.list(0).link.label)
                .toBe('Meesters,Catharina Maria Elisabeth, (V) - Eigendom (recht van) (1/2)');
            expect(detail.kadastraleObjecten(0).zakelijkRecht.list(1).link.label)
                .toBe('Halder,Adrianus Andreas Everdina Maria,van (M) - Eigendom (recht van) (1/2)');

            expect(detail.kadastraleObjecten(0).beperking.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).beperking.glossaryHeader.subtitle).toBe('Gemeentelijke beperkingen');
            expect(detail.kadastraleObjecten(0).beperking.list(0).link.label)
                .toBe('Huisvestingsverordening, splitsingsvergunningstelsel, Huisvestingswet');

            expect(detail.kadastraleObjecten(0).aantekeningen.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).aantekeningen.glossaryHeader.subtitle).toBe('Aantekeningen');
            expect(detail.kadastraleObjecten(0).aantekeningen.list(0).text)
                .toBe('Locatiegegevens ontleend aan Basisregistraties Adressen en Gebouwen');
            expect(detail.kadastraleObjecten(0).aantekeningen.list(1).text)
                .toBe('Besluit op basis van Monumentenwet 1988, opgelegd door De Staat (Onderwijs, Cultuur en Wetensc' +
                    'happen)');

            expect(detail.kadastraleObjecten(0).ontstaanUit.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).ontstaanUit.glossaryHeader.subtitle).toBe('Ontstaan uit');
            expect(detail.kadastraleObjecten(0).ontstaanUit.list(0).link.label).toBe('ASD03 E 10341 G 0000');

            page = dp.navigate('MAP_DETAIL--VERBLIJFSOBJECT-ZR-GB-A-BB', 'DEFAULT');
            detail = page.dashboard.rightColumn.detail;

            expect(detail.kadastraleObjecten(0).betrokkenBij.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).betrokkenBij.glossaryHeader.subtitle).toBe('Betrokken bij');
            expect(detail.kadastraleObjecten(0).betrokkenBij.list(0).text).toBe('ASD04 F 07566 A 0001');
            expect(detail.kadastraleObjecten(0).betrokkenBij.list(1).text).toBe('ASD04 F 07566 A 0002');
            expect(detail.kadastraleObjecten(0).betrokkenBij.list(5).text).toBe('ASD04 F 07566 A 0006');
        });
    });
});
