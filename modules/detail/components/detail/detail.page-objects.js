'use strict';

const
    glossaryHeader = dp.require('modules/detail/components/glossary/header/glossary-header.page-objects'),
    nummeraanduidingHeader = dp.require(
        'modules/detail/components/nummeraanduiding-header/nummeraanduiding-header.page-objects'),
    straatbeeldThumbnail = dp.require(
        'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.page-objects');

module.exports = function (detailElement) {
    return {
        get visible () {
            return dp.visible(detailElement);
        },
        get straatbeeldThumbnail () {
            return straatbeeldThumbnail(detailElement.element(by.css('dp-straatbeeld-thumbnail')));
        },
        get nummeraanduiding () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-nummeraanduiding')));
        },
        get verblijfsobject () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-verblijfsobject')));
        },




        get aantekeningen () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-aantekeningen')));
        },
        get ontstaanUit () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-ontstaan-uit')));
        },
        get betrokkenBij () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-betrokken-bij')));
        },
        get beperking () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-beperking')));
        },
        get kadastraalObject () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-kadastraal-object')));
        },
        get kadastraalSubject () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-kadastraal-subject')));
        },
        get natuurlijkPersoon () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-natuurlijk-persoon')));
        },
        get nietNatuurlijkPersoon () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-niet-natuurlijk-persoon')));
        },
        get zakelijkRecht () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-zakelijk-recht')));
        }
    };
};

function groupedDataPageObject (groupedDataElement) {
    return {
        get isPresent () {
            return groupedDataElement.isPresent();
        },
        get glossaryHeader () {
            return glossaryHeader(groupedDataElement.element(by.css('dp-glossary-header')));
        },
        get nummeraanduidingHeader () {
            return nummeraanduidingHeader(groupedDataElement.element(by.css('dp-nummeraanduiding-header')));
        },
        get descriptionList () {
            return descriptionListPageObject(groupedDataElement.element(by.css('dl')));
        }
    };
}

function descriptionListPageObject (definitionListElement) {
    return {
        term: function (index) {
            return definitionListElement.all(by.css('dt')).get(index).getText();
        },
        definition: function (index) {
            return definitionListElement.all(by.css('dd')).get(index).getText();
        }
    };
}
