'use strict';

const
    glossaryHeader = dp.require('modules/detail/components/glossary/header/glossary-header.page-objects'),
    nummeraanduidingHeader = dp.require(
        'modules/detail/components/nummeraanduiding-header/nummeraanduiding-header.page-objects'),
    straatbeeldThumbnail = dp.require(
        'modules/shared/components/straatbeeld-thumbnail/straatbeeld-thumbnail.page-objects'),
    link = dp.require('modules/shared/components/link/link.page-objects');

module.exports = function (detailElement) {
    return {
        get visible () {
            return dp.visible(detailElement);
        },
        get straatbeeldThumbnail () {
            return straatbeeldThumbnail(detailElement.element(by.css('dp-straatbeeld-thumbnail')));
        },
        get aantekeningen () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-aantekeningen')));
        },
        get beperking () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-beperking')));
        },
        get betrokkenBij () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-betrokken-bij')));
        },
        get kadastraalObject () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-kadastraal-object')));
        },
        kadastraleObjecten: function (index) {
            const kadastraleObjecten = detailElement.element(by.css('.qa-kadastraal-object-list'));
            const kadastraalObject = kadastraleObjecten.all(by.css('.qa-brk-vbo')).get(index);

            return kadastraalObjectPageObject(kadastraalObject);
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
        get nummeraanduiding () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-nummeraanduiding')));
        },
        get ontstaanUit () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-ontstaan-uit')));
        },
        get verblijfsobject () {
            return groupedDataPageObject(detailElement.element(by.css('.qa-verblijfsobject')));
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
        },
        list: function (index) {
            const list = groupedDataElement.element(by.css('ul'));
            const listItem = list.all(by.css('li')).get(index);

            return listItemPageObject(listItem);
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

function listItemPageObject (listItemElement) {
    return {
        get link () {
            return link(listItemElement.element(by.css('dp-link')));
        },
        get text () {
            return listItemElement.getText();
        }
    };
}

function kadastraalObjectPageObject (kadastraalObjectElement) {
    return {
        get link () {
            return link(kadastraalObjectElement.all(by.css('dp-link')).get(0));
        },
        get aantekeningen () {
            return groupedDataPageObject(kadastraalObjectElement.element(by.css('.qa-aantekeningen')));
        },
        get beperking () {
            return groupedDataPageObject(kadastraalObjectElement.element(by.css('.qa-beperking')));
        },
        get betrokkenBij () {
            return groupedDataPageObject(kadastraalObjectElement.element(by.css('.qa-betrokken-bij')));
        },
        get ontstaanUit () {
            return groupedDataPageObject(kadastraalObjectElement.element(by.css('.qa-ontstaan-uit')));
        },
        get zakelijkRecht () {
            return groupedDataPageObject(kadastraalObjectElement.element(by.css('.qa-zakelijk-recht')));
        }
    };
}
